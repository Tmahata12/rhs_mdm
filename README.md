# 🎓 RHS Mid-Day Meal Management System V2.0

**Complete School Meal Management with Authentication & Analytics**

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Free Deployment](https://img.shields.io/badge/deployment-100%25%20FREE-brightgreen.svg)](docs/FREE_DEPLOYMENT_GUIDE.md)

---

## 📖 Overview

Professional-grade Mid-Day Meal Management System developed for **Ramnagar High School, Durgapur**. Features complete authentication, role-based access control, comprehensive dashboards, and automated reporting.

### ✨ Key Features

- 🔐 **JWT Authentication** - Secure login system with bcrypt password hashing
- 👥 **Role-Based Access** - Admin, Teacher, and Viewer roles
- 📊 **Interactive Dashboards** - Real-time analytics with Chart.js
- 📝 **Form C Management** - Daily meal data entry and tracking
- 📧 **Email Notifications** - Automated daily reports and alerts
- 🔍 **Advanced Search** - Search by date range, class, student name
- 📈 **Activity Logging** - Complete audit trail of all actions
- 💾 **Automated Backups** - Daily MongoDB backups
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🌐 **Bengali Support** - Full Bengali language interface
- 📤 **Multiple Export Formats** - Excel, PDF, JSON, CSV

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**For Linux/Mac:**
```bash
./prepare-deployment.sh
```

**For Windows:**
```cmd
prepare-deployment.bat
```

### Option 2: Manual Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

3. **Generate JWT Secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Start Server:**
   ```bash
   npm start
   ```

5. **Access Application:**
   - Open: http://localhost:3000
   - Default credentials: admin@ramnagarhs.edu / admin123
   - ⚠️ Change password immediately!

---

## 📦 Deployment

### 🌟 Free Deployment Options

#### 1. Render.com (Recommended) ⭐
- **Guide:** [FREE_DEPLOYMENT_GUIDE.md](FREE_DEPLOYMENT_GUIDE.md)
- **Quick Guide:** [QUICK_START_BANGLA.md](QUICK_START_BANGLA.md)
- **Config File:** render.yaml (included)
- **Free Tier:** 750 hours/month, HTTPS included
- **Deploy Time:** ~5-10 minutes

#### 2. Railway.app
- Easy GitHub integration
- $5 credit/month (usually sufficient)
- No sleep time on free tier

#### 3. Vercel
- Serverless deployment
- Good for frontend-heavy apps
- Config file: vercel.json (included)

**📄 Complete deployment guide available in:**
- English/Bengali Mix: `FREE_DEPLOYMENT_GUIDE.md`
- Quick Guide (Bengali): `QUICK_START_BANGLA.md`

---

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **HTML5/CSS3** - Modern web standards
- **JavaScript (ES6+)** - Client-side logic
- **Chart.js** - Data visualization
- **Bootstrap** - Responsive design
- **LocalStorage API** - Offline capability

### DevOps
- **Git** - Version control
- **npm** - Package management
- **nodemon** - Development server
- **dotenv** - Environment configuration

---

## 📂 Project Structure

```
rhs-mdm-system-v2/
├── server.js                      # Main backend server
├── package.json                   # Dependencies
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
│
├── 📄 Documentation
│   ├── README.md                  # This file
│   ├── FREE_DEPLOYMENT_GUIDE.md   # Complete deployment guide
│   ├── QUICK_START_BANGLA.md     # Quick Bengali guide
│   └── README_V2.md              # Version 2 details
│
├── 🔧 Configuration
│   ├── render.yaml               # Render.com config
│   ├── vercel.json               # Vercel config
│   └── ecosystem.config.js       # PM2 config
│
├── 🎨 Frontend Pages
│   ├── index.html                # Landing page
│   ├── login.html                # Login page
│   ├── dashboard.html            # Main dashboard
│   ├── app.html                  # Form C entry
│   ├── user-management.html      # User admin
│   └── activity-logs.html        # Activity logs
│
├── 🔐 Authentication
│   ├── auth.js                   # Auth middleware
│   ├── forgot-password.html      # Password reset page
│   └── forgot-password-system.js # Password reset logic
│
├── 📊 Data Management
│   ├── enhanced-formc-system.js  # Form C logic
│   ├── formc-dashboard.js        # Dashboard logic
│   ├── search-system.js          # Search functionality
│   └── advanced-export.js        # Export functions
│
├── 📧 Notifications
│   ├── email-system.js           # Email notifications
│   └── activity-logger.js        # Activity logging
│
├── 🗄️ Database
│   ├── backup-system.js          # Automated backups
│   └── create-admin.js           # Admin user creation
│
├── 🧪 Testing
│   ├── test-setup.js             # Database test
│   └── test-api.html             # API testing page
│
└── 📁 Directories
    ├── uploads/                  # User uploads
    ├── logs/                     # System logs
    └── backups/                  # Database backups
```

---

## 🔑 Environment Variables

### Required Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rhs_mdm

# Server Configuration
PORT=3000
NODE_ENV=production

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_secure_random_secret_key_here

# Frontend URL
FRONTEND_URL=https://your-domain.com
```

### Optional Variables (Email Notifications)

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@ramnagarhs.edu
```

**📝 Note:** Complete configuration guide in `.env.example`

---

## 👥 User Roles

### 1. Admin
- Full system access
- User management
- Role assignment
- System configuration
- All reports and analytics

### 2. Teacher
- Data entry (Form C)
- View reports
- Search functionality
- Export data
- Activity logging

### 3. Viewer
- Read-only access
- View dashboards
- View reports
- No data modification

---

## 📊 Features in Detail

### Authentication System
- Secure JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Session management
- Password reset functionality
- Automatic logout on token expiry

### Dashboard Analytics
- Real-time student attendance tracking
- Meal distribution statistics
- Class-wise breakdown
- Daily, weekly, monthly reports
- Interactive charts with Chart.js

### Form C Management
- Daily meal data entry
- Validation and error checking
- Bulk entry support
- Edit and update entries
- Delete with confirmation
- Search and filter

### Reporting & Export
- Generate comprehensive reports
- Export to Excel (.xlsx)
- Export to PDF
- Export to JSON/CSV
- Email reports automatically
- WhatsApp integration

### Activity Logging
- Complete audit trail
- User activity tracking
- System event logging
- Login/logout tracking
- Data modification history

---

## 🔐 Security Features

### Implemented Security Measures

- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure headers (helmet)
- ✅ Environment variable protection
- ✅ .gitignore for sensitive files

### Security Best Practices

1. **Never commit `.env` file**
2. **Change default admin password immediately**
3. **Use strong passwords**
4. **Keep JWT secret secure**
5. **Use HTTPS in production**
6. **Regular security updates**
7. **Monitor activity logs**
8. **Regular database backups**

---

## 🧪 Testing

### Local Testing

```bash
# Test MongoDB connection
npm run test

# Test with sample data
node test-setup.js

# Start development server
npm run dev
```

### API Testing

Open `test-api.html` in browser for interactive API testing.

---

## 📱 Mobile Responsiveness

System is fully responsive and works perfectly on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1440px+)

