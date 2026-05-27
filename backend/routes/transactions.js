const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const getDb = () => admin.firestore();

// Initialize Transaction (Escrow)
router.post('/initiate', async (req, res) => {
  try {
    const { buyerId, productId, quantity, deliveryLocation, totalAmount } = req.body;
    const db = getDb();

    const platformFee = totalAmount * 0.02;  // 2%
    const logisticsFee = totalAmount * 0.05; // 5%
    const farmerAmount = totalAmount - platformFee - logisticsFee;

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
      createdAt: new Date(),
      updatedAt: new Date(),
      timeline: [{ status: 'created', timestamp: new Date(), note: 'Transaction initiated' }],
    };

    const transactionRef = await db.collection('transactions').add(transactionData);

    // Initialize Paystack if keys exist
    let paymentUrl = null;
    if (process.env.PAYSTACK_SECRET_KEY) {
      const Paystack = require('paystack-api')(process.env.PAYSTACK_SECRET_KEY);
      const buyerDoc = await db.collection('users').doc(buyerId).get();
      const buyer = buyerDoc.data();

      const paystackResponse = await Paystack.transaction.initialize({
        amount: Math.round(totalAmount * 100),
        email: buyer.email || `${buyer.phoneNumber.replace('+', '')}@farmlink.ng`,
        reference: `FL_${transactionRef.id}_${Date.now()}`,
        callback_url: `${process.env.BASE_URL || 'https://farm-link-bmiv-cpk3unx1j-ibitoyeoluwasegunemmanuel-ops-projects.vercel.app'}/api/transactions/verify`,
        metadata: { transactionId: transactionRef.id, buyerId, productId },
      });

      paymentUrl = paystackResponse.data.authorization_url;
      await transactionRef.update({ paymentReference: paystackResponse.data.reference, paymentUrl });
    }

    res.json({ success: true, transactionId: transactionRef.id, paymentUrl });
  } catch (error) {
    console.error('Transaction Error:', error);
    res.status(500).json({ error: 'Failed to initiate transaction', details: error.message });
  }
});

// Verify Payment (Paystack Webhook)
router.post('/verify', async (req, res) => {
  try {
    const { reference } = req.body;
    const db = getDb();

    if (process.env.PAYSTACK_SECRET_KEY) {
      const Paystack = require('paystack-api')(process.env.PAYSTACK_SECRET_KEY);
      const verification = await Paystack.transaction.verify({ reference });

      if (verification.data.status === 'success') {
        const { transactionId } = verification.data.metadata;

        await db.collection('transactions').doc(transactionId).update({
          status: 'paid',
          escrowStatus: 'held',
          paidAt: new Date(),
          updatedAt: new Date(),
          timeline: admin.firestore.FieldValue.arrayUnion({
            status: 'paid',
            timestamp: new Date(),
            note: 'Payment received and held in escrow',
          }),
        });

        const txDoc = await db.collection('transactions').doc(transactionId).get();
        const tx = txDoc.data();

        await db.collection('notifications').add({
          userId: tx.farmerId,
          type: 'sale',
          title: 'New Order Received!',
          message: `New order for ${tx.quantity} units. Payment secured in escrow.`,
          data: { transactionId },
          createdAt: new Date(),
          read: false,
        });
      }
    }

    res.json({ success: true });
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

// Get user transactions
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDb();

    const [asBuyer, asFarmer] = await Promise.all([
      db.collection('transactions').where('buyerId', '==', userId).orderBy('createdAt', 'desc').limit(20).get(),
      db.collection('transactions').where('farmerId', '==', userId).orderBy('createdAt', 'desc').limit(20).get(),
    ]);

    const transactions = [
      ...asBuyer.docs.map(d => ({ id: d.id, ...d.data() })),
      ...asFarmer.docs.map(d => ({ id: d.id, ...d.data() })),
    ].sort((a, b) => b.createdAt - a.createdAt);

    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions', details: error.message });
  }
});

module.exports = router;
