# 🚀 RHS MDM System V2.0 - Free Deployment Guide
# ফ্রি তে অনলাইন Deployment গাইড

---

## 📋 Overview | সংক্ষিপ্ত বিবরণ

এই system টি **Node.js + Express + MongoDB** এ তৈরি। আমরা এটিকে **100% FREE** তে deploy করব।

### ✅ Best FREE Hosting Options (সবচেয়ে ভালো বিকল্প):

1. **Render.com** ⭐ (সবচেয়ে সহজ - RECOMMENDED)
2. **Railway.app** (ভালো alternative)
3. **Vercel** (Frontend জন্য ভালো, Backend এ কিছু সীমাবদ্ধতা)

---

## 🎯 STEP 1: Prerequisites | প্রয়োজনীয় জিনিস

### A) GitHub Account তৈরি করুন (যদি না থাকে)
1. যান: https://github.com/signup
2. Email দিয়ে signup করুন
3. Email verify করুন

### B) Git Install করুন (যদি না থাকে)
- Windows: https://git-scm.com/download/win
- Mac: `brew install git`
- Linux: `sudo apt-get install git`

### C) MongoDB Atlas Account (FREE Database)
1. যান: https://www.mongodb.com/cloud/atlas/register
2. FREE account তৈরি করুন
3. "Create a FREE Cluster" click করুন
4. Cluster তৈরি হতে 5-7 minutes সময় লাগবে

---

## 🗄️ STEP 2: MongoDB Atlas Setup (Database তৈরি)

### 1. Database User তৈরি করুন:
```
- Atlas Dashboard → Database Access → Add New Database User
- Username: tapas_mdm
- Password: একটি strong password (save করে রাখুন)
- Built-in Role: "Atlas admin"
- Click: Add User
```

### 2. Network Access Setup:
```
- Atlas Dashboard → Network Access → Add IP Address
- Click: "Allow Access from Anywhere"
- IP Address: 0.0.0.0/0
- Click: Confirm
```

### 3. Connection String নিন:
```
- Atlas Dashboard → Database → Connect
- Choose: "Connect your application"
- Driver: Node.js
- Version: 5.5 or later
- Copy করুন connection string:
  
  mongodb+srv://tapas_mdm:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

⚠️ IMPORTANT: <password> এর জায়গায় আপনার actual password বসান!
⚠️ শেষে ?retryWrites এর আগে /rhs_mdm যোগ করুন:
  
  mongodb+srv://tapas_mdm:YourPassword@cluster0.xxxxx.mongodb.net/rhs_mdm?retryWrites=true&w=majority
```

---

## 📦 STEP 3: GitHub এ Code Upload করুন

### 1. আপনার system folder এ যান:
```bash
cd path/to/mdm_system_v2
```

### 2. Git Initialize করুন:
```bash
git init
git add .
git commit -m "Initial commit - RHS MDM System V2.0"
```

### 3. GitHub এ Repository তৈরি করুন:
```
- যান: https://github.com/new
- Repository name: rhs-mdm-system-v2
- Description: Ramnagar High School Mid-Day Meal Management System
- Public বা Private choose করুন (Public recommended for free deployment)
- Click: Create repository
```

### 4. GitHub এ Push করুন:
```bash
git remote add origin https://github.com/YOUR_USERNAME/rhs-mdm-system-v2.git
git branch -M main
git push -u origin main
```

**⚠️ IMPORTANT:** `.env` file GitHub এ upload করবেন না! এটি `.gitignore` এ already আছে।

---

## 🎨 OPTION 1: Render.com Deployment (RECOMMENDED ⭐)

### সবচেয়ে সহজ এবং সেরা বিকল্ প!

### Step 1: Render Account তৈরি করুন
1. যান: https://render.com/
2. "Get Started for Free" click করুন
3. GitHub দিয়ে Sign up করুন

### Step 2: New Web Service তৈরি করুন
```
1. Dashboard → New (+) → Web Service
2. Connect your GitHub repository: rhs-mdm-system-v2
3. Configure করুন:
   
   Name: rhs-mdm-system
   Region: Singapore (closest to India)
   Branch: main
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   
   Instance Type: Free
```

### Step 3: Environment Variables যোগ করুন
```
Environment Variables Section এ click করুন:

Key                 | Value
--------------------|-----------------------------------------------
MONGODB_URI         | mongodb+srv://tapas_mdm:YourPassword@...
PORT                | 10000 (Render automatically sets this)
NODE_ENV            | production
JWT_SECRET          | [Generate করুন নিচের command দিয়ে]
EMAIL_SERVICE       | gmail (optional)
EMAIL_USER          | your-email@gmail.com (optional)
EMAIL_PASSWORD      | your-app-password (optional)
ADMIN_EMAIL         | admin@ramnagarhs.edu (optional)
FRONTEND_URL        | https://rhs-mdm-system.onrender.com (আপনার actual URL)
```

