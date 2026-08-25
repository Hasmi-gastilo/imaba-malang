require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');

// Models
const User = require('./models/User');
const Member = require('./models/Member');
const Department = require('./models/Department');
const Position = require('./models/Position');
const Setting = require('./models/Setting');

async function seed() {
  try {
    // Connect to database
    await connectDB();

    console.log('🌱 Starting seed process...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Member.deleteMany({});
    await Department.deleteMany({});
    await Position.deleteMany({});
    await Setting.deleteMany({});
    console.log('✅ Data cleared\n');

    // Create Super Admin
    console.log('👤 Creating Super Admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const superAdmin = await User.create({
      username: 'superadmin',
      email: 'admin@imabamalang.org',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true
    });
    console.log('✅ Super Admin created');
    console.log('   Email: admin@imabamalang.org');
    console.log('   Password: admin123\n');

    // Create Admin
    console.log('👤 Creating Admin...');
    const admin = await User.create({
      username: 'admin',
      email: 'sekretaris@imabamalang.org',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true
    });
    console.log('✅ Admin created');
    console.log('   Email: sekretaris@imabamalang.org');
    console.log('   Password: admin123\n');

    // Create Departments
    console.log('🏢 Creating Departments...');
    const departments = await Department.insertMany([
      {
        name: 'Keilmuan dan Keterampilan',
        description: 'Mengembangkan kompetensi akademik dan keterampilan anggota',
        color: '#2d5f3f'
      },
      {
        name: 'Sosial dan Kemasyarakatan',
        description: 'Menjalankan program pengabdian dan pemberdayaan masyarakat',
        color: '#1a3a52'
      },
      {
        name: 'Keagamaan',
        description: 'Memperkuat nilai-nilai keislaman dan spiritual anggota',
        color: '#d4af37'
      },
      {
        name: 'Humas dan Informasi',
        description: 'Mengelola komunikasi dan informasi organisasi',
        color: '#3a7750'
      },
      {
        name: 'Kewirausahaan',
        description: 'Mengembangkan jiwa entrepreneurship anggota',
        color: '#2d5273'
      }
    ]);
    console.log(`✅ ${departments.length} departments created\n`);

    // Create Positions
    console.log('💼 Creating Positions...');
    const positions = await Position.insertMany([
      {
        name: 'Ketua Umum',
        level: 1,
        period: '2024-2025',
        isActive: true
      },
      {
        name: 'Wakil Ketua',
        level: 2,
        period: '2024-2025',
        isActive: true
      },
      {
        name: 'Sekretaris',
        level: 3,
        period: '2024-2025',
        isActive: true
      },
      {
        name: 'Bendahara',
        level: 3,
        period: '2024-2025',
        isActive: true
      },
      {
        name: 'Koordinator Departemen',
        departmentId: departments[0]._id,
        level: 4,
        period: '2024-2025',
        isActive: true
      }
    ]);
    console.log(`✅ ${positions.length} positions created\n`);

    // Create Sample Members
    console.log('👥 Creating Sample Members...');
    const members = [];
    
    for (let i = 1; i <= 5; i++) {
      const memberId = `IMB-MALANG-${String(i).padStart(5, '0')}`;
      const email = `anggota${i}@example.com`;
      
      const member = await Member.create({
        memberId: memberId,
        fullName: `Anggota ${i}`,
        photo: '',
        nim: `2023${String(i).padStart(6, '0')}`,
        university: i <= 2 ? 'Universitas Brawijaya' : i <= 4 ? 'Universitas Negeri Malang' : 'UIN Malang',
        faculty: 'Fakultas Contoh',
        studyProgram: 'Program Studi Contoh',
        batch: '2023',
        whatsapp: `08123456${String(i).padStart(3, '0')}`,
        email: email,
        birthPlace: 'Batu Mandi',
        birthDate: new Date('2003-01-15'),
        address: 'Jalan Contoh No. ' + i,
        origin: 'Batu Mandi',
        bataBataEducation: 'SD Negeri Batu Mandi',
        graduationYear: '2019',
        additionalInfo: 'Anggota sample untuk testing',
        status: 'ACTIVE',
        qrCode: ''
      });

      members.push(member);

      // Create user account for member
      await User.create({
        username: memberId,
        email: email,
        password: hashedPassword,
        role: 'MEMBER',
        memberId: member._id,
        isActive: true
      });
    }
    console.log(`✅ ${members.length} sample members created`);
    console.log('   Login: IMB-MALANG-00001 to IMB-MALANG-00005');
    console.log('   Password: admin123\n');

    // Create Settings
    console.log('⚙️  Creating Settings...');
    await Setting.insertMany([
      {
        key: 'organization_name',
        value: 'DPW IMABA MALANG',
        description: 'Nama Organisasi',
        category: 'organization'
      },
      {
        key: 'organization_full_name',
        value: 'Dewan Perwakilan Wilayah Ikatan Mahasiswa Bata-Bata Malang',
        description: 'Nama Lengkap Organisasi',
        category: 'organization'
      },
      {
        key: 'contact_phone',
        value: '+62 xxx xxxx xxxx',
        description: 'Nomor Telepon',
        category: 'contact'
      },
      {
        key: 'contact_email',
        value: 'info@imabamalang.org',
        description: 'Email Organisasi',
        category: 'contact'
      },
      {
        key: 'contact_address',
        value: 'Malang, Jawa Timur',
        description: 'Alamat Organisasi',
        category: 'contact'
      },
      {
        key: 'social_instagram',
        value: '@imabamalang',
        description: 'Instagram',
        category: 'social'
      },
      {
        key: 'social_youtube',
        value: 'IMABA Malang',
        description: 'YouTube',
        category: 'social'
      }
    ]);
    console.log('✅ Settings created\n');

    console.log('🎉 Seed process completed successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('LOGIN CREDENTIALS:');
    console.log('═══════════════════════════════════════');
    console.log('Super Admin:');
    console.log('  Email: admin@imabamalang.org');
    console.log('  Password: admin123');
    console.log('');
    console.log('Admin:');
    console.log('  Email: sekretaris@imabamalang.org');
    console.log('  Password: admin123');
    console.log('');
    console.log('Member (sample):');
    console.log('  Email: anggota1@example.com');
    console.log('  Password: admin123');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed process failed:', error);
    process.exit(1);
  }
}

seed();
