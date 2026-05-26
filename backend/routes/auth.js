const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const { db } = require('../server');

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Send OTP
router.post('/send-otp', async (req, res) => {
	try {
		const { phoneNumber } = req.body;
    
		if (!phoneNumber || !phoneNumber.startsWith('+234')) {
			return res.status(400).json({ error: 'Valid Nigerian phone number required (+234...)' });
		}

		// Generate 6-digit OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

		// Store OTP in Firestore
		await db.collection('otps').doc(phoneNumber).set({
			otp,
			expiry: otpExpiry,
			attempts: 0,
			createdAt: new Date()
		});

		// Send SMS via Twilio
		await twilioClient.messages.create({
			body: `Your FarmLink verification code is: ${otp}. Valid for 10 minutes.`,
			from: process.env.TWILIO_PHONE,
			to: phoneNumber
		});

		res.json({ success: true, message: 'OTP sent successfully' });
	} catch (error) {
		console.error('OTP Error:', error);
		res.status(500).json({ error: 'Failed to send OTP' });
	}
});

// Verify OTP and Create/Login User
router.post('/verify-otp', async (req, res) => {
	try {
		const { phoneNumber, otp, role } = req.body;

		const otpDoc = await db.collection('otps').doc(phoneNumber).get();
    
		if (!otpDoc.exists) {
			return res.status(400).json({ error: 'OTP expired or not found' });
		}

		const otpData = otpDoc.data();
    
		if (otpData.otp !== otp) {
			// Increment attempts
			await db.collection('otps').doc(phoneNumber).update({
				attempts: admin.firestore.FieldValue.increment(1)
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

		if (userQuery.empty) {
			// Create new user
			isNewUser = true;
			const newUser = {
				phoneNumber,
				role, // 'farmer', 'buyer', 'transporter'
				isVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
				profileComplete: false,
				rating: 0,
				totalTransactions: 0
			};

			const userRef = await db.collection('users').add(newUser);
			userId = userRef.id;

			// Create role-specific profile
			if (role === 'farmer') {
				await db.collection('farmers').doc(userId).set({
					userId,
					farmName: '',
					location: {},
					farmSize: '',
					crops: [],
					harvests: [],
					totalSales: 0,
					rating: 0
				});
			} else if (role === 'buyer') {
				await db.collection('buyers').doc(userId).set({
					userId,
					businessName: '',
					businessType: '', // individual, restaurant, factory, exporter
					location: {},
					purchaseHistory: [],
					totalPurchases: 0,
					verified: false
				});
			} else if (role === 'transporter') {
				await db.collection('transporters').doc(userId).set({
					userId,
					driverName: '',
					trucks: [],
					currentLocation: {},
					isAvailable: false,
					totalDeliveries: 0,
					rating: 0,
					verified: false
				});
			}
		} else {
			userId = userQuery.docs[0].id;
		}

		// Delete OTP
		await db.collection('otps').doc(phoneNumber).delete();

		// Create custom token for Firebase Auth
		const customToken = await admin.auth().createCustomToken(userId);

		res.json({
			success: true,
			userId,
			token: customToken,
			isNewUser,
			role: role || userQuery.docs[0].data().role
		});
	} catch (error) {
		console.error('Verification Error:', error);
		res.status(500).json({ error: 'Verification failed' });
	}
});

module.exports = router;