### Step 4: JWT Secret Generate করুন
আপনার computer terminal এ run করুন:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
এই output copy করে JWT_SECRET এ paste করুন।

### Step 5: Deploy করুন
```
- "Create Web Service" click করুন
- Deploy শুরু হবে (5-10 minutes সময় লাগবে)
- Deploy complete হলে URL দেখাবে:
  https://rhs-mdm-system.onrender.com
```

### ✅ Testing
1. যান: https://rhs-mdm-system.onrender.com
2. Login page দেখতে পাবেন
3. Default admin credentials:
   - Email: admin@ramnagarhs.edu
   - Password: admin123

---

## 🚂 OPTION 2: Railway.app Deployment (Alternative)

### Step 1: Railway Account তৈরি করুন
1. যান: https://railway.app/
2. "Login with GitHub" click করুন

### Step 2: New Project তৈরি করুন
```
1. Dashboard → New Project
2. "Deploy from GitHub repo" select করুন
3. আপনার repository select করুন: rhs-mdm-system-v2
4. Automatically deploy শুরু হবে
```

### Step 3: Environment Variables যোগ করুন
```
Settings → Variables:

MONGODB_URI = mongodb+srv://tapas_mdm:YourPassword@...
NODE_ENV = production
JWT_SECRET = [Generated secret]
PORT = 3000
EMAIL_SERVICE = gmail (optional)
EMAIL_USER = your-email@gmail.com (optional)
EMAIL_PASSWORD = your-app-password (optional)
FRONTEND_URL = https://YOUR-APP.up.railway.app
```

### Step 4: Deploy করুন
```
- Deploy automatically হবে
- Settings → Generate Domain click করুন
- URL পাবেন: https://YOUR-APP.up.railway.app
```

### ⚠️ Railway Free Tier Limits:
- $5 credit/month (usually enough for small apps)
- 500 hours execution time
- No credit card required for free tier

---

## 🌐 OPTION 3: Vercel Deployment (Frontend Focus)

⚠️ **Note:** Vercel primarily for serverless functions। Backend deployment এ কিছু limitations আছে।

### Step 1: Vercel Account তৈরি করুন
1. যান: https://vercel.com/signup
2. GitHub দিয়ে Sign up করুন

### Step 2: vercel.json তৈরি করুন
আপনার project root এ এই file তৈরি করুন:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Step 3: Deploy করুন
```bash
npm install -g vercel
vercel login
vercel
```

### Step 4: Environment Variables
```
Vercel Dashboard → Your Project → Settings → Environment Variables
(Same variables as Render.com)
```

---

## 📧 Email Configuration (Optional কিন্তু Recommended)

### Gmail Setup:
1. Gmail → Manage your Google Account
2. Security → 2-Step Verification (Enable করুন)
3. Security → App passwords
4. Select app: Mail
5. Select device: Other (custom name)
6. Generate password copy করুন
7. এই password use করুন EMAIL_PASSWORD এ

---

## 🔒 Security Checklist (নিরাপত্তা)

### ⚠️ MUST DO (করতেই হবে):
- [ ] First login এ admin password change করুন
- [ ] `.env` file কখনো GitHub এ upload করবেন না
- [ ] Strong JWT secret use করুন
- [ ] MongoDB Atlas এ strong password use করুন
- [ ] HTTPS URL use করুন (Render/Railway automatically দেয়)

### ✅ Recommended:
- [ ] Email notifications setup করুন
- [ ] Regular backups enable করুন (automatic system আছে)
- [ ] User roles properly configure করুন
- [ ] Activity logs regularly check করুন

---

## 🎯 Default Admin Credentials

⚠️ **Change করুন immediately!**

```
Email: admin@ramnagarhs.edu
Password: admin123
```

Login করার পর:
1. Dashboard → User Management
2. Edit admin user
3. Strong password set করুন

---

## 📊 Free Tier Limitations

### Render.com:
- ✅ 750 hours/month (enough for 24/7)
- ✅ Automatic HTTPS
- ⚠️ Sleeps after 15 minutes inactivity (wakes up in 30 seconds)
- ✅ Custom domain support

### Railway.app:
- ✅ $5 credit/month
- ✅ No sleep time
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ⚠️ Credit card required after trial

