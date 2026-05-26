const express = require('express');
const router = express.Router();
const { db } = require('../server');
const geolib = require('geolib');

// Register Truck (Transporter)
router.post('/register-truck', async (req, res) => {
	try {
		const { transporterId, truckNumber, truckType, capacity, 
						licenseExpiry, insuranceNumber, documents } = req.body;

		const truckData = {
			transporterId,
			truckNumber,
			truckType, // mini_truck, pickup, lorry, trailer, tanker
			capacity: parseFloat(capacity), // in tonnes
			licenseExpiry: new Date(licenseExpiry),
			insuranceNumber,
			documents, // URLs to scanned documents
			isVerified: false,
			isAvailable: true,
			currentLocation: null,
			rating: 0,
			totalTrips: 0,
			createdAt: new Date()
		};

		const truckRef = await db.collection('trucks').add(truckData);
    
		// Add to transporter's trucks array
		await db.collection('transporters').doc(transporterId).update({
			trucks: admin.firestore.FieldValue.arrayUnion(truckRef.id)
		});

		res.json({ success: true, truckId: truckRef.id });
	} catch (error) {
		res.status(500).json({ error: 'Failed to register truck' });
	}
});

// Find Available Trucks (Uber-style matching)
router.post('/find-trucks', async (req, res) => {
	try {
		const { pickupLocation, deliveryLocation, requiredCapacity, goodsType } = req.body;

		// Get all available trucks
		const trucksQuery = await db.collection('trucks')
			.where('isAvailable', '==', true)
			.where('isVerified', '==', true)
			.get();

		const availableTrucks = [];
    
		trucksQuery.forEach(doc => {
			const truck = doc.data();
      
			// Filter by capacity
			if (truck.capacity >= parseFloat(requiredCapacity)) {
				// Calculate distance from pickup (if truck location available)
				let distance = null;
				if (truck.currentLocation) {
					distance = geolib.getDistance(
						{ latitude: pickupLocation.lat, longitude: pickupLocation.lng },
						{ latitude: truck.currentLocation.lat, longitude: truck.currentLocation.lng }
					);
				}

				availableTrucks.push({
					id: doc.id,
					...truck,
					distance: distance ? (distance / 1000).toFixed(2) + ' km' : 'Unknown'
				});
			}
		});

		// Sort by distance if available
		availableTrucks.sort((a, b) => {
			if (a.distance === 'Unknown') return 1;
			if (b.distance === 'Unknown') return -1;
			return parseFloat(a.distance) - parseFloat(b.distance);
		});

		res.json({ success: true, trucks: availableTrucks });
	} catch (error) {
		res.status(500).json({ error: 'Failed to find trucks' });
	}
});

// Create Delivery Job
router.post('/create-job', async (req, res) => {
	try {
		const { transactionId, truckId, pickupLocation, deliveryLocation, 
						goodsDescription, estimatedDistance, agreedPrice } = req.body;

		const jobData = {
			transactionId,
			truckId,
			transporterId: null, // Will be set when driver accepts
			pickupLocation,
			deliveryLocation,
			goodsDescription,
			estimatedDistance,
			agreedPrice,
			platformFee: agreedPrice * 0.05, // 5% commission
			status: 'pending', // pending, accepted, pickup, in_transit, delivered, cancelled
			tracking: [],
			createdAt: new Date(),
			updatedAt: new Date()
		};

		const jobRef = await db.collection('deliveryJobs').add(jobData);

		// Notify transporter
		const truckDoc = await db.collection('trucks').doc(truckId).get();
		const truck = truckDoc.data();
    
		await db.collection('notifications').add({
			userId: truck.transporterId,
			type: 'delivery_request',
			title: 'New Delivery Job',
			message: `Delivery from ${pickupLocation.town} to ${deliveryLocation.town}. ₦${agreedPrice}`,
			data: { jobId: jobRef.id },
			createdAt: new Date(),
			read: false
		});

		res.json({ success: true, jobId: jobRef.id });
	} catch (error) {
		res.status(500).json({ error: 'Failed to create job' });
	}
});

// Update Location (Real-time tracking)
router.post('/update-location/:jobId', async (req, res) => {
	try {
		const { jobId } = req.params;
		const { lat, lng, status } = req.body;

		const updateData = {
			currentLocation: { lat, lng },
			updatedAt: new Date()
		};

		if (status) {
			updateData.status = status;
			updateData.tracking = admin.firestore.FieldValue.arrayUnion({
				status,
				location: { lat, lng },
				timestamp: new Date()
			});
		}

		await db.collection('deliveryJobs').doc(jobId).update(updateData);

		// Broadcast to buyer/farmer (in production, use Firebase Realtime DB or Socket.io)
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: 'Failed to update location' });
	}
});

module.exports = router;