---

## 🌐 Browser Support

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

---

## 📈 Performance

### Optimizations

- Compression middleware
- Static file caching
- Database indexing
- Query optimization
- Lazy loading
- Code minification
- Image optimization

### Expected Performance

- Page load: < 2 seconds
- API response: < 500ms
- Database queries: < 100ms
- Search operations: < 200ms

---

## 🔄 Backup & Recovery

### Automated Backups

- Daily automated backups (2 AM)
- Backup location: `/backups` directory
- Retention: 7 days
- MongoDB Atlas also provides automatic backups

### Manual Backup

```bash
node backup-system.js
```

### Restore from Backup

```bash
mongorestore --uri="YOUR_MONGODB_URI" --archive=backup-file.archive
```

---

## 📧 Email Notifications

### Automatic Emails

- Daily meal reports
- Low attendance alerts
- System errors
- Password reset links
- User registration confirmations

### Gmail Setup

1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in EMAIL_PASSWORD
4. Full guide in `.env.example`

---

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
```
Solution:
1. Check MongoDB Atlas network access (0.0.0.0/0)
2. Verify connection string
3. Check database user permissions
```

#### Authentication Error
```
Solution:
1. Clear browser cache
2. Check JWT_SECRET is set
3. Verify token hasn't expired
```

#### Deployment Issues
```
Solution:
1. Check all environment variables
2. Verify build logs
3. Check server logs
4. See deployment guide for detailed troubleshooting
```

