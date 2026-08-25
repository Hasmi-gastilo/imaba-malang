# 🚀 PANDUAN SETUP DPW IMABA MALANG

Panduan lengkap untuk setup dan menjalankan aplikasi.

---

## ⚡ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
copy .env.example .env
```

Edit `.env` dan isi dengan kredensial Anda (lihat panduan lengkap di bawah).

### 3. Seed Database

```bash
npm run seed
```

### 4. Run Server

```bash
npm run dev
```

Buka browser: `http://localhost:3000`

---

## 📝 Setup MongoDB Atlas (Detail)

### Step 1: Buat Akun MongoDB Atlas

1. Kunjungi: https://www.mongodb.com/cloud/atlas/register
2. Daftar dengan email atau Google account
3. Verifikasi email Anda

### Step 2: Buat Cluster

1. Klik "Build a Database"
2. Pilih **FREE** tier (M0 Sandbox)
3. Pilih region terdekat (Singapore untuk Indonesia)
4. Cluster Name: `DPW-IMABA-Malang` (opsional)
5. Klik "Create"

### Step 3: Buat Database User

1. Di bagian "Security" → "Database Access"
2. Klik "Add New Database User"
3. Username: `imabaadmin` (atau sesuai keinginan)
4. Password: Buat password yang kuat (SIMPAN password ini!)
5. User Privileges: "Read and write to any database"
6. Klik "Add User"

### Step 4: Whitelist IP Address

1. Di bagian "Security" → "Network Access"
2. Klik "Add IP Address"
3. Pilih "ALLOW ACCESS FROM ANYWHERE" atau "Add Current IP Address"
4. Jika pilih Allow Access From Anywhere: IP `0.0.0.0/0`
5. Klik "Confirm"

### Step 5: Get Connection String

1. Kembali ke "Database" → Klik "Connect"
2. Pilih "Connect your application"
3. Driver: "Node.js"
4. Version: "4.1 or later"
5. Copy connection string

Connection string akan seperti:
```
mongodb+srv://imabaadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. **Ganti `<password>` dengan password yang Anda buat di Step 3**
7. Tambahkan nama database setelah `.net/`, contoh:
```
mongodb+srv://imabaadmin:password123@cluster0.xxxxx.mongodb.net/dpw-imaba-malang?retryWrites=true&w=majority
```

---

## 🖼️ Setup Cloudinary (Detail)

### Step 1: Buat Akun Cloudinary

1. Kunjungi: https://cloudinary.com/users/register/free
2. Daftar dengan email atau Google account
3. Verifikasi email Anda

### Step 2: Dapatkan Kredensial

1. Setelah login, Anda akan langsung melihat Dashboard
2. Di Dashboard, Anda akan melihat:
   - **Cloud Name**: (contoh: `dxxxxxxx`)
   - **API Key**: (contoh: `123456789012345`)
   - **API Secret**: Klik "reveal" untuk melihat (contoh: `xxxxxxxxxxxxxxxxxxxxxxxx`)
3. Copy ketiga kredensial ini

### Step 3: (Opsional) Buat Folder

1. Klik "Media Library"
2. Klik "Create Folder"
3. Nama folder: `imaba-malang`

---

## 🔐 Setup .env File

Edit file `.env` dengan kredensial Anda:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://imabaadmin:PASSWORD_ANDA@cluster0.xxxxx.mongodb.net/dpw-imaba-malang?retryWrites=true&w=majority

# JWT Secret (generate random string minimal 32 karakter)
AUTH_SECRET=ini-adalah-secret-key-yang-sangat-panjang-dan-aman-12345678

# Cloudinary
CLOUDINARY_CLOUD_NAME=dxxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# App URL
APP_URL=http://localhost:3000

# Port (default 3000)
PORT=3000
```

### Generate AUTH_SECRET

Untuk keamanan maksimal, generate random string:

**Cara 1: Node.js**
```javascript
require('crypto').randomBytes(32).toString('hex')
```

**Cara 2: Online**
https://randomkeygen.com/ (pilih Fort Knox Passwords)

