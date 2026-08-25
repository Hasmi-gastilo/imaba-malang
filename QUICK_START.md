# ⚡ QUICK START GUIDE

Panduan cepat untuk menjalankan DPW IMABA Malang dalam 5 menit.

---

## 🚀 Step 1: Install Dependencies (30 detik)

```bash
npm install
```

---

## 🔐 Step 2: Setup .env File (2 menit)

### Buat file `.env` di root folder:

```bash
copy .env.example .env
```

### Edit `.env` dengan kredensial Anda:

```env
# MongoDB Atlas - Dapatkan dari https://cloud.mongodb.com
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dpw-imaba-malang?retryWrites=true&w=majority

# JWT Secret - Generate random string minimal 32 karakter
AUTH_SECRET=ini-adalah-secret-key-yang-sangat-panjang-dan-aman-minimal-32-karakter

# Cloudinary - Dapatkan dari https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Application URL
APP_URL=http://localhost:3000

# Server Port
PORT=3000
```

### 📝 Cara Mendapatkan Kredensial:

#### MongoDB Atlas:
1. Buka: https://cloud.mongodb.com
2. Buat cluster gratis
3. Buat database user
4. Whitelist IP: `0.0.0.0/0`
5. Copy connection string

#### Cloudinary:
1. Buka: https://cloudinary.com/users/register/free
2. Daftar gratis
3. Copy Cloud Name, API Key, API Secret dari dashboard

**Detail lengkap:** Lihat `SETUP_GUIDE.md`

---

## 🌱 Step 3: Seed Database (30 detik)

```bash
npm run seed
```

Ini akan membuat:
- ✅ Super Admin account
- ✅ Admin account
- ✅ 5 sample members
- ✅ Departments & positions
- ✅ Organization settings

### Kredensial Login:

**Super Admin:**
- Email: `admin@imabamalang.org`
- Password: `admin123`

**Admin:**
- Email: `sekretaris@imabamalang.org`
- Password: `admin123`

**Member (sample):**
- Email: `anggota1@example.com`
- Password: `admin123`

---

## 🎮 Step 4: Run Server (10 detik)

```bash
npm run dev
```

Server running di: **http://localhost:3000** 🎉

---

## ✅ Step 5: Test Features (1 menit)

### 1. Homepage
Buka: http://localhost:3000

### 2. Login as Admin
- Buka: http://localhost:3000/login.html
- Email: `admin@imabamalang.org`
- Password: `admin123`
- Klik **Login**

### 3. Admin Dashboard
Setelah login, Anda akan masuk ke: http://localhost:3000/admin/index.html

### 4. Verifikasi Pendaftaran
- Klik menu **Pendaftaran** di sidebar
- Atau buka: http://localhost:3000/admin/pendaftaran.html

### 5. Test Pendaftaran Anggota
- Logout dari admin
- Buka: http://localhost:3000/daftar.html
- Isi form pendaftaran
- Submit

### 6. Approve Pendaftaran
- Login kembali sebagai admin
- Buka: http://localhost:3000/admin/pendaftaran.html
- Klik **Setujui** pada pendaftaran baru
- Copy kredensial yang diberikan

---

## 🎯 What's Next?

### Fitur yang Sudah Berfungsi:
✅ Homepage dengan statistik
✅ Login system
✅ Pendaftaran anggota online
✅ Verifikasi admin (approve/reject)
✅ QR verification
✅ Admin dashboard
✅ Database anggota

### Fitur yang Bisa Dikembangkan:
- [ ] Halaman berita
- [ ] Halaman agenda
- [ ] Sistem presensi
- [ ] KTA Digital
- [ ] Galeri foto
- [ ] Dan masih banyak lagi...

Lihat `PROJECT_SUMMARY.md` untuk detail lengkap.

---

## 🐛 Troubleshooting

### Error: "MONGODB_URI is not defined"
👉 Pastikan file `.env` sudah dibuat dan diisi dengan benar

### Error: "MongoServerError: bad auth"
👉 Password MongoDB salah, periksa connection string

### Error: "connect ECONNREFUSED"
👉 IP belum di-whitelist di MongoDB Atlas, gunakan `0.0.0.0/0`

### Port Already in Use
👉 Ganti `PORT=3001` di file `.env`

**Troubleshooting lengkap:** Lihat `SETUP_GUIDE.md`

---

## 📚 Dokumentasi Lengkap

- **README.md** - Overview & fitur lengkap
- **SETUP_GUIDE.md** - Panduan setup detail
- **PROJECT_SUMMARY.md** - Status project & roadmap
- **QUICK_START.md** - This file (quick start)

---

## 📞 Butuh Bantuan?

Jika ada masalah:
1. Check console untuk error message
2. Baca SETUP_GUIDE.md untuk panduan detail
3. Pastikan semua kredensial sudah benar
4. Pastikan dependencies terinstall: `npm install`

---

**Selamat mencoba! 🚀**

Made with ❤️ for DPW IMABA Malang
