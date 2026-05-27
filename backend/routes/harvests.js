const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const getDb = () => admin.firestore();
const getBucket = () => admin.storage().bucket();

// Create Product/Harvest Listing
router.post('/create', async (req, res) => {
  try {
    const { farmerId, cropType, quantity, unit, pricePerUnit, quality, description, harvestDate, location, images } = req.body;

    const harvestData = {
      farmerId,
      cropType,
      quantity: parseFloat(quantity),
      unit,
      pricePerUnit: parseFloat(pricePerUnit),
      totalPrice: parseFloat(quantity) * parseFloat(pricePerUnit),
      quality,
      description,
      harvestDate: new Date(harvestDate),
      location,
      images: images || [],
      status: 'available',
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const harvestRef = await getDb().collection('harvests').add(harvestData);

    await getDb().collection('farmers').doc(farmerId).update({
      harvests: admin.firestore.FieldValue.arrayUnion(harvestRef.id),
      updatedAt: new Date(),
    });

    res.json({ success: true, harvestId: harvestRef.id, data: harvestData });
  } catch (error) {
    console.error('Create Harvest Error:', error);
    res.status(500).json({ error: 'Failed to create listing', details: error.message });
  }
});

// Get all / Search listings
router.get('/', async (req, res) => {
  try {
    const { cropType, state, limit = 20 } = req.query;
    const db = getDb();

    let query = db.collection('harvests').where('status', '==', 'available').orderBy('createdAt', 'desc').limit(parseInt(limit));

    const snapshot = await query.get();
    let harvests = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    if (cropType) harvests = harvests.filter(h => h.cropType?.toLowerCase().includes(cropType.toLowerCase()));
    if (state) harvests = harvests.filter(h => h.location?.state === state);

    res.json({ success: true, count: harvests.length, data: harvests });
  } catch (error) {
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
});

// Get by farmer
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const snapshot = await getDb().collection('harvests')
      .where('farmerId', '==', req.params.farmerId)
      .orderBy('createdAt', 'desc')
      .get();
    const harvests = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ success: true, data: harvests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get listings', details: error.message });
  }
});

// Get single listing
router.get('/:harvestId', async (req, res) => {
  try {
    const db = getDb();
    const doc = await db.collection('harvests').doc(req.params.harvestId).get();
    if (!doc.exists) return res.status(404).json({ error: 'Listing not found' });

    await db.collection('harvests').doc(req.params.harvestId).update({
      views: admin.firestore.FieldValue.increment(1),
    });

    const data = doc.data();
    let farmer = null;
    if (data.farmerId) {
      const farmerDoc = await db.collection('users').doc(data.farmerId).get();
      if (farmerDoc.exists) farmer = { id: farmerDoc.id, ...farmerDoc.data() };
    }

    res.json({ success: true, data: { id: doc.id, ...data, farmer } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get listing', details: error.message });
  }
});

// Update listing
router.put('/:harvestId', async (req, res) => {
  try {
    await getDb().collection('harvests').doc(req.params.harvestId).update({ ...req.body, updatedAt: new Date() });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update listing', details: error.message });
  }
});

module.exports = router;
