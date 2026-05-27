const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const getDb = () => admin.firestore();

// Register Truck
router.post('/register-truck', async (req, res) => {
  try {
    const { transporterId, truckNumber, truckType, capacity, licenseExpiry, insuranceNumber, documents } = req.body;
    const db = getDb();

    const truckData = {
      transporterId,
      truckNumber,
      truckType,
      capacity: parseFloat(capacity),
      licenseExpiry: new Date(licenseExpiry),
      insuranceNumber,
      documents: documents || [],
      isVerified: false,
      isAvailable: true,
      currentLocation: null,
      rating: 0,
      totalTrips: 0,
      createdAt: new Date(),
    };

    const truckRef = await db.collection('trucks').add(truckData);

    await db.collection('transporters').doc(transporterId).update({
      trucks: admin.firestore.FieldValue.arrayUnion(truckRef.id),
    });

    res.json({ success: true, truckId: truckRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register truck', details: error.message });
  }
});

// Find Available Trucks
router.post('/find-trucks', async (req, res) => {
  try {
    const { pickupLocation, requiredCapacity } = req.body;
    const db = getDb();

    const trucksQuery = await db.collection('trucks')
      .where('isAvailable', '==', true)
      .where('isVerified', '==', true)
      .get();

    const availableTrucks = trucksQuery.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(truck => truck.capacity >= parseFloat(requiredCapacity || 0));

    res.json({ success: true, trucks: availableTrucks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to find trucks', details: error.message });
  }
});

// Create Delivery Job
router.post('/create-job', async (req, res) => {
  try {
    const { transactionId, truckId, pickupLocation, deliveryLocation, goodsDescription, estimatedDistance, agreedPrice } = req.body;
    const db = getDb();

    const jobData = {
      transactionId,
      truckId,
      transporterId: null,
      pickupLocation,
      deliveryLocation,
      goodsDescription,
      estimatedDistance,
      agreedPrice,
      platformFee: agreedPrice * 0.05,
      status: 'pending',
      tracking: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const jobRef = await db.collection('deliveryJobs').add(jobData);

    const truckDoc = await db.collection('trucks').doc(truckId).get();
    if (truckDoc.exists) {
      const truck = truckDoc.data();
      await db.collection('notifications').add({
        userId: truck.transporterId,
        type: 'delivery_request',
        title: 'New Delivery Job',
        message: `Delivery from ${pickupLocation.town} to ${deliveryLocation.town}. ₦${agreedPrice}`,
        data: { jobId: jobRef.id },
        createdAt: new Date(),
        read: false,
      });
    }

    res.json({ success: true, jobId: jobRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job', details: error.message });
  }
});

// Update Location / Status
router.post('/update-location/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { lat, lng, status } = req.body;
    const db = getDb();

    const updateData = { currentLocation: { lat, lng }, updatedAt: new Date() };

    if (status) {
      updateData.status = status;
      updateData.tracking = admin.firestore.FieldValue.arrayUnion({
        status,
        location: { lat, lng },
        timestamp: new Date(),
      });
    }

    await db.collection('deliveryJobs').doc(jobId).update(updateData);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update location', details: error.message });
  }
});

module.exports = router;
