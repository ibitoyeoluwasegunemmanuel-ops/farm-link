const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const getDb = () => admin.firestore();

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber || !phoneNumber.startsWith('+234')) {
      return res.status(400).json({ error: 'Valid Nigerian phone number required (+234...)' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await getDb().collection('otps').doc(phoneNumber).set({
      otp,
      expiry: otpExpiry,
      attempts: 0,
      createdAt: new Date(),
    });

    // In production: send via Twilio. For now log it (remove before going live)
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE) {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: `Your FarmLink verification code is: ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE,
        to: phoneNumber,
      });
    }

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP Error:', error);
    res.status(500).json({ error: 'Failed to send OTP', details: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const db = getDb();

    const otpDoc = await db.collection('otps').doc(phoneNumber).get();
    if (!otpDoc.exists) {
      return res.status(400).json({ error: 'OTP expired or not found' });
    }

    const otpData = otpDoc.data();

    if (otpData.attempts >= 5) {
      return res.status(429).json({ error: 'Too many attempts. Request a new OTP.' });
    }

    if (otpData.otp !== otp) {
      await db.collection('otps').doc(phoneNumber).update({
        attempts: admin.firestore.FieldValue.increment(1),
      });
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date() > otpData.expiry.toDate()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Check if user exists
    const userQuery = await db.collection('users').where('phoneNumber', '==', phoneNumber).get();
    let userId;
    let isNewUser = false;
    let userData;

    if (userQuery.empty) {
      isNewUser = true;
      const newUser = {
        phoneNumber,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        profileComplete: false,
        rating: 0,
        totalTransactions: 0,
      };
      const userRef = await db.collection('users').add(newUser);
      userId = userRef.id;
      userData = newUser;
    } else {
      userId = userQuery.docs[0].id;
      userData = userQuery.docs[0].data();
    }

    await db.collection('otps').doc(phoneNumber).delete();

    const customToken = await admin.auth().createCustomToken(userId);

    res.json({
      success: true,
      userId,
      token: customToken,
      isNewUser,
      user: { id: userId, ...userData },
    });
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ error: 'Verification failed', details: error.message });
  }
});

// Set Role
router.post('/set-role', async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!['farmer', 'buyer', 'transporter', 'equipment_owner', 'investor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const db = getDb();
    await db.collection('users').doc(userId).update({ role, updatedAt: new Date() });

    const profileDefaults = {
      farmer: { userId, farmName: '', location: {}, farmSize: '', crops: [], totalSales: 0, rating: 0 },
      buyer: { userId, businessName: '', businessType: '', location: {}, totalPurchases: 0 },
      transporter: { userId, driverName: '', trucks: [], isAvailable: false, totalDeliveries: 0, rating: 0 },
      equipment_owner: { userId, equipmentList: [], totalRentals: 0, rating: 0 },
      investor: { userId, investments: [], totalInvested: 0, totalReturns: 0 },
    };

    await db.collection(role === 'equipment_owner' ? 'equipment_owners' : `${role}s`).doc(userId).set(profileDefaults[role]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set role', details: error.message });
  }
});

// Update Profile
router.post('/profile', async (req, res) => {
  try {
    const { userId, fullName, farmName, state, bio, avatar } = req.body;
    const db = getDb();

    await db.collection('users').doc(userId).update({
      fullName, farmName, state, bio, avatar,
      profileComplete: true,
      updatedAt: new Date(),
    });

    const user = await db.collection('users').doc(userId).get();
    res.json({ success: true, user: { id: userId, ...user.data() } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
});

// Get Profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const doc = await getDb().collection('users').doc(userId).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user: { id: userId, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile', details: error.message });
  }
});

// KYC Submission (stub — store for manual review)
router.post('/kyc', async (req, res) => {
  try {
    const { userId, docType, ninNumber } = req.body;
    await getDb().collection('kyc_submissions').doc(userId).set({
      userId,
      docType,
      ninNumber: ninNumber || null,
      status: 'pending',
      submittedAt: new Date(),
    });
    await getDb().collection('users').doc(userId).update({
      kycSubmitted: true,
      updatedAt: new Date(),
    });
    res.json({ success: true, message: 'KYC submitted for review' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit KYC', details: error.message });
  }
});

module.exports = router;