---

## 🌱 Seed Database

Setelah setup `.env`, jalankan seed:

```bash
npm run seed
```

Output yang sukses:
```
🌱 Starting seed process...
🗑️  Clearing existing data...
✅ Data cleared
👤 Creating Super Admin...
✅ Super Admin created
...
🎉 Seed process completed successfully!
```

Kredensial default:
- Super Admin: `admin@imabamalang.org` / `admin123`
- Admin: `sekretaris@imabamalang.org` / `admin123`

---

## 🚀 Menjalankan Server

### Development Mode

```bash
npm run dev
```

Server akan running di: `http://localhost:3000`

### Production Mode

```bash
npm start
```

---

## ✅ Testing

### 1. Test Homepage
Buka: `http://localhost:3000`

### 2. Test Login
1. Buka: `http://localhost:3000/login.html`
2. Email: `admin@imabamalang.org`
3. Password: `admin123`
4. Klik Login

### 3. Test Admin Dashboard
Setelah login, Anda akan diredirect ke: `http://localhost:3000/admin/index.html`

### 4. Test Pendaftaran
1. Buka: `http://localhost:3000/daftar.html`
2. Isi form pendaftaran
3. Submit

### 5. Test Verifikasi Pendaftaran
1. Login sebagai admin
2. Buka: `http://localhost:3000/admin/pendaftaran.html`
3. Setujui atau tolak pendaftaran

---

## 🔧 Troubleshooting

### Error: "MONGODB_URI is not defined"

**Solusi:**
- Pastikan file `.env` ada di root folder
- Pastikan isi `.env` sudah benar
- Restart server

### Error: "MongoServerError: bad auth"

**Solusi:**
- Password MongoDB salah
- Ganti `<password>` di connection string dengan password yang benar
- Pastikan tidak ada karakter spesial yang belum di-encode

### Error: "connect ECONNREFUSED"

**Solusi:**
- IP Anda belum di-whitelist di MongoDB Atlas
- Tambahkan IP atau gunakan `0.0.0.0/0`

### Error: "Cloudinary upload failed"

**Solusi:**
- Kredensial Cloudinary salah
- Periksa Cloud Name, API Key, API Secret
- Pastikan tidak ada spasi di kredensial

### Port Already in Use

**Solusi:**
```bash
# Ganti port di .env
PORT=3001
```

---

## 📦 Deployment ke Vercel

### 1. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/dpw-imaba-malang.git
git push -u origin main
```

### 2. Login ke Vercel

https://vercel.com

### 3. Import Project

1. Klik "Add New Project"
2. Import dari GitHub
3. Select repository: `dpw-imaba-malang`

### 4. Configure Environment Variables

Di Vercel Dashboard, tambahkan environment variables:

- `MONGODB_URI`: (connection string MongoDB Atlas)
- `AUTH_SECRET`: (secret key Anda)
- `CLOUDINARY_CLOUD_NAME`: (dari Cloudinary)
- `CLOUDINARY_API_KEY`: (dari Cloudinary)
- `CLOUDINARY_API_SECRET`: (dari Cloudinary)
- `APP_URL`: (URL production, misal: `https://imabamalang.vercel.app`)

### 5. Deploy

Klik "Deploy" dan tunggu proses selesai.

---

## 📚 Struktur Database

Setelah seed, database akan berisi:

- **users**: 2 admin + 5 sample members
- **members**: 5 sample members
- **departments**: 5 departments
- **positions**: 5 positions
- **settings**: Organization settings

---

## 🔄 Reset Database

Jika ingin reset database:

```bash
npm run seed
```

Ini akan menghapus semua data dan membuat data baru.

---

## 📞 Bantuan

Jika masih ada masalah:

1. Periksa console untuk error message
2. Periksa connection string MongoDB
3. Periksa kredensial Cloudinary
4. Pastikan semua dependencies terinstall (`npm install`)
5. Pastikan Node.js versi 16 atau lebih baru

---

**Selamat mencoba! 🎉**
