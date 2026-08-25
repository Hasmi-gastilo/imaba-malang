const bcrypt = require('bcryptjs');
const { db } = require('../server/config/firebase');

async function seedAdmin() {
  try {
    const email = 'admin@imaba.com';
    const password = 'password123';
    
    // Check if admin already exists
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (!snapshot.empty) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const payload = {
      username: 'Admin IMABA',
      email: email,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    await db.collection('users').add(payload);
    console.log('✅ Admin user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
    process.exit(1);
  }
}

seedAdmin();
