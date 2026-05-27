const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const getDb = () => admin.firestore();

// Get Farmer Profile
router.get('/profile/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const db = getDb();

    const farmerDoc = await db.collection('farmers').doc(farmerId).get();
    if (!farmerDoc.exists) return res.status(404).json({ error: 'Farmer not found' });

    const userDoc = await db.collection('users').doc(farmerId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    const harvestsQuery = await db.collection('harvests')
      .where('farmerId', '==', farmerId)
      .orderBy('createdAt', 'desc')
      .get();
    const harvests = harvestsQuery.docs.map(d => ({ id: d.id, ...d.data() }));

    const transactionsQuery = await db.collection('transactions')
      .where('farmerId', '==', farmerId)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
    const transactions = transactionsQuery.docs.map(d => ({ id: d.id, ...d.data() }));

    res.json({
      success: true,
      data: { ...farmerDoc.data(), ...userData, harvests, transactions },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farmer profile', details: error.message });
  }
});

// Update Farmer Profile
router.put('/profile/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { farmName, location, farmSize, crops, description } = req.body;

    await getDb().collection('farmers').doc(farmerId).update({
      farmName,
      location,
      farmSize,
      crops,
      description,
      updatedAt: new Date(),
    });

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
});

// Get Farmer Dashboard Stats
router.get('/dashboard/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const db = getDb();

    const [harvestsSnap, activeSnap, txSnap, completedSnap] = await Promise.all([
      db.collection('harvests').where('farmerId', '==', farmerId).get(),
      db.collection('harvests').where('farmerId', '==', farmerId).where('status', '==', 'available').get(),
      db.collection('transactions').where('farmerId', '==', farmerId).get(),
      db.collection('transactions').where('farmerId', '==', farmerId).where('status', '==', 'completed').get(),
    ]);

    let totalEarnings = 0;
    completedSnap.forEach(doc => { totalEarnings += doc.data().farmerAmount || 0; });

    res.json({
      success: true,
      stats: {
        totalHarvests: harvestsSnap.size,
        activeHarvests: activeSnap.size,
        totalTransactions: txSnap.size,
        completedSales: completedSnap.size,
        totalEarnings,
        pendingPayments: txSnap.size - completedSnap.size,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats', details: error.message });
  }
});

// Get Farmer Harvests
router.get('/harvests/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { status, limit = 20 } = req.query;
    const db = getDb();

    let query = db.collection('harvests').where('farmerId', '==', farmerId).orderBy('createdAt', 'desc');
    if (status) query = query.where('status', '==', status);

    const snapshot = await query.limit(parseInt(limit)).get();
    const harvests = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    res.json({ success: true, count: harvests.length, data: harvests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch harvests', details: error.message });
  }
});

module.exports = router;
