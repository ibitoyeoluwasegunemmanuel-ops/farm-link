
const express = require('express');
const router = express.Router();
const { db, admin } = require('../server');

// Get Transporter Profile
router.get('/profile/:transporterId', async (req, res) => {
	try {
		const { transporterId } = req.params;
    
		const transporterDoc = await db.collection('transporters').doc(transporterId).get();
		if (!transporterDoc.exists) {
			return res.status(404).json({ error: 'Transporter not found' });
		}

		const data = transporterDoc.data();

		// Get trucks
		const trucks = [];
		if (data.trucks && data.trucks.length > 0) {
			for (const truckId of data.trucks) {
				const truckDoc = await db.collection('trucks').doc(truckId).get();
				if (truckDoc.exists) {
					trucks.push({ id: truckDoc.id, ...truckDoc.data() });
				}
			}
		}

		// Get delivery jobs
		const jobsQuery = await db.collection('deliveryJobs')
			.where('transporterId', '==', transporterId)
			.orderBy('createdAt', 'desc')
			.limit(20)
			.get();

		const jobs = [];
		jobsQuery.forEach(doc => {
			jobs.push({ id: doc.id, ...doc.data() });
		});

		res.json({
			success: true,
			data: {
				...data,
				trucks,
				jobs
			}
		});
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch transporter profile' });
	}
});

// Update Transporter Profile
router.put('/profile/:transporterId', async (req, res) => {
	try {
		const { transporterId } = req.params;
		const { driverName, licenseNumber, emergencyContact } = req.body;

		await db.collection('transporters').doc(transporterId).update({
			driverName,
			licenseNumber,
			emergencyContact,
			updatedAt: new Date()
		});

		res.json({ success: true, message: 'Profile updated successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to update profile' });
	}
});

// Get Transporter Dashboard Stats
router.get('/dashboard/:transporterId', async (req, res) => {
	try {
		const { transporterId } = req.params;

		const [
			trucksSnapshot,
			jobsSnapshot,
			completedJobsSnapshot,
			activeJobsSnapshot
		] = await Promise.all([
			db.collection('trucks').where('transporterId', '==', transporterId).get(),
			db.collection('deliveryJobs').where('transporterId', '==', transporterId).get(),
			db.collection('deliveryJobs')
				.where('transporterId', '==', transporterId)
				.where('status', '==', 'delivered')
				.get(),
			db.collection('deliveryJobs')
				.where('transporterId', '==', transporterId)
				.where('status', 'in', ['accepted', 'pickup', 'in_transit'])
				.get()
		]);

		let totalEarnings = 0;
		completedJobsSnapshot.forEach(doc => {
			const job = doc.data();
			totalEarnings += (job.agreedPrice || 0) - (job.platformFee || 0);
		});

		res.json({
			success: true,
			stats: {
				totalTrucks: trucksSnapshot.size,
				totalJobs: jobsSnapshot.size,
				completedDeliveries: completedJobsSnapshot.size,
				activeDeliveries: activeJobsSnapshot.size,
				totalEarnings,
				rating: 4.5 // Calculate from reviews
			}
		});
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch dashboard stats' });
	}
});

// Get Available Jobs (Nearby)
router.get('/jobs/available', async (req, res) => {
	try {
		const { lat, lng, radius = 50 } = req.query; // radius in km

		let query = db.collection('deliveryJobs')
			.where('status', '==', 'pending')
			.orderBy('createdAt', 'desc');

		const snapshot = await query.limit(50).get();
    
		const jobs = [];
		for (const doc of snapshot.docs) {
			const job = doc.data();
      
			// Get transaction details
			const transactionDoc = await db.collection('transactions').doc(job.transactionId).get();
			const harvestDoc = await db.collection('harvests').doc(transactionDoc.data()?.harvestId).get();
      
			jobs.push({
				id: doc.id,
				...job,
				harvest: harvestDoc.exists ? harvestDoc.data() : null,
				distance: calculateDistance(
					parseFloat(lat), 
					parseFloat(lng),
					job.pickupLocation?.coordinates?.lat,
					job.pickupLocation?.coordinates?.lng
				)
			});
		}

		// Sort by distance
		jobs.sort((a, b) => (a.distance || 999) - (b.distance || 999));

		res.json({ success: true, count: jobs.length, data: jobs });
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch available jobs' });
	}
});

