# DPW IMABA MALANG

Website Resmi & Sistem Informasi **Dewan Perwakilan Wilayah Ikatan Mahasiswa Bata-Bata Malang**

![Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

---

## 📋 Tentang Project

Aplikasi full-stack untuk mengelola organisasi mahasiswa DPW IMABA Malang, mencakup:

- ✅ Website Profil Organisasi
- ✅ Sistem Informasi Anggota
- ✅ Database Anggota
- ✅ KTA Digital dengan QR Code
- ✅ Manajemen Kegiatan
- ✅ Presensi Digital
- ✅ CMS Berita & Galeri
- ✅ Sistem Kaderisasi
- ✅ Perpustakaan Digital
- ✅ Dashboard Admin

---

## 🚀 Teknologi yang Digunakan

### Frontend
- HTML5
- CSS3 (Vanilla, No Framework)
- JavaScript (Vanilla, No Framework)

### Backend
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT Authentication

### Cloud Services
- MongoDB Atlas (Database)
- Cloudinary (Image Storage)

### Deployment
- GitHub (Version Control)
- Vercel (Hosting)

---

## 📦 Fitur Utama

### Public Website
- 🏠 Homepage dengan statistik organisasi
- 📰 Sistem berita dengan kategori
- 📅 Agenda kegiatan
- 👥 Profil organisasi & kepengurusan
- 🎓 Program kerja & kaderisasi
- 🖼️ Galeri dokumentasi
- 🏆 Prestasi kader
- 👨‍🎓 Database alumni
- 📚 Perpustakaan digital
- 📞 Halaman kontak

### Member Features
- 📝 Pendaftaran online
- 🎫 KTA Digital
- ✅ Presensi kegiatan via QR
- 📊 Riwayat aktivitas
- 👤 Profil anggota

### Admin Dashboard
- 📊 Dashboard statistik
- ✅ Verifikasi pendaftaran
- 👥 Manajemen anggota
- 📰 CMS berita
- 📅 Manajemen kegiatan
- 👨‍🎓 Manajemen kaderisasi
- 📈 Export data
- 🔐 Role-based access control
- 📋 Audit log

---

## 🛠️ Installation

### Prerequisites

- Node.js (v16 atau lebih baru)
- MongoDB Atlas account
- Cloudinary account
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/dpw-imaba-malang.git
cd dpw-imaba-malang
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup MongoDB Atlas

1. Buat akun di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Buat cluster baru (pilih Free Tier)
3. Buat database user
4. Whitelist IP address (atau gunakan 0.0.0.0/0 untuk semua IP)
5. Dapatkan connection string

Connection string format:
```
mongodb+srv://username:password@cluster.mongodb.net/dpw-imaba-malang?retryWrites=true&w=majority
```

### Step 4: Setup Cloudinary

1. Buat akun di [Cloudinary](https://cloudinary.com/)
2. Dapatkan kredensial dari dashboard:
   - Cloud Name
   - API Key
   - API Secret

### Step 5: Environment Variables

1. Copy file `.env.example` menjadi `.env`:
```bash
copy .env.example .env
```

2. Edit file `.env` dan isi dengan kredensial Anda:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dpw-imaba-malang?retryWrites=true&w=majority

# Authentication Secret (generate random string)
AUTH_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Application URL
APP_URL=http://localhost:3000

# Server Port
PORT=3000
```

### Step 6: Seed Database

Jalankan seed script untuk membuat data awal:

```bash
npm run seed
```

Ini akan membuat:
- Super Admin account
- Admin account
- Sample departments
- Sample members
- Settings

### Step 7: Run Development Server

```bash
npm run dev
```

Server akan berjalan di: `http://localhost:3000`

---

## 🔐 Default Login Credentials

Setelah running seed script:

### Super Admin
- Email: `admin@imabamalang.org`
- Password: `admin123`

### Admin
- Email: `sekretaris@imabamalang.org`
- Password: `admin123`

### Sample Member
- Email: `anggota1@example.com`
- Password: `admin123`

**⚠️ PENTING: Ganti password default setelah login pertama kali!**

---

## 📁 Struktur Project

```
dpw-imaba-malang/
├── public/                    # Frontend files
│   ├── index.html            # Homepage
│   ├── profil.html           # Profile page
│   ├── berita.html           # News page
│   ├── agenda.html           # Events page
│   ├── daftar.html           # Registration page
│   ├── login.html            # Login page
│   ├── kta.html              # Digital KTA
│   ├── verifikasi.html       # QR verification
│   ├── admin/                # Admin dashboard
│   │   └── index.html        # Admin dashboard
│   ├── css/                  # Stylesheets
│   │   ├── style.css         # Main styles
│   │   └── responsive.css    # Responsive styles
│   └── js/                   # JavaScript files
│       ├── main.js           # Main JS
│       └── api.js            # API communication
│
├── server/                    # Backend files
│   ├── server.js             # Express server
│   ├── seed.js               # Database seeder
│   ├── config/               # Configuration
│   │   └── database.js       # MongoDB connection
│   ├── models/               # Mongoose models
│   │   ├── User.js
│   │   ├── Member.js
│   │   ├── Event.js
│   │   └── ...
│   ├── controllers/          # Route controllers
│   │   ├── authController.js
│   │   └── memberController.js
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   └── memberRoutes.js
│   ├── middleware/           # Express middleware
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   └── utils/                # Utility functions
│       ├── generateMemberId.js
│       └── generateQRCode.js
│
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── package.json              # NPM dependencies
└── README.md                 # This file
```

---

## 🔄 Development Workflow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Make Changes
- Edit files in `public/` for frontend
- Edit files in `server/` for backend

### 3. Test Locally
- Open browser: `http://localhost:3000`
- Test all features
- Check console for errors

### 4. Reset Database (if needed)
```bash
npm run seed
```

---

## 🚀 Deployment

### Deploy to Vercel

1. Push code ke GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Login ke [Vercel](https://vercel.com)

3. Import project dari GitHub

4. Set environment variables di Vercel:
   - `MONGODB_URI`
   - `AUTH_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `APP_URL` (URL production Anda)

5. Deploy

### Vercel Configuration

Jika diperlukan, buat file `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
```

---

## 👥 User Roles

### SUPER_ADMIN
- Full access ke semua fitur
- Manage admin accounts
- System configuration

### ADMIN
- Manage members
- Approve applications
- Manage content (news, events, programs)
- View reports

### EDITOR
- Manage news
- Manage gallery
- Manage events

### KADERISASI_ADMIN
- Manage kaderisasi programs
- Manage attendance
- View participant data

### MEMBER
- View profile
- Access digital KTA
- Submit attendance
- View activity history

---

## 🔒 Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Input validation
- ✅ XSS prevention
- ✅ Rate limiting
- ✅ Secure headers (helmet)
- ✅ CORS configuration
- ✅ File upload validation

---

## 📱 Responsive Design

Website fully responsive untuk:
- 💻 Desktop (1920px+)
- 💻 Laptop (1024px - 1920px)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (320px - 768px)

---

## 🎨 Design System

### Colors
- **Primary**: `#2d5f3f` (Dark Green)
- **Secondary**: `#1a3a52` (Dark Navy)
- **Accent**: `#d4af37` (Gold)
- **Background**: `#ffffff` (White)

### Typography
- Font Family: System fonts (-apple-system, Segoe UI, etc.)
- Heading: Georgia (serif)

---

## 📊 Database Schema

### Collections
- `users` - User accounts
- `members` - Member data
- `membershipapplications` - Membership applications
- `departments` - Organization departments
- `positions` - Organization positions
- `events` - Events/activities
- `attendances` - Event attendance records
- `news` - News articles
- `programs` - Work programs
- `kaderisasis` - Kaderisasi programs
- `galleries` - Photo gallery
- `achievements` - Member achievements
- `alumnis` - Alumni data
- `documents` - Digital library
- `announcements` - Announcements
- `partners` - Partner organizations
- `auditlogs` - System audit logs
- `settings` - System settings

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Pastikan connection string benar
- Whitelist IP di MongoDB Atlas
- Check network/firewall

### Cloudinary Upload Error
- Verify API credentials
- Check file size limit (max 5MB)
- Verify file format

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Change port in .env
PORT=3001
```

---

## 📝 TODO / Future Features

- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced reporting
- [ ] Data visualization charts
- [ ] Mobile app (React Native)
- [ ] Progressive Web App (PWA)
- [ ] Multi-language support
- [ ] Dark mode

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Developer

Developed with ❤️ for **DPW IMABA Malang**

---

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:
- Email: info@imabamalang.org
- WhatsApp: +62 xxx xxxx xxxx

---

## 🙏 Acknowledgments

- MongoDB Atlas
- Cloudinary
- Express.js community
- All contributors

---

**⭐ Jangan lupa berikan star jika project ini bermanfaat!**
