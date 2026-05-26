const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check — always works even if Firebase fails
app.get('/', (req, res) => {
  res.json({ message: 'FarmLink API Running', version: '1.0.0', status: 'ok' });
});

// Initialize Firebase safely
let db, bucket;
try {
  if (!admin.apps.length) {
    let credential;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Replace escaped newlines in private key (common Vercel paste issue)
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\\n/g, '\n');
      credential = admin.credential.cert(JSON.parse(raw));
    } else {
      try {
        credential = admin.credential.cert(require('./serviceAccountKey.json'));
      } catch {
        credential = admin.credential.applicationDefault();
      }
    }

    admin.initializeApp({
      credential,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  db = admin.firestore();
  bucket = admin.storage().bucket();
} catch (err) {
  console.error('Firebase init error:', err.message);
}

// Routes
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/farmers', require('./routes/farmers'));
  app.use('/api/buyers', require('./routes/buyers'));
  app.use('/api/transporters', require('./routes/transporters'));
  app.use('/api/harvests', require('./routes/harvests'));
  app.use('/api/transactions', require('./routes/transactions'));
  app.use('/api/logistics', require('./routes/logistics'));
} catch (err) {
  console.error('Route load error:', err.message);
}

// Only listen locally
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`FarmLink running on port ${PORT}`));
}

module.exports = app;
module.exports.db = db;
module.exports.bucket = bucket;
module.exports.admin = admin;
