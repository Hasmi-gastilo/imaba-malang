# ✅ DEPLOYMENT CHECKLIST

Checklist untuk memastikan aplikasi siap production.

---

## 🔍 Pre-Deployment Checklist

### 1. Code Quality
- [x] No console.log in production code
- [x] No hardcoded credentials
- [x] All TODO items documented
- [x] Code properly commented
- [x] Error handling implemented

### 2. Security
- [x] Environment variables used for secrets
- [x] Password hashing implemented
- [x] JWT authentication working
- [x] CORS configured
- [x] Rate limiting enabled
- [x] Helmet security headers
- [x] Input validation
- [x] File upload validation

### 3. Database
- [x] MongoDB Atlas setup
- [x] Database indexes created
- [x] Seed data tested
- [ ] Backup strategy planned

### 4. Testing
- [ ] All routes tested
- [ ] Authentication flow tested
- [ ] Authorization tested
- [ ] File upload tested
- [ ] Error scenarios tested

---

## 🌐 Vercel Deployment

### Step 1: Prepare Repository

```bash
# Initialize git if not already
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: DPW IMABA Malang application"

# Create repository on GitHub
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/dpw-imaba-malang.git
git branch -M main
git push -u origin main
```

### Step 2: Vercel Setup

1. **Login to Vercel**
   - Go to: https://vercel.com
   - Sign up / Login with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Import from GitHub
   - Select: `dpw-imaba-malang`

3. **Configure Project**
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: `public`

4. **Environment Variables**
   
   Add these in Vercel Dashboard → Settings → Environment Variables:
   
   ```
   MONGODB_URI
   AUTH_SECRET
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   APP_URL
   ```
   
   **Important:** Set `APP_URL` to your production URL:
   ```
   APP_URL=https://your-app-name.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Visit your app!

---

## 🔐 Environment Variables Setup

### Production Environment Variables:

```env
# MongoDB Atlas (Production Database)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dpw-imaba-malang-prod?retryWrites=true&w=majority

# Strong JWT Secret (Generate new one for production!)
AUTH_SECRET=<generate-new-random-string-min-64-characters>

