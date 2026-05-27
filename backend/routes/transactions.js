const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const crypto = require('crypto');

const getDb = () => admin.firestore();

const getFlw = () => {
  const Flutterwave = require('flutterwave-node-v3');
  return new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
};

const BASE_URL = process.env.BASE_URL ||
  'https://farm-link-bmiv-cpk3unx1j-ibitoyeoluwasegunemmanuel-ops-projects.vercel.app';

// Initiate Transaction (Escrow) — returns Flutterwave payment link
router.post('/initiate', async (req, res) => {
  try {
    const { buyerId, productId, quantity, deliveryLocation, totalAmount } = req.body;
    const db = getDb();

    const platformFee = totalAmount * 0.02;
    const logisticsFee = totalAmount * 0.05;
    const farmerAmount = totalAmount - platformFee - logisticsFee;

    const txRef = `FL_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const transactionData = {
      buyerId,
      productId,
      quantity,
      totalAmount,
      platformFee,
      logisticsFee,
      farmerAmount,
      deliveryLocation,
      status: 'pending_payment',
      escrowStatus: 'holding',
      paymentReference: txRef,
      createdAt: new Date(),
      updatedAt: new Date(),
      timeline: [{ status: 'created', timestamp: new Date(), note: 'Transaction initiated' }],
    };

    const transactionRef = await db.collection('transactions').add(transactionData);

    let paymentLink = null;

    if (process.env.FLW_PUBLIC_KEY && process.env.FLW_SECRET_KEY) {
      const buyerDoc = await db.collection('users').doc(buyerId).get();
      const buyer = buyerDoc.data() || {};
      const email = buyer.email || `${(buyer.phoneNumber || buyerId).replace(/\D/g, '')}@farmlink.ng`;
      const name = buyer.fullName || 'FarmLink User';
      const phone = buyer.phoneNumber || '';

      const productDoc = await db.collection('harvests').doc(productId).get();
      const product = productDoc.exists ? productDoc.data() : {};

      const flw = getFlw();
      const payload = {
        tx_ref: txRef,
        amount: totalAmount,
        currency: 'NGN',
        redirect_url: `${BASE_URL}/api/transactions/flw-callback`,
        customer: { email, phonenumber: phone, name },
        customizations: {
          title: 'FarmLink Payment',
          description: `Payment for ${quantity} unit(s) of ${product.cropType || 'produce'}`,
          logo: 'https://farmlink.ng/logo.png',
        },
        meta: { transactionId: transactionRef.id, buyerId, productId },
      };

      const response = await flw.Payment.initiate(payload);
      if (response.status === 'success') {
        paymentLink = response.data.link;
        await transactionRef.update({ paymentLink });
      }
    }

    res.json({ success: true, transactionId: transactionRef.id, paymentLink, txRef });
  } catch (error) {
    console.error('Transaction initiate error:', error);
    res.status(500).json({ error: 'Failed to initiate transaction', details: error.message });
  }
});

// Flutterwave redirect callback (GET — browser redirect after payment)
router.get('/flw-callback', async (req, res) => {
  const { status, tx_ref, transaction_id } = req.query;
  const db = getDb();

  try {
    if (status === 'successful' && transaction_id) {
      const flw = getFlw();
      const response = await flw.Transaction.verify({ id: transaction_id });

      if (
        response.data.status === 'successful' &&
        response.data.tx_ref === tx_ref &&
        response.data.currency === 'NGN'
      ) {
        const txSnap = await db.collection('transactions')
          .where('paymentReference', '==', tx_ref).limit(1).get();

        if (!txSnap.empty) {
          const txDoc = txSnap.docs[0];
          const tx = txDoc.data();

          if (tx.status === 'pending_payment') {
            await txDoc.ref.update({
              status: 'paid',
              escrowStatus: 'held',
              flwTransactionId: transaction_id,
              paidAt: new Date(),
              updatedAt: new Date(),
              timeline: admin.firestore.FieldValue.arrayUnion({
                status: 'paid',
                timestamp: new Date(),
                note: 'Payment verified and held in escrow',
              }),
            });

            if (tx.farmerId) {
              await db.collection('notifications').add({
                userId: tx.farmerId,
                type: 'sale',
                title: 'New Order Received!',
                message: `New order for ${tx.quantity} units. Payment secured in escrow.`,
                data: { transactionId: txDoc.id },
                createdAt: new Date(),
                read: false,
              });
            }
          }
        }
      }
    }

    // Redirect to app deep link or success page
    const appLink = status === 'successful'
      ? `farmlink://payment-success?tx_ref=${tx_ref}`
      : `farmlink://payment-failed?tx_ref=${tx_ref}`;
    res.redirect(appLink);
  } catch (error) {
    console.error('FLW callback error:', error);
    res.redirect(`farmlink://payment-failed?tx_ref=${tx_ref}`);
  }
});

