# 🚀 RHS MDM System - Quick Start Guide (সংক্ষিপ্ত গাইড)

## ⚡ মাত্র 5 টি ধাপে Deploy করুন!

---

### 📌 ধাপ ১: MongoDB Atlas Setup (Database)

1. যান: **https://www.mongodb.com/cloud/atlas/register**
2. FREE account তৈরি করুন
3. Create FREE Cluster → Wait 5-7 minutes
4. Database Access → Add User:
   - Username: `tapas_mdm`
   - Password: **[Strong password - Save করুন]**
5. Network Access → Allow Access from Anywhere (0.0.0.0/0)
6. Database → Connect → Connection String copy করুন:
   ```
   mongodb+srv://tapas_mdm:YourPassword@cluster0.xxxxx.mongodb.net/rhs_mdm?retryWrites=true&w=majority
   ```

---

### 📌 ধাপ ২: GitHub এ Code Upload

1. Terminal open করুন system folder এ
2. Commands run করুন:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. GitHub এ যান: **https://github.com/new**
4. Repository তৈরি করুন: `rhs-mdm-system-v2` (Public)
5. Push করুন:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/rhs-mdm-system-v2.git
   git branch -M main
   git push -u origin main
   ```

---

### 📌 ধাপ ৩: Render.com এ Deploy (RECOMMENDED ⭐)

1. যান: **https://render.com/**
2. Sign up with GitHub
3. Dashboard → New (+) → Web Service
4. Select repository: `rhs-mdm-system-v2`
5. Configure করুন:
   - Name: `rhs-mdm-system`
   - Runtime: Node
   - Build: `npm install`
   - Start: `npm start`
   - Instance: **Free**

---

### 📌 ধাপ ৪: Environment Variables Add করুন

Render Dashboard এ Variables section এ যোগ করুন:

```
MONGODB_URI     = [Your MongoDB connection string]
JWT_SECRET      = [Generate করুন: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
NODE_ENV        = production
PORT            = 10000
FRONTEND_URL    = https://rhs-mdm-system.onrender.com
```

**Optional (Email জন্য):**
```
EMAIL_SERVICE   = gmail
EMAIL_USER      = your-email@gmail.com
EMAIL_PASSWORD  = your-app-password
ADMIN_EMAIL     = admin@ramnagarhs.edu
```

---

### 📌 ধাপ ৫: Deploy & Test

1. "Create Web Service" click করুন
2. Deploy হতে 5-10 minutes wait করুন
3. URL পাবেন: **https://rhs-mdm-system.onrender.com**
4. Open করুন এবং login করুন:
   - Email: `admin@ramnagarhs.edu`
   - Password: `admin123`
5. **⚠️ IMMEDIATELY admin password change করুন!**

---

## 🎯 সম্পূর্ণ তথ্যের জন্য দেখুন:
📄 **FREE_DEPLOYMENT_GUIDE.md** (Full detailed guide)

---

## 🆘 দ্রুত সাহায্য

### ❓ Problem: Database connection error
**সমাধান:**
- MongoDB Atlas এ 0.0.0.0/0 allow করা আছে কিনা check করুন
- Connection string এ password সঠিক আছে কিনা verify করুন

### ❓ Problem: Site slow loading
**সমাধান:**
- Free tier এ 15 min inactive থাকলে sleep যায়
- প্রথম request এ 30 seconds লাগে wake up হতে
- এটি normal behaviour for free tier

### ❓ Problem: Can't login
**সমাধান:**
- Browser cache clear করুন
- Incognito mode try করুন
- Check server logs - admin user created হয়েছে কিনা

---

## 📊 Free Tier Limits

**Render.com:**
- ✅ 750 hours/month (24/7 জন্য enough)
- ✅ HTTPS automatic
- ⚠️ 15 min inactive = sleep (30 sec to wake)
- ✅ Custom domain support

**MongoDB Atlas:**
- ✅ 512 MB storage (thousands of entries জন্য enough)
- ✅ No credit card required

---

## 🔐 Security Checklist

- [ ] First login এ admin password change করুন
- [ ] .env file GitHub এ upload করবেন না
- [ ] Strong passwords use করুন
- [ ] HTTPS use করুন (automatic in Render)
- [ ] Regular backups check করুন

---

## 💡 Pro Tips

1. **Bookmark করুন:** আপনার live URL
2. **Staff training:** সবাইকে সঠিকভাবে train করুন
3. **Regular check:** Dashboard weekly check করুন
4. **Backup:** Monthly database export করুন
5. **Monitor:** Activity logs নজর রাখুন

---

## 🎉 Success!

আপনার system এখন **LIVE** এবং **100% FREE**!

**URL:** https://rhs-mdm-system.onrender.com (আপনার actual URL)

---

**Made with ❤️ for Ramnagar High School, Durgapur**
**Version 2.0.0 | December 2024**