**📖 Complete troubleshooting guide in FREE_DEPLOYMENT_GUIDE.md**

---

## 📝 Changelog

### Version 2.0.0 (Current)
- ✨ Added JWT authentication
- ✨ Role-based access control
- ✨ Interactive dashboards
- ✨ Activity logging
- ✨ Email notifications
- ✨ Automated backups
- ✨ Advanced search
- ✨ Multiple export formats
- 🔒 Enhanced security
- 📱 Mobile responsive
- 🌐 Bengali language support

### Version 1.0.0
- Basic Form C entry
- Simple data storage
- Local storage only
- Basic UI

---

## 🤝 Contributing

This is a school project for Ramnagar High School. For suggestions or issues:

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📞 Support

For support and queries:

- **School:** Ramnagar High School, Durgapur
- **Developer:** Tapas Kumar Ghosh
- **Email:** [Contact through school]
- **Documentation:** See included guide files

---

## 📜 License

ISC License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Ramnagar High School** - For the opportunity
- **Teaching Staff** - For feedback and requirements
- **MongoDB Atlas** - For free cloud database
- **Render.com** - For free hosting
- **Open Source Community** - For amazing tools

---

## 📚 Additional Resources

### Documentation Files

1. **FREE_DEPLOYMENT_GUIDE.md** - Complete deployment guide (English/Bengali)
2. **QUICK_START_BANGLA.md** - Quick start guide (Bengali)
3. **README_V2.md** - Version 2 technical details
4. **.env.example** - Environment configuration template

### Deployment Scripts

- `prepare-deployment.sh` - Linux/Mac deployment prep
- `prepare-deployment.bat` - Windows deployment prep

### Configuration Files

- `render.yaml` - Render.com configuration
- `vercel.json` - Vercel configuration
- `ecosystem.config.js` - PM2 configuration

---

## 🎯 Roadmap

### Planned Features

- [ ] SMS notifications
- [ ] Mobile app (React Native)
- [ ] Inventory management
- [ ] Supplier management
- [ ] Budget tracking
- [ ] Menu planning
- [ ] Nutrition tracking
- [ ] Parent portal
- [ ] Multi-school support

---

## 📊 System Requirements

### Server Requirements
- Node.js 14+
- npm 6+
- MongoDB 4.4+
- 512 MB RAM (minimum)
- 1 GB disk space

### Client Requirements
- Modern web browser
- JavaScript enabled
- Internet connection
- 1024x768 resolution (minimum)

---

## ⚡ Quick Links

- [🚀 Deployment Guide](FREE_DEPLOYMENT_GUIDE.md)
- [⚡ Quick Start (Bengali)](QUICK_START_BANGLA.md)
- [📖 V2 Details](README_V2.md)
- [🔧 Environment Config](.env.example)
- [🌐 MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [🎨 Render.com](https://render.com/)
- [🚂 Railway.app](https://railway.app/)

---

<div align="center">

**Made with ❤️ for Education**

**Ramnagar High School, Durgapur**

**Version 2.0.0 | December 2024**

---

**⭐ Star this project if you find it useful!**

</div>
