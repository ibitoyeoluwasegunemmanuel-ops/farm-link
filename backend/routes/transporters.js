const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const getDb = () => admin.firestore();

function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Get Transporter Profile
router.get('/profile/:transporterId', async (req, res) => {
  try {
    const { transporterId } = req.params;
    const db = getDb();

    const transporterDoc = await db.collection('transporters').doc(transporterId).get();
    if (!transporterDoc.exists) return res.status(404).json({ error: 'Transporter not found' });

    const data = transporterDoc.data();

    const trucks = [];
    if (data.trucks && data.trucks.length > 0) {
      for (const truckId of data.trucks) {
        const truckDoc = await db.collection('trucks').doc(truckId).get();
        if (truckDoc.exists) trucks.push({ id: truckDoc.id, ...truckDoc.data() });
      }
    }

    const jobsQuery = await db.collection('deliveryJobs')
      .where('transporterId', '==', transporterId)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();
    const jobs = jobsQuery.docs.map(d => ({ id: d.id, ...d.data() }));

    res.json({ success: true, data: { ...data, trucks, jobs } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transporter profile', details: error.message });
  }
});

// Update Transporter Profile
router.put('/profile/:transporterId', async (req, res) => {
  try {
    const { transporterId } = req.params;
    const { driverName, licenseNumber, emergencyContact } = req.body;

    await getDb().collection('transporters').doc(transporterId).update({
      driverName, licenseNumber, emergencyContact, updatedAt: new Date(),
    });

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
});

// Get Transporter Dashboard Stats
router.get('/dashboard/:transporterId', async (req, res) => {
  try {
    const { transporterId } = req.params;
    const db = getDb();

    const [trucksSnap, jobsSnap, completedSnap, activeSnap] = await Promise.all([
      db.collection('trucks').where('transporterId', '==', transporterId).get(),
      db.collection('deliveryJobs').where('transporterId', '==', transporterId).get(),
      db.collection('deliveryJobs').where('transporterId', '==', transporterId).where('status', '==', 'delivered').get(),
      db.collection('deliveryJobs').where('transporterId', '==', transporterId).where('status', 'in', ['accepted', 'pickup', 'in_transit']).get(),
    ]);

    let totalEarnings = 0;
    completedSnap.forEach(doc => {
      const job = doc.data();
      totalEarnings += (job.agreedPrice || 0) - (job.platformFee || 0);
    });

    res.json({
      success: true,
      stats: {
        totalTrucks: trucksSnap.size,
        totalJobs: jobsSnap.size,
        completedDeliveries: completedSnap.size,
        activeDeliveries: activeSnap.size,
        totalEarnings,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats', details: error.message });
  }
});

// Get Available Jobs
router.get('/jobs/available', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const db = getDb();

    const snapshot = await db.collection('deliveryJobs')
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const jobs = snapshot.docs.map(doc => {
      const job = doc.data();
      return {
        id: doc.id,
        ...job,
        distance: calculateDistance(
          parseFloat(lat), parseFloat(lng),
          job.pickupLocation?.lat, job.pickupLocation?.lng
        ),
      };
    }).sort((a, b) => (a.distance || 999) - (b.distance || 999));

    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available jobs', details: error.message });
  }
});

// Accept Job
router.post('/jobs/:jobId/accept', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { transporterId, truckId } = req.body;
    const db = getDb();

    await db.collection('deliveryJobs').doc(jobId).update({
      transporterId, truckId, status: 'accepted', acceptedAt: new Date(), updatedAt: new Date(),
    });

    const jobDoc = await db.collection('deliveryJobs').doc(jobId).get();
    const job = jobDoc.data();

    if (job.buyerId) {
      await db.collection('notifications').add({
        userId: job.buyerId,
        type: 'delivery_accepted',
        title: 'Driver Assigned',
        message: 'A driver has accepted your delivery request',
        data: { jobId },
        createdAt: new Date(),
        read: false,
      });
    }

    res.json({ success: true, message: 'Job accepted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept job', details: error.message });
  }
});

// Update Delivery Status
router.post('/jobs/:jobId/status', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, location, note } = req.body;
    const db = getDb();

    const updateData = {
      status,
      updatedAt: new Date(),
      tracking: admin.firestore.FieldValue.arrayUnion({
        status, location, note, timestamp: new Date(),
      }),
    };

    if (location) updateData.currentLocation = location;
    if (status === 'delivered') updateData.deliveredAt = new Date();

    await db.collection('deliveryJobs').doc(jobId).update(updateData);

    const jobDoc = await db.collection('deliveryJobs').doc(jobId).get();
    const job = jobDoc.data();

    const notification = {
      type: 'delivery_update',
      title: `Delivery ${status.replace('_', ' ')}`,
      message: note || `Your delivery is now ${status}`,
      data: { jobId, status },
      createdAt: new Date(),
      read: false,
    };

    const notifPromises = [];
    if (job.buyerId) notifPromises.push(db.collection('notifications').add({ ...notification, userId: job.buyerId }));
    if (job.farmerId) notifPromises.push(db.collection('notifications').add({ ...notification, userId: job.farmerId }));
    await Promise.all(notifPromises);

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status', details: error.message });
  }
});

// Get My Jobs
router.get('/jobs/:transporterId', async (req, res) => {
  try {
    const { transporterId } = req.params;
    const { status } = req.query;
    const db = getDb();

    let query = db.collection('deliveryJobs').where('transporterId', '==', transporterId).orderBy('createdAt', 'desc');
    if (status) query = query.where('status', '==', status);

    const snapshot = await query.get();
    const jobs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs', details: error.message });
  }
});

module.exports = router;
