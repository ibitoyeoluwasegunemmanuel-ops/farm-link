const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin — credentials come from FIREBASE_SERVICE_ACCOUNT env var on Vercel,
// or fall back to local serviceAccountKey.json for local dev.
let firebaseCredential;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  firebaseCredential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
} else {
  try {
    const serviceAccount = require('./serviceAccountKey.json');
    firebaseCredential = admin.credential.cert(serviceAccount);
  } catch {
    firebaseCredential = admin.credential.applicationDefault();
  }
}

admin.initializeApp({
  credential: firebaseCredential,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmers');
const buyerRoutes = require('./routes/buyers');
const transporterRoutes = require('./routes/transporters');
const harvestRoutes = require('./routes/harvests');
const transactionRoutes = require('./routes/transactions');
const logisticsRoutes = require('./routes/logistics');

app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/transporters', transporterRoutes);
app.use('/api/harvests', harvestRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/logistics', logisticsRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'FarmLink API Running', version: '1.0.0' });
});

// Only start the HTTP server when running locally (not on Vercel serverless)
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`FarmLink Server running on port ${PORT}`);
  });
}

module.exports = app;
module.exports.db = db;
module.exports.bucket = bucket;
module.exports.admin = admin;