# Cloudinary (Production)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Production URL
APP_URL=https://your-app-name.vercel.app
```

### Generate Strong AUTH_SECRET

**Option 1: Node.js**
```javascript
require('crypto').randomBytes(64).toString('hex')
```

**Option 2: OpenSSL**
```bash
openssl rand -base64 64
```

**Option 3: Online**
https://randomkeygen.com/ (Fort Knox Passwords section)

---

## 🗄️ Production Database

### MongoDB Atlas Production Setup

1. **Create Production Database**
   - Use separate database for production
   - Name: `dpw-imaba-malang-prod`

2. **Security**
   - Create dedicated database user for production
   - Use strong password
   - Restrict IP access (not 0.0.0.0/0 if possible)

3. **Seed Production Database**
   
   After deployment, run seed once from local:
   ```bash
   # Set production MongoDB URI
   MONGODB_URI="production-uri" npm run seed
   ```
   
   Or create seed endpoint (admin only) for first-time setup.

4. **Backups**
   - Enable automated backups in MongoDB Atlas
   - Schedule: Daily
   - Retention: 7 days minimum

---

## ☁️ Cloudinary Production

1. **Organize Folders**
   - Create folder structure:
     ```
     imaba-malang/
     ├── members/
     ├── news/
     ├── events/
     ├── gallery/
     └── documents/
     ```

2. **Upload Settings**
   - Enable auto-moderation (optional)
   - Set upload presets
   - Configure transformations

3. **Quota Management**
   - Monitor usage
   - Upgrade plan if needed
   - Free tier: 25GB storage, 25GB bandwidth/month

---

## 🔒 Post-Deployment Security

### 1. Change Default Passwords

After first deployment:
- [ ] Login as Super Admin
- [ ] Change password: `admin@imabamalang.org`
- [ ] Change password: `sekretaris@imabamalang.org`
- [ ] Delete or deactivate sample members

### 2. Setup Real Admin Accounts

- [ ] Create real admin accounts with proper emails
- [ ] Assign proper roles
- [ ] Test permissions

### 3. Configure Settings

- [ ] Update organization contact info
- [ ] Set social media links
- [ ] Configure email settings (when implemented)

---

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor:
  - Response times
  - Error rates
  - Traffic patterns

### MongoDB Atlas Monitoring
- Monitor:
  - Database performance
  - Connection count
  - Storage usage

### Cloudinary Monitoring
- Monitor:
  - Storage usage
  - Bandwidth usage
  - Transformation usage

---

## 🐛 Common Deployment Issues

### Issue: "Internal Server Error 500"
**Solution:**
- Check Vercel logs
- Verify environment variables
- Test MongoDB connection
- Check API routes

### Issue: "Cannot read property of undefined"
**Solution:**
- Missing environment variable
- Check variable names (case sensitive)
- Re-deploy after adding variables

### Issue: "CORS Error"
**Solution:**
- Add production URL to CORS whitelist
- Check CORS configuration in server.js

### Issue: "File Upload Not Working"
**Solution:**
- Verify Cloudinary credentials
- Check file size limits
- Verify multer configuration

---

## 📱 Domain Setup (Optional)

### Using Custom Domain

1. **Buy Domain**
   - Recommended: Namecheap, GoDaddy, or any registrar

2. **Configure in Vercel**
   - Vercel Dashboard → Settings → Domains
   - Add your domain
   - Follow DNS configuration instructions

3. **Update Environment Variables**
   ```env
   APP_URL=https://www.imabamalang.org
   ```

4. **Force HTTPS**
   - Automatically handled by Vercel
   - Test: http://yourdomain.com → https://yourdomain.com

---

## ✅ Final Verification

After deployment, test:

### Public Features
- [ ] Homepage loads correctly
- [ ] Registration form works
- [ ] Photo upload works
- [ ] Form validation works
- [ ] Mobile responsive

### Authentication
- [ ] Login works
- [ ] Password validation
- [ ] JWT token generation
- [ ] Protected routes work
- [ ] Logout works

### Admin Features
- [ ] Admin dashboard loads
- [ ] Statistics display correctly
- [ ] Membership verification works
- [ ] Approve/reject applications works
- [ ] Role-based access works

### QR Verification
- [ ] QR code generation works
- [ ] Verification page works
- [ ] Member data displays correctly

### Performance
- [ ] Page load < 3 seconds
- [ ] Images optimized
- [ ] No console errors
- [ ] Mobile performance good

---

## 📝 Post-Deployment Tasks

### Day 1
- [ ] Announce launch to organization
- [ ] Share login credentials to admins
- [ ] Monitor for errors
- [ ] Be ready for support

### Week 1
- [ ] Gather user feedback
- [ ] Fix critical bugs
- [ ] Optimize performance
- [ ] Add missing features (if any)

### Month 1
- [ ] Review analytics
- [ ] Plan feature improvements
- [ ] Update documentation
- [ ] Training for admins (if needed)

---

## 🔄 Continuous Deployment

### Auto-Deploy from GitHub

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Feature: Add new feature"
git push origin main

# Vercel will auto-deploy
```

### Branch Deployments

Create preview deployments:
```bash
git checkout -b feature/new-feature
git add .
git commit -m "Work in progress"
git push origin feature/new-feature

# Vercel creates preview URL
```

---

## 📞 Support Channels

### Technical Issues
- GitHub Issues
- Vercel Support
- MongoDB Support
- Cloudinary Support

### Application Issues
- Create issue in repository
- Contact developer
- Check documentation

---

## 🎉 Launch Checklist

Before announcing:
- [ ] All features tested
- [ ] Default passwords changed
- [ ] Real content added
- [ ] Contact info updated
- [ ] Social media links added
- [ ] Backup configured
- [ ] Monitoring enabled
- [ ] Support plan ready

---

**Ready to deploy? Let's go! 🚀**

Good luck with your launch! 🎊