### MongoDB Atlas:
- ✅ 512 MB storage (enough for thousands of entries)
- ✅ Shared RAM
- ✅ No credit card required

---

## 🔧 Troubleshooting (সমস্যা সমাধান)

### Problem 1: "Application Error" দেখাচ্ছে
**Solution:**
1. Check করুন সব environment variables সঠিকভাবে set করা আছে কিনা
2. MongoDB connection string correct আছে কিনা verify করুন
3. Deployment logs check করুন

### Problem 2: Database connection error
**Solution:**
1. MongoDB Atlas এ Network Access check করুন (0.0.0.0/0 allowed)
2. Connection string এ password সঠিক আছে কিনা check করুন
3. Database user permissions check করুন

### Problem 3: Site খুব slow loading হচ্ছে (Render)
**Solution:**
- এটি normal - free tier এ 15 minutes inactive থাকলে sleep mode এ যায়
- প্রথম request এ 30-50 seconds লাগে wake up হতে
- Solution: Paid plan ($7/month) নিলে 24/7 active থাকবে
- অথবা: Cron job setup করুন যা প্রতি 10 minutes এ একটি request করবে

### Problem 4: Can't login
**Solution:**
1. Browser cache clear করুন
2. Incognito mode এ try করুন
3. Check করুন default admin user created হয়েছে কিনা (server logs দেখুন)
4. Manual admin create করুন: `node create-admin.js`

---

## 🎉 Success! এখন কি করবেন?

1. ✅ System এ login করুন
2. ✅ Admin password change করুন
3. ✅ নতুন users add করুন (Teachers, Viewers)
4. ✅ Form C data entry শুরু করুন
5. ✅ Dashboard explore করুন
6. ✅ Reports generate করুন

---

## 📱 Custom Domain (Optional)

যদি আপনার নিজস্ব domain থাকে (যেমন: mdm.ramnagarhs.edu):

### Render.com এ:
1. Dashboard → Settings → Custom Domain
2. Add your domain
3. DNS records যোগ করুন (instructions দেওয়া থাকবে)

### Railway.app এ:
1. Settings → Domains → Custom Domain
2. Add your domain
3. DNS configure করুন

---

## 💡 Pro Tips

1. **Always backup:** Monthly database export করুন (automatic backup enabled)
2. **Monitor logs:** Activity logs regularly check করুন
3. **User training:** Staff দের সঠিক training দিন
4. **Test first:** Dummy data দিয়ে test করুন production এ যাওয়ার আগে
5. **Keep updated:** Dependencies regularly update করুন security জন্য

---

## 🆘 Need Help?

### Resources:
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app/
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Node.js: https://nodejs.org/docs

### Support:
- আপনার deployment এ কোন সমস্যা হলে specific error message share করুন
- System logs check করুন troubleshooting জন্য

---

## 📝 Quick Comparison Table

| Feature           | Render.com ⭐ | Railway.app | Vercel     |
|-------------------|--------------|-------------|------------|
| Ease of Setup     | ⭐⭐⭐⭐⭐        | ⭐⭐⭐⭐        | ⭐⭐⭐        |
| Free Tier         | Very Good    | Good        | Limited    |
| Node.js Support   | Excellent    | Excellent   | Serverless |
| Always On         | Sleeps 15min | Yes         | Serverless |
| Custom Domain     | ✅            | ✅           | ✅          |
| HTTPS             | Auto         | Auto        | Auto       |
| Best For          | Full Stack   | Full Stack  | Frontend   |

**Recommendation:** **Render.com** use করুন সবচেয়ে সহজ এবং hassle-free deployment জন্য!

---

## ✅ Final Checklist

Deploy করার আগে check করুন:

- [ ] GitHub repository তৈরি হয়েছে
- [ ] MongoDB Atlas cluster তৈরি হয়েছে
- [ ] Connection string পেয়েছি
- [ ] JWT secret generate করেছি
- [ ] All environment variables ready
- [ ] Hosting platform account তৈরি হয়েছে
- [ ] Deploy button click করেছি
- [ ] Site live হয়েছে
- [ ] Login করতে পারছি
- [ ] Admin password change করেছি

---

## 🎊 Congratulations!

আপনার **Ramnagar High School Mid-Day Meal Management System V2.0** এখন **LIVE** এবং **FREE** তে চলছে! 🎉

প্রথম কয়েকদিন closely monitor করুন এবং staff দের সঠিক training দিন।

**Good Luck! 🚀**

---

**Created by:** Tapas Kumar Ghosh  
**School:** Ramnagar High School, Durgapur  
**Version:** 2.0.0  
**Date:** December 2024
