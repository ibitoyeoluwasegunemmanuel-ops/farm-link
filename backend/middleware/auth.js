const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
    
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ error: 'No token provided' });
		}

		const token = authHeader.split('Bearer ')[1];
    
		// Verify Firebase token
		const decodedToken = await admin.auth().verifyIdToken(token);
    
		req.user = {
			uid: decodedToken.uid,
			phoneNumber: decodedToken.phone_number
		};

		// Get user role from Firestore
		const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
		if (userDoc.exists) {
			req.user.role = userDoc.data().role;
		}

		next();
	} catch (error) {
		console.error('Auth Error:', error);
		res.status(401).json({ error: 'Invalid or expired token' });
	}
};

const requireRole = (roles) => {
	return (req, res, next) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ error: 'Insufficient permissions' });
		}
		next();
	};
};

module.exports = { verifyToken, requireRole };
