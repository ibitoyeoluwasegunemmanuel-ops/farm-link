const express = require('express');
const router = express.Router();
const { db, bucket } = require('../server');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const upload = multer({ storage: multer.memoryStorage() });

// Create Harvest Post
router.post('/create', upload.array('images', 5), async (req, res) => {
	try {
		const { farmerId, cropType, quantity, unit, pricePerUnit, quality, 
						description, harvestDate, location, coordinates } = req.body;

		const imageUrls = [];
    
		// Upload images to Firebase Storage
		if (req.files && req.files.length > 0) {
			for (const file of req.files) {
				const filename = `harvests/${farmerId}/${uuidv4()}_${file.originalname}`;
				const fileUpload = bucket.file(filename);
        
				await fileUpload.save(file.buffer, {
					metadata: { contentType: file.mimetype }
				});
        
				await fileUpload.makePublic();
				imageUrls.push(`https://storage.googleapis.com/${bucket.name}/${filename}`);
			}
		}

		const harvestData = {
			farmerId,
			cropType,
			quantity: parseFloat(quantity),
			unit, // kg, tonnes, bags, liters
			pricePerUnit: parseFloat(pricePerUnit),
			totalPrice: parseFloat(quantity) * parseFloat(pricePerUnit),
			quality, // Grade A, B, C or Premium, Standard, Economy
			description,
			harvestDate: new Date(harvestDate),
			location: {
				state: location.state,
				lga: location.lga,
				town: location.town,
				address: location.address,
				coordinates: coordinates || null
			},
			images: imageUrls,
			status: 'available', // available, reserved, sold, expired
			views: 0,
			inquiries: 0,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		const harvestRef = await db.collection('harvests').add(harvestData);
    
		// Update farmer's harvests array
		await db.collection('farmers').doc(farmerId).update({
			harvests: admin.firestore.FieldValue.arrayUnion(harvestRef.id),
			updatedAt: new Date()
		});

		res.json({ success: true, harvestId: harvestRef.id, data: harvestData });
	} catch (error) {
		console.error('Create Harvest Error:', error);
		res.status(500).json({ error: 'Failed to create harvest' });
	}
});

// Search Harvests
router.get('/search', async (req, res) => {
	try {
		const { cropType, state, minPrice, maxPrice, quality, page = 1, limit = 20 } = req.query;
    
		let query = db.collection('harvests').where('status', '==', 'available');
    
		if (cropType) {
			query = query.where('cropType', '==', cropType.toLowerCase());
		}
    
		if (state) {
			query = query.where('location.state', '==', state);
		}
    
		if (quality) {
			query = query.where('quality', '==', quality);
		}

		query = query.orderBy('createdAt', 'desc').limit(parseInt(limit));
    
		const snapshot = await query.get();
		const harvests = [];
    
		snapshot.forEach(doc => {
			const data = doc.data();
			// Filter by price in memory if needed
			if (minPrice && data.pricePerUnit < parseFloat(minPrice)) return;
			if (maxPrice && data.pricePerUnit > parseFloat(maxPrice)) return;
      
			harvests.push({ id: doc.id, ...data });
		});

		res.json({ success: true, count: harvests.length, data: harvests });
	} catch (error) {
		console.error('Search Error:', error);
		res.status(500).json({ error: 'Search failed' });
	}
});

// Get Harvest Detail
router.get('/:harvestId', async (req, res) => {
	try {
		const { harvestId } = req.params;
    
		const harvestDoc = await db.collection('harvests').doc(harvestId).get();
    
		if (!harvestDoc.exists) {
			return res.status(404).json({ error: 'Harvest not found' });
		}

		// Increment views
		await db.collection('harvests').doc(harvestId).update({
			views: admin.firestore.FieldValue.increment(1)
		});

		const harvestData = harvestDoc.data();
    
		// Get farmer info
		const farmerDoc = await db.collection('farmers').doc(harvestData.farmerId).get();
		const farmerData = farmerDoc.exists ? farmerDoc.data() : null;

		res.json({ 
			success: true, 
			data: { 
				...harvestData, 
				id: harvestId,
				farmer: farmerData 
			} 
		});
	} catch (error) {
		res.status(500).json({ error: 'Failed to get harvest' });
	}
});

module.exports = router;
