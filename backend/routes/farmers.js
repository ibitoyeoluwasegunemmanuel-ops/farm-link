const express = require('express');
const router = express.Router();
const { db, bucket } = require('../server');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const upload = multer({ storage: multer.memoryStorage() });

// Get Farmer Profile
router.get('/profile/:farmerId', async (req, res) => {
	try {
		const { farmerId } = req.params;
    
		const farmerDoc = await db.collection('farmers').doc(farmerId).get();
		if (!farmerDoc.exists) {
			return res.status(404).json({ error: 'Farmer not found' });
		}

		// Get user data
		const userDoc = await db.collection('users').doc(farmerId).get();
		const userData = userDoc.exists ? userDoc.data() : {};

		// Get harvests
		const harvestsQuery = await db.collection('harvests')
			.where('farmerId', '==', farmerId)
			.orderBy('createdAt', 'desc')
			.get();

		const harvests = [];
		harvestsQuery.forEach(doc => {
			harvests.push({ id: doc.id, ...doc.data() });
		});

		// Get transactions
		const transactionsQuery = await db.collection('transactions')
			.where('farmerId', '==', farmerId)
			.orderBy('createdAt', 'desc')
			.limit(10)
			.get();

		const transactions = [];
		transactionsQuery.forEach(doc => {
			transactions.push({ id: doc.id, ...doc.data() });
		});

		res.json({
			success: true,
			data: {
				...farmerDoc.data(),
				...userData,
				harvests,
				transactions
			}
		});
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch farmer profile' });
	}
});

// Update Farmer Profile
router.put('/profile/:farmerId', upload.array('documents', 5), async (req, res) => {
	try {
		const { farmerId } = req.params;
		const { farmName, location, farmSize, crops, description } = req.body;

		const updateData = {
			farmName,
			location: JSON.parse(location),
			farmSize,
			crops: JSON.parse(crops),
			description,
			updatedAt: new Date()
		};

		// Upload documents if any
		if (req.files && req.files.length > 0) {
			const documentUrls = [];
			for (const file of req.files) {
				const filename = `farmers/${farmerId}/documents/${uuidv4()}_${file.originalname}`;
				const fileUpload = bucket.file(filename);
        
				await fileUpload.save(file.buffer, {
					metadata: { contentType: file.mimetype }
				});
        
				await fileUpload.makePublic();
				documentUrls.push({
					url: `https://storage.googleapis.com/${bucket.name}/${filename}`,
					type: file.mimetype,
					uploadedAt: new Date()
				});
			}
			updateData.documents = documentUrls;
		}

		await db.collection('farmers').doc(farmerId).update(updateData);

		res.json({ success: true, message: 'Profile updated successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to update profile' });
	}
});

// Get Farmer Dashboard Stats
router.get('/dashboard/:farmerId', async (req, res) => {
	try {
		const { farmerId } = req.params;

		const [
			harvestsSnapshot,
			activeHarvestsSnapshot,
			transactionsSnapshot,
			completedTransactionsSnapshot
		] = await Promise.all([
			db.collection('harvests').where('farmerId', '==', farmerId).get(),
			db.collection('harvests').where('farmerId', '==', farmerId).where('status', '==', 'available').get(),
			db.collection('transactions').where('farmerId', '==', farmerId).get(),
			db.collection('transactions').where('farmerId', '==', farmerId).where('status', '==', 'completed').get()
		]);

		let totalEarnings = 0;
		completedTransactionsSnapshot.forEach(doc => {
			totalEarnings += doc.data().farmerAmount || 0;
		});

		res.json({
			success: true,
			stats: {
				totalHarvests: harvestsSnapshot.size,
				activeHarvests: activeHarvestsSnapshot.size,
				totalTransactions: transactionsSnapshot.size,
				completedSales: completedTransactionsSnapshot.size,
				totalEarnings,
				pendingPayments: transactionsSnapshot.size - completedTransactionsSnapshot.size
			}
		});
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch dashboard stats' });
	}
});

// Get My Harvests
router.get('/harvests/:farmerId', async (req, res) => {
	try {
		const { farmerId } = req.params;
		const { status, page = 1, limit = 20 } = req.query;

		let query = db.collection('harvests')
			.where('farmerId', '==', farmerId)
			.orderBy('createdAt', 'desc');

		if (status) {
			query = query.where('status', '==', status);
		}

		const snapshot = await query.limit(parseInt(limit)).get();
    
		const harvests = [];
		snapshot.forEach(doc => {
			harvests.push({ id: doc.id, ...doc.data() });
		});

		res.json({ success: true, count: harvests.length, data: harvests });
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch harvests' });
	}
});

module.exports = router;
