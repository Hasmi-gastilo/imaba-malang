const { db } = require('../config/firebase');
const { uploadToCloudinary } = require('../config/cloudinary');

exports.getHomepageData = async (req, res) => {
  try {
    const doc = await db.collection('settings').doc('homepage').get();
    
    // Default data if it doesn't exist
    const defaultData = {
      heroTitle: "Temukan Ruang Berkembang Mudah",
      heroSubtitle: "Wadah organisasi inspiratif untuk membantu kamu menemukan potensi diri dan berkontribusi untuk umat.",
      aboutTitle: "Selamat Datang di IMABA?",
      aboutText: "Ikatan Mahasiswa Bata-Bata Wilayah Malang adalah organisasi mahasiswa yang berakar pada nilai-nilai Islami dan kearifan lokal. Kami bertujuan menjadi organisasi mahasiswa yang unggul dalam membentuk kader yang religius, transformatif, dan akademis.",
      heroImage: "",
      aboutImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
    };

    if (!doc.exists) {
      return res.json({ success: true, data: defaultData });
    }
    
    res.json({ success: true, data: { ...defaultData, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateHomepageData = async (req, res) => {
  try {
    const { heroTitle, heroSubtitle, aboutTitle, aboutText } = req.body;
    let { heroImage, aboutImage } = req.body;
    
    if (req.files) {
      if (req.files.heroImage && req.files.heroImage[0]) {
        heroImage = await uploadToCloudinary(req.files.heroImage[0].buffer, 'homepage');
      }
      if (req.files.aboutImage && req.files.aboutImage[0]) {
        aboutImage = await uploadToCloudinary(req.files.aboutImage[0].buffer, 'homepage');
      }
    }
    
    const data = {
      heroTitle,
      heroSubtitle,
      aboutTitle,
      aboutText,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.id
    };

    if (heroImage) data.heroImage = heroImage;
    if (aboutImage) data.aboutImage = aboutImage;

    await db.collection('settings').doc('homepage').set(data, { merge: true });
    
    res.json({ success: true, message: 'Pengaturan beranda berhasil diperbarui!', data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
