const express = require('express');
const router = express.Router();
const { db } = require('../server');
const Paystack = require('paystack-api')(process.env.PAYSTACK_SECRET_KEY);

// Initialize Transaction (Escrow)
router.post('/initiate', async (req, res) => {
	try {
		const { buyerId, harvestId, quantity, deliveryLocation } = req.body;

		// Get harvest details
		const harvestDoc = await db.collection('harvests').doc(harvestId).get();
		if (!harvestDoc.exists) {
			return res.status(404).json({ error: 'Harvest not found' });
		}

		const harvest = harvestDoc.data();
		const totalAmount = quantity * harvest.pricePerUnit;
		const platformFee = totalAmount * 0.01; // 1% commission
		const farmerAmount = totalAmount - platformFee;

		// Create transaction
		const transactionData = {
			buyerId,
			farmerId: harvest.farmerId,
			harvestId,
			quantity,
			pricePerUnit: harvest.pricePerUnit,
			totalAmount,
			platformFee,
			farmerAmount,
			status: 'pending_payment', // pending_payment, paid, in_transit, delivered, completed, disputed, cancelled
			deliveryLocation,
			escrowStatus: 'holding',
			createdAt: new Date(),
			updatedAt: new Date(),
			timeline: [{
				status: 'created',
				timestamp: new Date(),
				note: 'Transaction initiated'
			}]
		};

		const transactionRef = await db.collection('transactions').add(transactionData);

		// Initialize Paystack payment
		const buyerDoc = await db.collection('users').doc(buyerId).get();
		const buyer = buyerDoc.data();

		const paymentData = {
			amount: totalAmount * 100, // Paystack uses kobo
			email: buyer.email || `${buyer.phoneNumber}@farmlink.ng`,
			reference: `FL_${transactionRef.id}_${Date.now()}`,
			callback_url: `${process.env.BASE_URL}/api/transactions/verify`,
			metadata: {
				transactionId: transactionRef.id,
				buyerId,
				harvestId
			}
		};

		const paystackResponse = await Paystack.transaction.initialize(paymentData);

		// Update transaction with payment reference
		await transactionRef.update({
			paymentReference: paystackResponse.data.reference,
			authorizationUrl: paystackResponse.data.authorization_url
		});

		res.json({
			success: true,
			transactionId: transactionRef.id,
			paymentUrl: paystackResponse.data.authorization_url
		});
	} catch (error) {
		console.error('Transaction Error:', error);
		res.status(500).json({ error: 'Failed to initiate transaction' });
	}
});

// Verify Payment (Webhook)
router.post('/verify', async (req, res) => {
	try {
		const { reference } = req.body;
    
		const verification = await Paystack.transaction.verify({ reference });
    
		if (verification.data.status === 'success') {
			const { transactionId } = verification.data.metadata;
      
			await db.collection('transactions').doc(transactionId).update({
				status: 'paid',
				escrowStatus: 'held',
				paidAt: new Date(),
				'timeline': admin.firestore.FieldValue.arrayUnion({
					status: 'paid',
					timestamp: new Date(),
					note: 'Payment received and held in escrow'
				})
			});

			// Reserve the harvest
			const transactionDoc = await db.collection('transactions').doc(transactionId).get();
			const transaction = transactionDoc.data();
      
			await db.collection('harvests').doc(transaction.harvestId).update({
				status: 'reserved',
				reservedQuantity: transaction.quantity,
				reservedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
			});

			// Notify farmer
			await db.collection('notifications').add({
				userId: transaction.farmerId,
				type: 'sale',
				title: 'New Order Received!',
				message: `You have a new order for ${transaction.quantity} units. Payment secured in escrow.`,
				data: { transactionId },
				createdAt: new Date(),
				read: false
			});
		}

		res.json({ success: true });
	} catch (error) {
		console.error('Verification Error:', error);
		res.status(500).json({ error: 'Verification failed' });
	}
});

// Release Payment to Farmer (After Delivery Confirmation)
router.post('/release/:transactionId', async (req, res) => {
	try {
		const { transactionId } = req.params;
		const { confirmedBy } = req.body; // buyer confirms delivery

		const transactionDoc = await db.collection('transactions').doc(transactionId).get();
		if (!transactionDoc.exists) {
			return res.status(404).json({ error: 'Transaction not found' });
		}

		const transaction = transactionDoc.data();

		if (transaction.status !== 'delivered') {
			return res.status(400).json({ error: 'Delivery not confirmed yet' });
		}

		// Transfer to farmer (minus 1% fee)
		// In production, this would use Paystack Transfer API
		await db.collection('transactions').doc(transactionId).update({
			status: 'completed',
			escrowStatus: 'released',
			completedAt: new Date(),
			'timeline': admin.firestore.FieldValue.arrayUnion({
				status: 'completed',
				timestamp: new Date(),
				note: 'Payment released to farmer'
			})
		});

		// Update farmer stats
		await db.collection('farmers').doc(transaction.farmerId).update({
			totalSales: admin.firestore.FieldValue.increment(transaction.farmerAmount),
			totalTransactions: admin.firestore.FieldValue.increment(1)
		});

		res.json({ success: true, message: 'Payment released to farmer' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to release payment' });
	}
});

module.exports = router;