// Flutterwave Webhook (POST — server-to-server event)
router.post('/flw-webhook', async (req, res) => {
  const secretHash = process.env.FLW_WEBHOOK_HASH;
  const signature = req.headers['verif-hash'];

  if (secretHash && signature !== secretHash) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { event, data } = req.body;
  const db = getDb();

  try {
    if (event === 'charge.completed' && data.status === 'successful') {
      const txSnap = await db.collection('transactions')
        .where('paymentReference', '==', data.tx_ref).limit(1).get();

      if (!txSnap.empty) {
        const txDoc = txSnap.docs[0];
        const tx = txDoc.data();

        if (tx.status === 'pending_payment') {
          await txDoc.ref.update({
            status: 'paid',
            escrowStatus: 'held',
            flwTransactionId: String(data.id),
            paidAt: new Date(),
            updatedAt: new Date(),
            timeline: admin.firestore.FieldValue.arrayUnion({
              status: 'paid',
              timestamp: new Date(),
              note: 'Payment confirmed via webhook',
            }),
          });

          if (tx.farmerId) {
            await db.collection('notifications').add({
              userId: tx.farmerId,
              type: 'sale',
              title: 'New Order Received!',
              message: `New order for ${tx.quantity} units. Payment secured in escrow.`,
              data: { transactionId: txDoc.id },
              createdAt: new Date(),
              read: false,
            });
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
});

// Manual verify (mobile can call after redirect)
router.post('/verify', async (req, res) => {
  try {
    const { transactionId, flwTransactionId } = req.body;
    const db = getDb();

    if (!process.env.FLW_SECRET_KEY) {
      return res.status(503).json({ error: 'Payment provider not configured' });
    }

    const flw = getFlw();
    const response = await flw.Transaction.verify({ id: flwTransactionId });

    if (response.data.status === 'successful') {
      await db.collection('transactions').doc(transactionId).update({
        status: 'paid',
        escrowStatus: 'held',
        flwTransactionId: String(flwTransactionId),
        paidAt: new Date(),
        updatedAt: new Date(),
        timeline: admin.firestore.FieldValue.arrayUnion({
          status: 'paid',
          timestamp: new Date(),
          note: 'Payment manually verified',
        }),
      });
    }

    res.json({ success: true, status: response.data.status });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed', details: error.message });
  }
});

// Release Escrow to Farmer
router.post('/release/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const db = getDb();

    const txDoc = await db.collection('transactions').doc(transactionId).get();
    if (!txDoc.exists) return res.status(404).json({ error: 'Transaction not found' });

    const tx = txDoc.data();
    if (tx.status !== 'delivered') {
      return res.status(400).json({ error: 'Delivery not confirmed yet' });
    }

    await db.collection('transactions').doc(transactionId).update({
      status: 'completed',
      escrowStatus: 'released',
      completedAt: new Date(),
      updatedAt: new Date(),
      timeline: admin.firestore.FieldValue.arrayUnion({
        status: 'completed',
        timestamp: new Date(),
        note: 'Payment released to farmer',
      }),
    });

    if (tx.farmerId) {
      await db.collection('farmers').doc(tx.farmerId).update({
        totalSales: admin.firestore.FieldValue.increment(tx.farmerAmount),
        totalTransactions: admin.firestore.FieldValue.increment(1),
      });
    }

    res.json({ success: true, message: 'Payment released to farmer' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to release payment', details: error.message });
  }
});

// Confirm delivery (buyer action)
router.post('/confirm-delivery/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { buyerId } = req.body;
    const db = getDb();

    const txDoc = await db.collection('transactions').doc(transactionId).get();
    if (!txDoc.exists) return res.status(404).json({ error: 'Transaction not found' });

    const tx = txDoc.data();
    if (tx.buyerId !== buyerId) return res.status(403).json({ error: 'Unauthorized' });
    if (tx.status !== 'in_transit') return res.status(400).json({ error: 'Not in transit' });

    await txDoc.ref.update({
      status: 'delivered',
      deliveredAt: new Date(),
      updatedAt: new Date(),
      timeline: admin.firestore.FieldValue.arrayUnion({
        status: 'delivered',
        timestamp: new Date(),
        note: 'Buyer confirmed delivery',
      }),
    });

    res.json({ success: true, message: 'Delivery confirmed. Escrow will be released to farmer.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to confirm delivery', details: error.message });
  }
});

// Get user transactions
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDb();

    const [asBuyer, asFarmer] = await Promise.all([
      db.collection('transactions').where('buyerId', '==', userId).orderBy('createdAt', 'desc').limit(20).get(),
      db.collection('transactions').where('farmerId', '==', userId).orderBy('createdAt', 'desc').limit(20).get(),
    ]);

    const seen = new Set();
    const transactions = [
      ...asBuyer.docs.map(d => ({ id: d.id, ...d.data() })),
      ...asFarmer.docs.map(d => ({ id: d.id, ...d.data() })),
    ]
      .filter(t => { if (seen.has(t.id)) return false; seen.add(t.id); return true; })
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions', details: error.message });
  }
});

// Get single transaction
router.get('/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const db = getDb();

    const txDoc = await db.collection('transactions').doc(transactionId).get();
    if (!txDoc.exists) return res.status(404).json({ error: 'Transaction not found' });

    res.json({ success: true, transaction: { id: txDoc.id, ...txDoc.data() } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction', details: error.message });
  }
});

module.exports = router;
