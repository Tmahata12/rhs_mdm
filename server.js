// ========================================
// RHS MDM Management System - Backend Server
// Complete Node.js + Express + MongoDB Server
// ========================================

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const multer = require('multer');
const cron = require('node-cron');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import email system
const emailSystem = require('./email-system');

// ========================================
// MIDDLEWARE
// ========================================
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname)); // Serve static files from current directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// ========================================
// MONGODB CONNECTION
// ========================================
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully!'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// ========================================
// FILE UPLOAD CONFIGURATION
// ========================================

// Create upload directories if they don't exist
const uploadDir = path.join(__dirname, 'uploads');
const photosDir = path.join(uploadDir, 'photos');
const backupsDir = path.join(__dirname, 'backups');

[uploadDir, photosDir, backupsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
    }
});

// Configure multer for photo uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, photosDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'meal-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// ========================================
// MONGOOSE SCHEMAS
// ========================================

// Form C Schema
const formCSchema = new mongoose.Schema({
    date: { type: String, required: true },
    class: String,
    students: Number,
    attendanceMale: Number,
    attendanceFemale: Number,
    attendance: Number,
    meals: Number,
    rice: Number,
    costPerMeal: Number,
    totalCost: Number,
    remarks: String
}, { timestamps: true });

// Bank Ledger Schema
const bankLedgerSchema = new mongoose.Schema({
    date: { type: String, required: true },
    type: { type: String, enum: ['receipt', 'payment'], required: true },
    particulars: String,
    voucherNo: String,
    amount: { type: Number, required: true },
    balance: Number,
    remarks: String
}, { timestamps: true });

// Rice Ledger Schema
const riceLedgerSchema = new mongoose.Schema({
    date: { type: String, required: true },
    type: { type: String, enum: ['receipt', 'issue'], required: true },
    particulars: String,
    quantity: { type: Number, required: true },
    balance: Number,
    remarks: String
}, { timestamps: true });

// Expense Ledger Schema
const expenseLedgerSchema = new mongoose.Schema({
    date: { type: String, required: true },
    particulars: String,
    voucherNo: String,
    amount: { type: Number, required: true },
    category: String,
    paymentMode: String,
    remarks: String
}, { timestamps: true });

// Cook Schema
const cookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: String,
    phone: String,
    salary: Number,
    joinDate: String,
    status: { type: String, default: 'active' }
}, { timestamps: true });

// Staff Schema
const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: String,
    phone: String,
    email: String,
    joinDate: String,
    status: { type: String, default: 'active' }
}, { timestamps: true });

// Settings Schema
const settingsSchema = new mongoose.Schema({
    settingsId: { type: String, default: 'default', unique: true },
    school: {
        name: String,
        address: String,
        phone: String,
        email: String,
        principal: String,
        teacherInCharge: String
    },
    enrollment: {
        class1: Number,
        class2: Number,
        class3: Number,
        class4: Number,
        class5: Number,
        class6: Number,
        class7: Number,
        class8: Number,
        class9: Number,
        class10: Number,
        class11: Number,
        class12: Number
    },
    bank: {
        name: String,
        branch: String,
        accountNo: String,
        ifsc: String
    },
    riceStock: { type: Number, default: 0 },
    fundOpening: { type: Number, default: 120000 }
}, { timestamps: true });

// ========================================
// MODELS
// ========================================
const FormC = mongoose.model('FormC', formCSchema);
const BankLedger = mongoose.model('BankLedger', bankLedgerSchema);
const RiceLedger = mongoose.model('RiceLedger', riceLedgerSchema);
const ExpenseLedger = mongoose.model('ExpenseLedger', expenseLedgerSchema);
const Cook = mongoose.model('Cook', cookSchema);
const Staff = mongoose.model('Staff', staffSchema);
const Settings = mongoose.model('Settings', settingsSchema);

// User Schema for Authentication (V2.0)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'teacher', 'viewer'], default: 'viewer' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    phone: String,
    lastLogin: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Activity Log Schema (V2.0)
const activityLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    action: { type: String, required: true }, // 'create', 'update', 'delete', 'login', 'logout'
    module: String, // 'FormC', 'Bank', 'Rice', 'Expense', 'Auth', 'Users'
    details: String,
    timestamp: { type: Date, default: Date.now }
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

// Photo Schema
const photoSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: String,
    path: { type: String, required: true },
    size: Number,
    mimeType: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: String, required: true }, // Date the photo is associated with
    category: { type: String, enum: ['meal', 'kitchen', 'receipt', 'other'], default: 'meal' },
    description: String,
    uploadedAt: { type: Date, default: Date.now }
});

const Photo = mongoose.model('Photo', photoSchema);

// Notification Schema
const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Specific users or empty for all
    read: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who have read it
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date
});

const Notification = mongoose.model('Notification', notificationSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: 'You do not have permission to perform this action' 
            });
        }
        next();
    };
};

// ========================================
// API ROUTES
// ========================================

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'RHS MDM Server is running!',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// ========================================
// AUTHENTICATION ROUTES (V2.0)
// ========================================

// Register new user (Admin only)
app.post('/api/auth/register', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'viewer',
            phone,
            status: 'active'
        });

        // Log activity
        await ActivityLog.create({
            user: req.user.userId,
            userName: req.user.name,
            action: 'create',
            module: 'Users',
            details: `Created new user: ${name} (${email})`
        });

        res.json({
            success: true,
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(403).json({ success: false, message: 'Account is inactive' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Log activity
        await ActivityLog.create({
            user: user._id,
            userName: user.name,
            action: 'login',
            module: 'Auth',
            details: 'User logged in'
        });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

// Get current user info
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Logout
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
    try {
        // Log activity
        await ActivityLog.create({
            user: req.user.userId,
            userName: req.user.name,
            action: 'logout',
            module: 'Auth',
            details: 'User logged out'
        });

        res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get activity logs (Admin and Teacher only)
app.get('/api/activity-logs', authenticateToken, authorizeRoles('admin', 'teacher'), async (req, res) => {
    try {
        const { module, action, limit = 50 } = req.query;
        
        let query = {};
        if (module && module !== 'all') query.module = module;
        if (action && action !== 'all') query.action = action;

        const logs = await ActivityLog.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .populate('user', 'name email');

        res.json({ success: true, logs });
    } catch (error) {
        console.error('Get logs error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Dashboard statistics (Authenticated users)
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const stats = {
            formC: await FormC.countDocuments(),
            bankBalance: 0,
            riceStock: 0,
            totalExpense: 0,
            activeUsers: await User.countDocuments({ status: 'active' })
        };

        // Get bank balance
        const bankLedger = await BankLedger.find().sort({ date: -1 }).limit(1);
        if (bankLedger.length > 0) {
            stats.bankBalance = bankLedger[0].balance || 0;
        }

        // Get rice stock
        const riceLedger = await RiceLedger.find().sort({ date: -1 }).limit(1);
        if (riceLedger.length > 0) {
            stats.riceStock = riceLedger[0].closingStock || 0;
        }

        // Get total expense (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const expenses = await ExpenseLedger.find({
            date: { $gte: thirtyDaysAgo.toISOString().split('T')[0] }
        });
        stats.totalExpense = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

        res.json({ success: true, stats });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ========================================
// FORM C ROUTES
// ========================================
app.get('/api/formC', async (req, res) => {
    try {
        const data = await FormC.find().sort({ date: 1 });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/formC', async (req, res) => {
    try {
        const formC = new FormC(req.body);
        await formC.save();
        res.json({ success: true, data: formC });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/formC/:id', async (req, res) => {
    try {
        const formC = await FormC.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: formC });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/formC/:id', async (req, res) => {
    try {
        await FormC.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========================================
// BANK LEDGER ROUTES
// ========================================
app.get('/api/bank', async (req, res) => {
    try {
        const data = await BankLedger.find().sort({ date: 1 });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/bank', async (req, res) => {
    try {
        const ledger = new BankLedger(req.body);
        await ledger.save();
        res.json({ success: true, data: ledger });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/bank/:id', async (req, res) => {
    try {
        await BankLedger.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========================================
// RICE LEDGER ROUTES
// ========================================
app.get('/api/rice', async (req, res) => {
    try {
        const data = await RiceLedger.find().sort({ date: 1 });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/rice', async (req, res) => {
    try {
        const ledger = new RiceLedger(req.body);
        await ledger.save();
        res.json({ success: true, data: ledger });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/rice/:id', async (req, res) => {
    try {
        await RiceLedger.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========================================
// EXPENSE LEDGER ROUTES
// ========================================
app.get('/api/expense', async (req, res) => {
    try {
        const data = await ExpenseLedger.find().sort({ date: 1 });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/expense', async (req, res) => {
    try {
        const ledger = new ExpenseLedger(req.body);
        await ledger.save();
        res.json({ success: true, data: ledger });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/expense/:id', async (req, res) => {
    try {
        await ExpenseLedger.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========================================
// COOK ROUTES
// ========================================
app.get('/api/cooks', async (req, res) => {
    try {
        const data = await Cook.find();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/cooks', async (req, res) => {
    try {
        const cook = new Cook(req.body);
        await cook.save();
        res.json({ success: true, data: cook });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/cooks/:id', async (req, res) => {
    try {
        await Cook.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========================================
// STAFF ROUTES
// ========================================
app.get('/api/staff', async (req, res) => {
    try {
        const data = await Staff.find();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/staff', async (req, res) => {
    try {
        const staff = new Staff(req.body);
        await staff.save();
        res.json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/staff/:id', async (req, res) => {
    try {
        await Staff.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========================================
// SETTINGS ROUTES
// ========================================
app.get('/api/settings', async (req, res) => {
    try {
        let settings = await Settings.findOne({ settingsId: 'default' });
        if (!settings) {
            settings = new Settings({ settingsId: 'default' });
            await settings.save();
        }
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/settings', async (req, res) => {
    try {
        let settings = await Settings.findOne({ settingsId: 'default' });
        if (!settings) {
            settings = new Settings({ settingsId: 'default', ...req.body });
        } else {
            Object.assign(settings, req.body);
        }
        await settings.save();
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========================================
// BULK IMPORT ROUTE (for initial data migration)
// ========================================
app.post('/api/import', async (req, res) => {
    try {
        const { formC, bankLedger, riceLedger, expenseLedger, cooks, staff, settings } = req.body;
        
        // Import Form C
        if (formC && formC.length > 0) {
            await FormC.deleteMany({});
            await FormC.insertMany(formC);
        }
        
        // Import Bank Ledger
        if (bankLedger && bankLedger.length > 0) {
            await BankLedger.deleteMany({});
            await BankLedger.insertMany(bankLedger);
        }
        
        // Import Rice Ledger
        if (riceLedger && riceLedger.length > 0) {
            await RiceLedger.deleteMany({});
            await RiceLedger.insertMany(riceLedger);
        }
        
        // Import Expense Ledger
        if (expenseLedger && expenseLedger.length > 0) {
            await ExpenseLedger.deleteMany({});
            await ExpenseLedger.insertMany(expenseLedger);
        }
        
        // Import Cooks
        if (cooks && cooks.length > 0) {
            await Cook.deleteMany({});
            await Cook.insertMany(cooks);
        }
        
        // Import Staff
        if (staff && staff.length > 0) {
            await Staff.deleteMany({});
            await Staff.insertMany(staff);
        }
        
        // Import Settings
        if (settings) {
            await Settings.findOneAndUpdate(
                { settingsId: 'default' },
                { settingsId: 'default', ...settings },
                { upsert: true, new: true }
            );
        }
        
        res.json({ 
            success: true, 
            message: 'Data imported successfully!',
            imported: {
                formC: formC?.length || 0,
                bankLedger: bankLedger?.length || 0,
                riceLedger: riceLedger?.length || 0,
                expenseLedger: expenseLedger?.length || 0,
                cooks: cooks?.length || 0,
                staff: staff?.length || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========================================
// BACKUP ROUTE
// ========================================
app.get('/api/backup', async (req, res) => {
    try {
        const [settings, formC, bank, rice, expense, cooks, staff] = await Promise.all([
            Settings.findOne({ settingsId: 'default' }),
            FormC.find().sort({ date: 1 }),
            BankLedger.find().sort({ date: 1 }),
            RiceLedger.find().sort({ date: 1 }),
            ExpenseLedger.find().sort({ date: 1 }),
            Cook.find(),
            Staff.find()
        ]);
        
        res.json({
            success: true,
            backup: {
                timestamp: new Date().toISOString(),
                settings,
                formC,
                bankLedger: bank,
                riceLedger: rice,
                expenseLedger: expense,
                cooks,
                staff
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========================================
// SERVE MAIN HTML FILE
// ========================================
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/RHS_MDM_MONGODB_READY.html');
});

// ========================================
// ERROR HANDLING
// ========================================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: 'Something went wrong!',
        message: err.message 
    });
});

// ========================================

// ========================================
// ENHANCED FEATURES ROUTES
// ========================================

// ========================================
// QR CODE GENERATION
// ========================================

// Generate QR code for daily attendance
app.get('/api/qr/daily/:date', authenticateToken, async (req, res) => {
    try {
        const date = req.params.date;
        const quickLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/app.html?quickEntry=true&date=${date}&user=${req.user.userId}`;
        
        const qrCode = await QRCode.toDataURL(quickLink, {
            width: 400,
            margin: 2,
            color: {
                dark: '#667eea',
                light: '#ffffff'
            }
        });

        res.json({
            success: true,
            qrCode: qrCode,
            date: date,
            link: quickLink
        });
    } catch (error) {
        console.error('QR generation error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate QR code' });
    }
});

// ========================================
// PHOTO UPLOAD & GALLERY
// ========================================

// Upload photos (multiple)
app.post('/api/photos/upload', authenticateToken, upload.array('photos', 10), async (req, res) => {
    try {
        const { date, category, description } = req.body;
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        const uploadedPhotos = [];
        
        for (const file of req.files) {
            const photo = await Photo.create({
                filename: file.filename,
                originalName: file.originalname,
                path: `/uploads/photos/${file.filename}`,
                size: file.size,
                mimeType: file.mimetype,
                uploadedBy: req.user.userId,
                date: date || new Date().toISOString().split('T')[0],
                category: category || 'meal',
                description: description || ''
            });
            
            uploadedPhotos.push(photo);
        }

        // Log activity
        await ActivityLog.create({
            user: req.user.userId,
            userName: req.user.name,
            action: 'create',
            module: 'Photos',
            details: `Uploaded ${uploadedPhotos.length} photo(s)`
        });

        res.json({
            success: true,
            message: `${uploadedPhotos.length} photo(s) uploaded successfully`,
            photos: uploadedPhotos
        });
    } catch (error) {
        console.error('Photo upload error:', error);
        res.status(500).json({ success: false, message: 'Failed to upload photos' });
    }
});

// Get all photos or filter by date/category
app.get('/api/photos', authenticateToken, async (req, res) => {
    try {
        const { date, category, limit = 50 } = req.query;
        
        let query = {};
        if (date) query.date = date;
        if (category) query.category = category;

        const photos = await Photo.find(query)
            .populate('uploadedBy', 'name email')
            .sort({ uploadedAt: -1 })
            .limit(parseInt(limit));

        res.json({ success: true, photos });
    } catch (error) {
        console.error('Get photos error:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve photos' });
    }
});

// Delete photo
app.delete('/api/photos/:id', authenticateToken, authorizeRoles('admin', 'teacher'), async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        
        if (!photo) {
            return res.status(404).json({ success: false, message: 'Photo not found' });
        }

        // Delete file from disk
        const filePath = path.join(__dirname, 'uploads', 'photos', photo.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Photo.findByIdAndDelete(req.params.id);

        // Log activity
        await ActivityLog.create({
            user: req.user.userId,
            userName: req.user.name,
            action: 'delete',
            module: 'Photos',
            details: `Deleted photo: ${photo.originalName}`
        });

        res.json({ success: true, message: 'Photo deleted successfully' });
    } catch (error) {
        console.error('Delete photo error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete photo' });
    }
});

// ========================================
// NOTIFICATIONS SYSTEM
// ========================================

// Create notification (Admin only)
app.post('/api/notifications', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { title, message, type, priority, users, expiresAt } = req.body;

        const notification = await Notification.create({
            title,
            message,
            type: type || 'info',
            priority: priority || 'medium',
            users: users || [], // Empty array means all users
            expiresAt: expiresAt || null
        });

        res.json({
            success: true,
            message: 'Notification created successfully',
            notification
        });
    } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({ success: false, message: 'Failed to create notification' });
    }
});

// Get notifications for current user
app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const { limit = 20, unreadOnly = false } = req.query;
        
        // Get notifications for this user (either targeted to them or to all users)
        let query = {
            $or: [
                { users: req.user.userId },
                { users: { $size: 0 } } // Notifications for all users
            ]
        };

        // Filter unread only
        if (unreadOnly === 'true') {
            query.read = { $ne: req.user.userId };
        }

        // Don't show expired notifications
        query.$or.push({ expiresAt: { $exists: false } });
        query.$or.push({ expiresAt: { $gte: new Date() } });

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        // Add read status for current user
        const notificationsWithStatus = notifications.map(notif => ({
            ...notif.toObject(),
            isRead: notif.read.includes(req.user.userId)
        }));

        // Count unread
        const unreadCount = notificationsWithStatus.filter(n => !n.isRead).length;

        res.json({
            success: true,
            notifications: notificationsWithStatus,
            unreadCount
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve notifications' });
    }
});

// Mark notification as read
app.post('/api/notifications/:id/read', authenticateToken, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        if (!notification.read.includes(req.user.userId)) {
            notification.read.push(req.user.userId);
            await notification.save();
        }

        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
    }
});

// Mark all notifications as read
app.post('/api/notifications/read-all', authenticateToken, async (req, res) => {
    try {
        await Notification.updateMany(
            {
                read: { $ne: req.user.userId },
                $or: [
                    { users: req.user.userId },
                    { users: { $size: 0 } }
                ]
            },
            { $addToSet: { read: req.user.userId } }
        );

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ success: false, message: 'Failed to mark all as read' });
    }
});

// Delete notification (Admin only)
app.delete('/api/notifications/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete notification' });
    }
});

// ========================================
// ENHANCED BACKUP SYSTEM
// ========================================

// Create manual backup
app.post('/api/backup/create', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `backup-${timestamp}.json`;
        const backupPath = path.join(backupsDir, backupFileName);

        // Gather all data
        const backupData = {
            metadata: {
                createdAt: new Date(),
                createdBy: req.user.email,
                version: '2.0'
            },
            users: await User.find({}).select('-password'),
            formC: await FormC.find({}),
            bank: await BankLedger.find({}),
            rice: await RiceLedger.find({}),
            expense: await ExpenseLedger.find({}),
            cooks: await Cook.find({}),
            staff: await Staff.find({}),
            activityLogs: await ActivityLog.find({}).limit(1000),
            photos: await Photo.find({}).limit(500),
            notifications: await Notification.find({})
        };

        // Write to file
        fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

        // Log activity
        await ActivityLog.create({
            user: req.user.userId,
            userName: req.user.name,
            action: 'create',
            module: 'Backup',
            details: `Created backup: ${backupFileName}`
        });

        res.json({
            success: true,
            message: 'Backup created successfully',
            filename: backupFileName,
            size: fs.statSync(backupPath).size
        });
    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({ success: false, message: 'Failed to create backup' });
    }
});

// Get backup history
app.get('/api/backup/history', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const files = fs.readdirSync(backupsDir)
            .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
            .map(file => {
                const stats = fs.statSync(path.join(backupsDir, file));
                return {
                    filename: file,
                    size: stats.size,
                    created: stats.mtime,
                    sizeFormatted: (stats.size / 1024 / 1024).toFixed(2) + ' MB'
                };
            })
            .sort((a, b) => b.created - a.created);

        res.json({ success: true, backups: files });
    } catch (error) {
        console.error('Get backup history error:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve backup history' });
    }
});

// Download backup
app.get('/api/backup/download/:filename', authenticateToken, authorizeRoles('admin'), (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(backupsDir, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'Backup file not found' });
        }

        res.download(filePath);
    } catch (error) {
        console.error('Download backup error:', error);
        res.status(500).json({ success: false, message: 'Failed to download backup' });
    }
});

// ========================================
// INITIALIZE DEFAULT ADMIN USER
// ========================================
async function initializeDefaultAdmin() {
    try {
        const adminEmail = 'admin@ramnagarhs.edu';
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                status: 'active'
            });
            console.log('\n✅ Default admin user created');
            console.log('   📧 Email: admin@ramnagarhs.edu');
            console.log('   🔑 Password: admin123\n');
        }
    } catch (error) {
        console.error('❌ Error creating default admin:', error.message);
    }
}

// Initialize on MongoDB connection
mongoose.connection.once('open', async () => {
    console.log('🔐 Initializing authentication system...');
    await initializeDefaultAdmin();
    
    // Initialize email system
    console.log('📧 Initializing email notification system...');
    await emailSystem.init();
    
    // Setup automated jobs
    setupAutomatedJobs();
});

// ========================================
// AUTOMATED JOBS (CRON)
// ========================================

function setupAutomatedJobs() {
    console.log('⏰ Setting up automated jobs...');
    
    // Daily report at 6 PM (18:00)
    cron.schedule('0 18 * * *', async () => {
        console.log('📊 Running daily report job...');
        try {
            const today = new Date().toISOString().split('T')[0];
            const formCData = await FormC.find({ date: today });
            
            if (formCData.length > 0) {
                const totalAttendance = formCData.reduce((sum, entry) => sum + (entry.attendance || 0), 0);
                const totalMeals = formCData.reduce((sum, entry) => sum + (entry.meals || 0), 0);
                const totalRice = formCData.reduce((sum, entry) => sum + (entry.rice || 0), 0);
                const totalCost = formCData.reduce((sum, entry) => sum + (entry.totalCost || 0), 0);
                const totalStudents = formCData.reduce((sum, entry) => sum + (entry.students || 0), 0);
                
                // Check rice stock
                const riceStock = await RiceLedger.findOne().sort({ date: -1 });
                const isLowStock = riceStock && riceStock.closingStock < 50;
                
                await emailSystem.sendDailyReport({
                    date: today,
                    totalStudents,
                    attendance: totalAttendance,
                    meals: totalMeals,
                    rice: totalRice.toFixed(2),
                    cost: totalCost.toFixed(2),
                    attendanceRate: totalStudents > 0 ? ((totalAttendance / totalStudents) * 100).toFixed(1) : 0,
                    lowStock: isLowStock,
                    riceStock: riceStock ? riceStock.closingStock : 0,
                    recipients: process.env.ADMIN_EMAIL
                });
                
                console.log('✅ Daily report sent successfully');
            }
        } catch (error) {
            console.error('❌ Daily report job failed:', error.message);
        }
    }, {
        timezone: "Asia/Kolkata"
    });
    
    // Check stock levels every 6 hours
    cron.schedule('0 */6 * * *', async () => {
        console.log('📦 Checking stock levels...');
        try {
            const riceStock = await RiceLedger.findOne().sort({ date: -1 });
            
            if (riceStock && riceStock.closingStock < 50) {
                await emailSystem.sendLowStockAlert({
                    itemName: 'Rice',
                    currentStock: riceStock.closingStock,
                    unit: 'kg',
                    threshold: 50,
                    recommendedOrder: 100,
                    recipients: process.env.ADMIN_EMAIL
                });
                
                // Also create a notification
                await Notification.create({
                    title: '⚠️ Low Stock Alert',
                    message: `Rice stock is low: ${riceStock.closingStock} kg remaining`,
                    type: 'warning',
                    priority: 'high'
                });
                
                console.log('✅ Low stock alert sent');
            }
        } catch (error) {
            console.error('❌ Stock check failed:', error.message);
        }
    }, {
        timezone: "Asia/Kolkata"
    });
    
    // Weekly summary every Friday at 5 PM
    cron.schedule('0 17 * * 5', async () => {
        console.log('📈 Generating weekly summary...');
        try {
            const endDate = new Date();
            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - 7);
            
            const weekData = await FormC.find({
                date: {
                    $gte: startDate.toISOString().split('T')[0],
                    $lte: endDate.toISOString().split('T')[0]
                }
            });
            
            if (weekData.length > 0) {
                const totalMeals = weekData.reduce((sum, day) => sum + (day.meals || 0), 0);
                const totalExpense = weekData.reduce((sum, day) => sum + (day.totalCost || 0), 0);
                const avgAttendance = (weekData.reduce((sum, day) => sum + (day.attendance || 0), 0) / weekData.length);
                const avgStudents = (weekData.reduce((sum, day) => sum + (day.students || 0), 0) / weekData.length);
                const attendanceRate = avgStudents > 0 ? ((avgAttendance / avgStudents) * 100).toFixed(1) : 0;
                
                await emailSystem.sendWeeklySummary({
                    weekStart: startDate.toISOString().split('T')[0],
                    weekEnd: endDate.toISOString().split('T')[0],
                    totalMeals,
                    avgAttendance: attendanceRate,
                    totalExpense: totalExpense.toFixed(2),
                    workingDays: weekData.length,
                    dailyData: weekData.map(day => ({
                        date: day.date,
                        attendance: day.attendance,
                        meals: day.meals
                    })),
                    recipients: process.env.ADMIN_EMAIL
                });
                
                console.log('✅ Weekly summary sent');
            }
        } catch (error) {
            console.error('❌ Weekly summary failed:', error.message);
        }
    }, {
        timezone: "Asia/Kolkata"
    });
    
    // Clean up old notifications (older than 30 days) - daily at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('🗑️  Cleaning up old notifications...');
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const result = await Notification.deleteMany({
                createdAt: { $lt: thirtyDaysAgo }
            });
            
            console.log(`✅ Cleaned up ${result.deletedCount} old notifications`);
        } catch (error) {
            console.error('❌ Notification cleanup failed:', error.message);
        }
    }, {
        timezone: "Asia/Kolkata"
    });
    
    // Daily backup at 2 AM
    cron.schedule('0 2 * * *', async () => {
        console.log('💾 Creating automatic daily backup...');
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFileName = `auto-backup-${timestamp}.json`;
            const backupPath = path.join(backupsDir, backupFileName);

            const backupData = {
                metadata: {
                    createdAt: new Date(),
                    createdBy: 'System (Auto)',
                    version: '2.0',
                    type: 'automatic'
                },
                users: await User.find({}).select('-password'),
                formC: await FormC.find({}),
                bank: await BankLedger.find({}),
                rice: await RiceLedger.find({}),
                expense: await ExpenseLedger.find({}),
                cooks: await Cook.find({}),
                staff: await Staff.find({})
            };

            fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
            console.log(`✅ Automatic backup created: ${backupFileName}`);
            
            // Clean up old backups (keep last 7 days)
            const files = fs.readdirSync(backupsDir)
                .filter(file => file.startsWith('auto-backup-'))
                .map(file => ({
                    name: file,
                    path: path.join(backupsDir, file),
                    time: fs.statSync(path.join(backupsDir, file)).mtime.getTime()
                }))
                .sort((a, b) => b.time - a.time);
            
            // Delete backups older than 7 days
            if (files.length > 7) {
                files.slice(7).forEach(file => {
                    fs.unlinkSync(file.path);
                    console.log(`🗑️  Deleted old backup: ${file.name}`);
                });
            }
        } catch (error) {
            console.error('❌ Automatic backup failed:', error.message);
        }
    }, {
        timezone: "Asia/Kolkata"
    });
    
    console.log('✅ Automated jobs configured successfully');
    console.log('   📊 Daily report: 6:00 PM');
    console.log('   📦 Stock check: Every 6 hours');
    console.log('   📈 Weekly summary: Friday 5:00 PM');
    console.log('   💾 Daily backup: 2:00 AM');
    console.log('   🗑️  Cleanup: Daily midnight');
}

// START SERVER
// ========================================
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║   🍽️  RHS MDM Management System Server          ║
║   📡 Server running on port ${PORT}               ║
║   🌐 Access: http://localhost:${PORT}            ║
║   🍃 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Connecting... ⏳'}  ║
╚══════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});