// Accept Job
router.post('/jobs/:jobId/accept', async (req, res) => {
	try {
		const { jobId } = req.params;
		const { transporterId, truckId } = req.body;

		await db.collection('deliveryJobs').doc(jobId).update({
			transporterId,
			truckId,
			status: 'accepted',
			acceptedAt: new Date(),
			updatedAt: new Date()
		});

		// Notify buyer and farmer
		const jobDoc = await db.collection('deliveryJobs').doc(jobId).get();
		const job = jobDoc.data();

		await db.collection('notifications').add({
			userId: job.buyerId,
			type: 'delivery_accepted',
			title: 'Driver Assigned',
			message: 'A driver has accepted your delivery request',
			data: { jobId },
			createdAt: new Date(),
			read: false
		});

		res.json({ success: true, message: 'Job accepted successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to accept job' });
	}
});

// Update Delivery Status
router.post('/jobs/:jobId/status', async (req, res) => {
	try {
		const { jobId } = req.params;
		const { status, location, note } = req.body;

		const updateData = {
			status,
			updatedAt: new Date()
		};

		if (location) {
			updateData.currentLocation = location;
		}

		// Add to tracking history
		updateData.tracking = admin.firestore.FieldValue.arrayUnion({
			status,
			location,
			note,
			timestamp: new Date()
		});

		if (status === 'delivered') {
			updateData.deliveredAt = new Date();
		}

		await db.collection('deliveryJobs').doc(jobId).update(updateData);

		// Notify parties
		const jobDoc = await db.collection('deliveryJobs').doc(jobId).get();
		const job = jobDoc.data();

		const notification = {
			type: 'delivery_update',
			title: `Delivery ${status.replace('_', ' ')}`,
			message: note || `Your delivery is now ${status}`,
			data: { jobId, status },
			createdAt: new Date(),
			read: false
		};

		await db.collection('notifications').add({
			...notification,
			userId: job.buyerId
		});

		await db.collection('notifications').add({
			...notification,
			userId: job.farmerId
		});

		res.json({ success: true, message: 'Status updated successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to update status' });
	}
});

// Get My Jobs
router.get('/jobs/:transporterId', async (req, res) => {
	try {
		const { transporterId } = req.params;
		const { status } = req.query;

		let query = db.collection('deliveryJobs')
			.where('transporterId', '==', transporterId)
			.orderBy('createdAt', 'desc');

		if (status) {
			query = query.where('status', '==', status);
		}

		const snapshot = await query.get();
    
		const jobs = [];
		for (const doc of snapshot.docs) {
			const job = doc.data();
      
			// Get related data
			const [transactionDoc, harvestDoc, truckDoc] = await Promise.all([
				db.collection('transactions').doc(job.transactionId).get(),
				db.collection('harvests').doc(job.harvestId).get(),
				db.collection('trucks').doc(job.truckId).get()
			]);

			jobs.push({
				id: doc.id,
				...job,
				harvest: harvestDoc.exists ? harvestDoc.data() : null,
				truck: truckDoc.exists ? truckDoc.data() : null
			});
		}

		res.json({ success: true, count: jobs.length, data: jobs });
	} catch (error) {
		res.status(500). json({ error: 'Failed to fetch jobs' });
	}
});

// Helper function
function calculateDistance(lat1, lon1, lat2, lon2) {
	if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  
	const R = 6371; // Earth's radius in km
	const dLat = (lat2 - lat1) * Math.PI
