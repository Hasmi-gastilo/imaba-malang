const { db } = require('../config/firebase');
const { uploadToCloudinary } = require('../config/cloudinary');
const path = require('path');



// Format data Firestore ke JSON biasa
const formatDoc = (doc) => ({ _id: doc.id, ...doc.data() });

exports.getAllNews = async (req, res) => {
  try {
    const snapshot = await db.collection('news')
      .orderBy('publishedAt', 'desc')
      .get();
      
    // Filter di memory untuk menghindari keharusan membuat composite index di Firebase
    const allNews = snapshot.docs.map(formatDoc);
    const news = allNews.filter(n => n.isPublished === true);
    
    res.json({ success: true, count: news.length, data: news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNewsBySlug = async (req, res) => {
  try {
    const snapshot = await db.collection('news')
      .where('slug', '==', req.params.slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    }

    const doc = snapshot.docs[0];
    const data = formatDoc(doc);
    
    // Increment view count
    await db.collection('news').doc(doc.id).update({
      viewCount: (data.viewCount || 0) + 1
    });
    
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin routes
exports.adminGetAllNews = async (req, res) => {
  try {
    const snapshot = await db.collection('news').orderBy('createdAt', 'desc').get();
    const news = snapshot.docs.map(formatDoc);
    res.json({ success: true, count: news.length, data: { news } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const doc = await db.collection('news').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    res.json({ success: true, data: formatDoc(doc) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'news');
    }

    const payload = {
      ...req.body,
      image: imageUrl,
      slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      author: req.user.id,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (payload.isPublished === 'true' || payload.isPublished === true) {
      payload.isPublished = true;
      payload.publishedAt = new Date().toISOString();
    } else {
      payload.isPublished = false;
      payload.publishedAt = null;
    }

    if (typeof payload.tags === 'string') {
      payload.tags = payload.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const docRef = await db.collection('news').add(payload);
    res.status(201).json({ success: true, data: { _id: docRef.id, ...payload } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const docRef = db.collection('news').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });

    const payload = { ...req.body, updatedAt: new Date().toISOString() };

    // If a new file is uploaded, send to Firebase Storage
    if (req.file) {
      payload.image = await uploadToCloudinary(req.file.buffer, 'news');
    }

    if (payload.title) {
      payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (payload.isPublished === 'true' || payload.isPublished === true) {
      payload.isPublished = true;
      if (!doc.data().publishedAt) payload.publishedAt = new Date().toISOString();
    } else {
      payload.isPublished = false;
    }

    if (typeof payload.tags === 'string') {
      payload.tags = payload.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    await docRef.update(payload);
    const updatedDoc = await docRef.get();
    
    res.json({ success: true, data: formatDoc(updatedDoc) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    await db.collection('news').doc(req.params.id).delete();
    res.json({ success: true, message: 'Berita berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
