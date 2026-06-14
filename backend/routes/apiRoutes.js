const express = require('express');
const router = express.Router();

// ── MODELS ──
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const LeaveBalance = require('../models/LeaveBalance');
const GatePass = require('../models/GatePass');
const Payroll = require('../models/Payroll');
const Training = require('../models/Training');
const Document = require('../models/Document');
const Project = require('../models/Project');
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const Department = require('../models/Department');
const { CanteenMenu, CanteenOrder } = require('../models/Canteen');
const GuestHouse = require('../models/GuestHouse');
const Transport = require('../models/Transport');
const UniformRequest = require('../models/UniformRequest');
const SIMRequest = require('../models/SIMRequest');
const { Asset, AssetRequest } = require('../models/Asset');
const Meeting = require('../models/Meeting');
const Policy = require('../models/Policy');
const Idea = require('../models/Idea');
const GeneralRequest = require('../models/GeneralRequest');
const Request = require('../models/Request');
const AttendanceMissSlip = require('../models/AttendanceMissSlip');
const Resignation = require('../models/Resignation');
const TravelRequest = require('../models/TravelRequest');
const MRF = require('../models/MRF');
const Interview = require('../models/Interview');
const JobDescription = require('../models/JobDescription');
const KeyRepresentative = require('../models/KeyRepresentative');
const WelfareProgram = require('../models/WelfareProgram');
const DepartmentData = require('../models/DepartmentData');
const { generatePayslipPDF, generateGatePassPDF, generateLeavePDF, generateLetterPDF, generateMissSlipPDF, generateTravelPDF, generateCanteenOrderPDF, generateUniformPDF, generateEmployeeProfilePDF } = require('../utils/pdfGenerator');
const { sendEmail } = require('../utils/emailSender');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'smg-employee-portal-secret-2024';

// ════════════════════════════════════════
//  AUTH MIDDLEWARE
// ════════════════════════════════════════
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) { res.status(401).json({ message: 'Token expired or invalid' }); }
};

const roleMiddleware = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
};

// ════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
        const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        const userObj = user.toObject();
        delete userObj.password;
        // Include mustChangePassword so frontend can force password reset on first login
        res.json({ ...userObj, token, refreshToken, mustChangePassword: user.mustChangePassword || false });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, empId, dept, role, designation, phone } = req.body;
        if (!name || !email || !password || !empId || !dept) {
            return res.status(400).json({ message: 'Name, email, password, empId, and dept are required' });
        }
        const existingUser = await User.findOne({ $or: [{ email }, { empId }] });
        if (existingUser) return res.status(409).json({ message: 'User with this email or empId already exists' });
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            name, email, password: hashedPassword, empId, dept,
            role: role || 'employee', designation: designation || '', phone: phone || ''
        });
        const userObj = newUser.toObject();
        delete userObj.password;
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '8h' });
        res.status(201).json({ ...userObj, token });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
        const decoded = jwt.verify(refreshToken, JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const newToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
        const newRefreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token: newToken, refreshToken: newRefreshToken });
    } catch (err) { res.status(401).json({ message: 'Invalid refresh token' }); }
});

router.post('/logout', (req, res) => {
    // Client-side token removal; server acknowledges
    res.json({ message: 'Logged out successfully' });
});

// ════════════════════════════════════════
//  USERS (EMPLOYEE CRUD) & RESUME PARSING
// ════════════════════════════════════════
router.post('/resume/parse', async (req, res) => {
    // Simulating an AI-driven resume parser with a delay
    try {
        await new Promise(r => setTimeout(r, 1500)); // Simulate processing time

        // Return a highly structured mocked parsed response
        // In a real app, you would pass req.files.resume to OpenAI or a parser API
        const mockParsedData = {
            name: "Alexander Candidate",
            email: "alex.candidate@example.com",
            phone: "+91 98765 12345",
            location: "Bangalore, India",
            education: ["B.Tech in Computer Science - NIT (2022)"],
            skills: ["JavaScript", "React", "Node.js", "MongoDB", "Python"],
            certifications: ["AWS Certified Developer"],
            languages: ["English", "Hindi"],
            experience: 3,
            suggestedRole: "Software Engineer",
            suggestedDepartment: "IT",
            suggestedSalary: "12,00,000 INR"
        };
        
        res.json({ success: true, data: mockParsedData });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to parse resume' });
    }
});
router.get('/users', async (_req, res) => {
    try { res.json(await User.find().select('-password')); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/users', async (req, res) => {
    try {
        const { name, email, password, empId, dept, role, designation, phone } = req.body;
        if (!name || !email || !password || !empId || !dept) {
            return res.status(400).json({ message: 'Name, email, password, empId, and dept are required' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: hashedPassword, empId, dept, role: role || 'employee', designation, phone });
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json(userObj);
    } catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/user/:id', async (req, res) => {
    try {
        // Prevent password from being directly updated without hashing
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 12);
        }
        res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password'));
    } catch (err) { res.status(500).json({ message: err.message }); }
});
router.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deactivated successfully', user });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── CREATE EMPLOYEE (Auto-generates empId + password) ──
router.post('/users/create-employee', async (req, res) => {
    try {
        const { name, email, dept, role, designation, phone, shift, reportingTo, dateOfBirth,
                dateOfJoining, bloodGroup, address, education, certifications, skills, languages, emergencyContact } = req.body;
        if (!name || !email || !dept) {
            return res.status(400).json({ message: 'Name, email, and department are required' });
        }
        // Check duplicate
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'User with this email already exists' });

        // Auto-generate employee ID: SMG-YYYY-NNN
        const year = new Date().getFullYear();
        const count = await User.countDocuments();
        const empId = `SMG-${year}-${String(count + 1).padStart(3, '0')}`;

        // Auto-generate random password (8 chars)
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let rawPassword = '';
        for (let i = 0; i < 8; i++) rawPassword += chars.charAt(Math.floor(Math.random() * chars.length));

        const hashedPassword = await bcrypt.hash(rawPassword, 12);
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`;

        const newUser = await User.create({
            name, email, password: hashedPassword, empId, dept,
            role: role || 'employee', designation: designation || '', phone: phone || '',
            shift: shift || 'General (9:00 - 18:00)', reportingTo: reportingTo || '',
            dateOfBirth: dateOfBirth || '', dateOfJoining: dateOfJoining || new Date().toLocaleDateString('en-IN'),
            bloodGroup: bloodGroup || '', address: address || '', avatar,
            education: education || [], certifications: certifications || [],
            skills: skills || [], languages: languages || [], emergencyContact: emergencyContact || '',
            mustChangePassword: true  // Force password change on first login
        });

        // Create welcome notification (non-blocking - don't fail if this errors)
        try {
            await Notification.create({
                user: newUser._id,
                title: 'Welcome to SMG Portal!',
                message: `Welcome ${name}! Your account has been created. Employee ID: ${empId}`,
                type: 'success', category: 'System'
            });
        } catch (notifErr) {
            console.warn('Welcome notification failed (non-critical):', notifErr.message);
        }

        // Build email HTML
        const emailHtml = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #0B4DA2; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">SMG Ltd</h1>
                    <p style="color: #93C5FD; margin: 5px 0 0 0; font-size: 14px;">Employee Management Portal</p>
                </div>
                <div style="padding: 40px 30px; background-color: #ffffff; color: #374151;">
                    <h2 style="color: #1F2937; margin-top: 0; font-size: 20px;">Welcome to the Team, ${name}!</h2>
                    <p style="font-size: 16px; line-height: 1.5; color: #4B5563;">
                        Your official employee account has been successfully created.
                    </p>
                    <div style="background-color: #F4F7FE; border-left: 4px solid #0B4DA2; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                        <h3 style="margin-top: 0; color: #0B4DA2; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Your Login Credentials</h3>
                        <p style="margin: 0 0 12px 0; font-size: 15px;"><strong>Employee ID:</strong> ${empId}</p>
                        <p style="margin: 0 0 12px 0; font-size: 15px;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 0; font-size: 15px;"><strong>Temporary Password:</strong> <code style="background: #E0E7FF; color: #3730A3; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${rawPassword}</code></p>
                    </div>
                    <p style="font-size: 14px; color: #EF4444; background-color: #FEF2F2; padding: 12px; border-radius: 6px; border: 1px solid #FEE2E2;">
                        <strong>Security Notice:</strong> Please change this temporary password immediately after logging in.
                    </p>
                </div>
                <div style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0; color: #6B7280; font-size: 12px;">&copy; ${new Date().getFullYear()} SMG Ltd. All rights reserved.</p>
                </div>
            </div>
        `;

        // Send Email with Credentials (non-blocking)
        let emailResult = { success: false, url: null, error: 'Email not sent' };
        try {
            emailResult = await sendEmail(email, 'Welcome to SMG - Your Account Credentials', emailHtml);
        } catch (emailErr) {
            console.warn('Welcome email failed (non-critical):', emailErr.message);
        }


        const userObj = newUser.toObject();
        delete userObj.password;
        res.status(201).json({
            ...userObj,
            generatedPassword: rawPassword,
            emailPreviewUrl: emailResult.url,
            message: emailResult.success 
                ? `Employee created successfully. Email sent to ${email}.`
                : `Employee created successfully. Temporary password: ${rawPassword}`
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── CHANGE PASSWORD ──
router.put('/users/:id/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // If currentPassword provided, validate it (for self-change)
        if (currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        // Clear the mustChangePassword flag once user has set their own password
        user.mustChangePassword = false;
        await user.save();

        // Notify user (non-blocking - don't fail password change if notification errors)
        try {
            await Notification.create({
                user: user._id,
                title: 'Password Changed',
                message: 'Your password has been changed successfully. If you did not make this change, contact your administrator immediately.',
                type: 'warning', category: 'System'
            });
        } catch (notifErr) {
            console.warn('Password change notification failed (non-critical):', notifErr.message);
        }

        res.json({ message: 'Password changed successfully' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});


// ════════════════════════════════════════
//  DASHBOARD AGGREGATE
// ════════════════════════════════════════
router.get('/dashboard/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const [leaveBalance, pendingLeaves, pendingGP, payroll, trainings, notifications, announcements] = await Promise.all([
            LeaveBalance.findOne({ user: userId, year: new Date().getFullYear() }),
            Leave.countDocuments({ user: userId, status: 'Pending' }),
            GatePass.countDocuments({ user: userId, status: 'Pending' }),
            Payroll.find({ user: userId }).sort({ year: -1 }).limit(1),
            Training.countDocuments({ enrolledUsers: userId }),
            Notification.countDocuments({ user: userId, read: false }),
            Announcement.find({ isActive: true }).sort({ createdAt: -1 }).limit(3).populate('postedBy', 'name')
        ]);
        res.json({
            leaveBalance: leaveBalance ? (leaveBalance.casual.total - leaveBalance.casual.used + leaveBalance.sick.total - leaveBalance.sick.used + leaveBalance.earned.total - leaveBalance.earned.used) : 0,
            pendingRequests: pendingLeaves + pendingGP,
            trainingEnrolled: trainings,
            unreadNotifications: notifications,
            latestPayslip: payroll[0] || null,
            recentAnnouncements: announcements
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  ATTENDANCE
// ════════════════════════════════════════
router.get('/attendance/:userId', async (req, res) => {
    try { res.json(await Attendance.find({ user: req.params.userId }).sort({ date: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/attendance', async (req, res) => {
    try { res.status(201).json(await Attendance.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/attendance-all', async (_req, res) => {
    try { res.json(await Attendance.find().populate('user', 'name empId dept').sort({ date: -1 }).limit(200)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  LEAVES
// ════════════════════════════════════════
router.get('/leaves/:userId', async (req, res) => {
    try { res.json(await Leave.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/leaves', async (req, res) => {
    try { res.status(201).json(await Leave.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/leaves/:id', async (req, res) => {
    try {
        const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (req.body.status && leave.user) {
            await Notification.create({
                user: leave.user,
                title: 'Leave Status Updated',
                message: `Your leave request has been ${req.body.status}.`,
                type: req.body.status === 'Approved' ? 'success' : 'warning',
                category: 'Leave'
            });
        }
        res.json(leave);
    }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/leave-balance/:userId', async (req, res) => {
    try { res.json(await LeaveBalance.findOne({ user: req.params.userId, year: new Date().getFullYear() })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/leaves-all', async (_req, res) => {
    try { res.json(await Leave.find().populate('user', 'name empId dept').sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  GATE PASS
// ════════════════════════════════════════
router.get('/gatepasses/:userId', async (req, res) => {
    try { res.json(await GatePass.find({ user: req.params.userId }).sort({ date: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/gatepasses', async (req, res) => {
    try {
        if (!req.body.passId) {
            const count = await GatePass.countDocuments();
            req.body.passId = `GP-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
        }
        const gp = await GatePass.create(req.body);
        await Notification.create({
            user: gp.user,
            title: 'Gate Pass Submitted',
            message: `Your gate pass request (${gp.passId}) has been submitted and is pending approval.`,
            type: 'info',
            category: 'Gate Pass'
        });
        res.status(201).json(gp);
    }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/gatepasses/:id', async (req, res) => {
    try {
        const gatePass = await GatePass.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (req.body.status && gatePass.user) {
            await Notification.create({
                user: gatePass.user,
                title: `Gate Pass ${req.body.status}`,
                message: `Your gate pass request (${gatePass.passId}) has been ${req.body.status.toLowerCase()}.`,
                type: req.body.status === 'Approved' ? 'success' : 'warning',
                category: 'Gate Pass'
            });
        }
        res.json(gatePass);
    }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  PAYROLL
// ════════════════════════════════════════
router.get('/payroll/:userId', async (req, res) => {
    try { res.json(await Payroll.find({ user: req.params.userId }).sort({ year: -1, month: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/payroll-all', async (_req, res) => {
    try { res.json(await Payroll.find().populate('user', 'name empId dept').sort({ year: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/payroll', async (req, res) => {
    try {
        const payroll = await Payroll.create(req.body);
        // User requested: "if somenone saliry is creadit that notification too"
        if (req.body.user) {
            await Notification.create({
                user: req.body.user,
                title: 'Salary Credited',
                message: `Your salary for ${req.body.month} ${req.body.year} has been credited! Net Amount: ₹${req.body.netSalary.toLocaleString('en-IN')}`,
                type: 'success',
                category: 'Finance'
            });
        }
        res.status(201).json(payroll);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  TRAINING
// ════════════════════════════════════════
router.get('/trainings', async (_req, res) => {
    try { res.json(await Training.find().populate('enrolledUsers completedUsers', 'name empId')); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/trainings', async (req, res) => {
    try { res.status(201).json(await Training.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/trainings/:id/enroll', async (req, res) => {
    try { res.json(await Training.findByIdAndUpdate(req.params.id, { $addToSet: { enrolledUsers: req.body.userId } }, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  DOCUMENTS
// ════════════════════════════════════════
router.get('/documents/:userId', async (req, res) => {
    try { res.json(await Document.find({ user: req.params.userId }).sort({ uploadedAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/documents', async (req, res) => {
    try { res.status(201).json(await Document.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  PROJECTS
// ════════════════════════════════════════
router.get('/projects', async (_req, res) => {
    try { res.json(await Project.find().populate('manager teamMembers', 'name empId dept avatar')); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/projects', async (req, res) => {
    try { res.status(201).json(await Project.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/projects/:id', async (req, res) => {
    try { res.json(await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  ANNOUNCEMENTS
// ════════════════════════════════════════
router.get('/announcements', async (_req, res) => {
    try { res.json(await Announcement.find({ isActive: true }).populate('postedBy', 'name').sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/announcements', async (req, res) => {
    try { res.status(201).json(await Announcement.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  NOTIFICATIONS
// ════════════════════════════════════════
router.get('/notifications/:userId', async (req, res) => {
    try { res.json(await Notification.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/notifications/:id/read', async (req, res) => {
    try { res.json(await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  DEPARTMENTS
// ════════════════════════════════════════
router.get('/departments', async (_req, res) => {
    try { res.json(await Department.find().populate('head', 'name empId')); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/departments', async (req, res) => {
    try { res.status(201).json(await Department.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  CANTEEN
// ════════════════════════════════════════
router.get('/canteen/menu', async (_req, res) => {
    try { res.json(await CanteenMenu.find({ isAvailable: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/canteen/orders/:userId', async (req, res) => {
    try { res.json(await CanteenOrder.find({ user: req.params.userId }).sort({ date: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/canteen/orders', async (req, res) => {
    try { res.status(201).json(await CanteenOrder.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/canteen/orders/:id', async (req, res) => {
    try {
        const order = await CanteenOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (req.body.status && order.user) {
            await Notification.create({
                user: order.user,
                title: 'Canteen Order Updated',
                message: `Your canteen order has been ${req.body.status}.`,
                type: 'info',
                category: 'Canteen'
            });
        }
        res.json(order);
    }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  GUEST HOUSE
// ════════════════════════════════════════
router.get('/guesthouse/:userId', async (req, res) => {
    try { res.json(await GuestHouse.find({ user: req.params.userId }).sort({ checkInDate: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/guesthouse', async (req, res) => {
    try { res.status(201).json(await GuestHouse.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/guesthouse/:id', async (req, res) => {
    try {
        const request = await GuestHouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (req.body.status && request.user) {
            await Notification.create({
                user: request.user,
                title: 'Guest House Booking Updated',
                message: `Your guest house request has been ${req.body.status}.`,
                type: req.body.status === 'Approved' ? 'success' : 'warning',
                category: 'Guest House'
            });
        }
        res.json(request);
    }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  TRANSPORT
// ════════════════════════════════════════
router.get('/transport/:userId', async (req, res) => {
    try { res.json(await Transport.find({ user: req.params.userId }).sort({ date: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/transport', async (req, res) => {
    try { res.status(201).json(await Transport.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/transport/:id', async (req, res) => {
    try {
        const request = await Transport.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (req.body.status && request.user) {
            await Notification.create({
                user: request.user,
                title: 'Transport Request Updated',
                message: `Your transport request has been ${req.body.status}.`,
                type: req.body.status === 'Approved' ? 'success' : 'warning',
                category: 'Transport'
            });
        }
        res.json(request);
    }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  UNIFORM REQUESTS
// ════════════════════════════════════════
router.get('/uniforms', async (req, res) => {
    try {
        res.json(await UniformRequest.find().populate('user').sort({ createdAt: -1 }));
    }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/uniforms/:userId', async (req, res) => {
    try { res.json(await UniformRequest.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/uniforms', async (req, res) => {
    try {
        const body = { ...req.body };
        if (!body.requestId) {
            const randomNum = Math.floor(100000 + Math.random() * 900000);
            body.requestId = `UR-2026-${randomNum}`;
        }
        res.status(201).json(await UniformRequest.create(body));
    }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/uniforms/:id', async (req, res) => {
    try {
        const request = await UniformRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (req.body.status && request.user) {
            await Notification.create({
                user: request.user,
                title: 'Uniform Request Updated',
                message: `Your uniform request has been ${req.body.status}.`,
                type: req.body.status === 'Approved' ? 'success' : 'warning',
                category: 'Uniform'
            });
        }
        res.json(request);
    }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  SIM REQUESTS
// ════════════════════════════════════════
router.get('/sim/:userId', async (req, res) => {
    try { res.json(await SIMRequest.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/sim', async (req, res) => {
    try { res.status(201).json(await SIMRequest.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/sim/:id', async (req, res) => {
    try {
        const request = await SIMRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (req.body.status && request.user) {
            await Notification.create({
                user: request.user,
                title: 'SIM Request Updated',
                message: `Your SIM request has been ${req.body.status}.`,
                type: req.body.status === 'Approved' ? 'success' : 'warning',
                category: 'SIM'
            });
        }
        res.json(request);
    }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  ASSETS
// ════════════════════════════════════════
router.get('/assets/:userId', async (req, res) => {
    try { res.json(await Asset.find({ user: req.params.userId })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/asset-requests/:userId', async (req, res) => {
    try { res.json(await AssetRequest.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/asset-requests', async (req, res) => {
    try { res.status(201).json(await AssetRequest.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/asset-requests/:id', async (req, res) => {
    try {
        const request = await AssetRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (req.body.status && request.user) {
            await Notification.create({
                user: request.user,
                title: 'Asset Request Updated',
                message: `Your asset request for ${request.assetType || 'asset'} has been ${req.body.status}.`,
                type: req.body.status === 'Approved' ? 'success' : 'warning',
                category: 'Assets'
            });
        }
        res.json(request);
    }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  MEETINGS
// ════════════════════════════════════════
router.get('/meetings/:userId', async (req, res) => {
    try { res.json(await Meeting.find({ participants: req.params.userId }).populate('organizer', 'name').sort({ date: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  POLICIES
// ════════════════════════════════════════
router.get('/policies', async (_req, res) => {
    try { res.json(await Policy.find({ isActive: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  IDEAS (SMG IMAGINE)
// ════════════════════════════════════════
router.get('/ideas', async (_req, res) => {
    try { res.json(await Idea.find().populate('user', 'name dept').sort({ votes: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/ideas', async (req, res) => {
    try { res.status(201).json(await Idea.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  GENERAL REQUESTS
// ════════════════════════════════════════
router.get('/general-requests/:userId', async (req, res) => {
    try { res.json(await GeneralRequest.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/general-requests', async (req, res) => {
    try { res.status(201).json(await GeneralRequest.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/profile-update-request', async (req, res) => {
    try {
        const { userId, fields } = req.body;
        if (!userId || !fields || Object.keys(fields).length === 0) {
            return res.status(400).json({ message: 'User ID and changes are required' });
        }

        const requesterUser = await User.findById(userId);
        const actualRole = requesterUser ? requesterUser.role : 'employee';

        // Generate unique reqId sequentially
        const year = new Date().getFullYear();
        const requestCount = await Request.countDocuments();
        const seqNum = String(requestCount + 1).padStart(4, '0');
        const reqId = `REQ-PR-${year}-${seqNum}`;

        // Construct description
        const descParts = [];
        for (const [key, value] of Object.entries(fields)) {
            descParts.push(`${key.replace(/([A-Z])/g, ' $1')}: ${value}`);
        }
        const description = `Profile update requested for: ${descParts.join(', ')}`;

        const fieldLabels = {
            name: 'Name',
            email: 'Email',
            phone: 'Mobile',
            dateOfBirth: 'Date of Birth',
            bloodGroup: 'Blood Group',
            address: 'Address',
            emergencyContact: 'Emergency Contact'
        };

        const changedFieldsList = Object.keys(fields).map(key => fieldLabels[key] || key.replace(/([A-Z])/g, ' $1'));
        const requestType = `Profile Update (${changedFieldsList.join(', ')})`;

        const newRequest = await Request.create({
            user: userId,
            reqId,
            type: requestType,
            description,
            fields,
            status: 'Pending',
            requesterRole: actualRole
        });

        // Trigger notification
        try {
            await Notification.create({
                user: userId,
                title: 'Profile Update Requested',
                message: actualRole === 'admin'
                    ? 'Your profile update request has been submitted to Super Admin for approval.'
                    : 'Your request to update profile details has been submitted for approval.',
                type: 'info',
                category: 'System'
            });
        } catch (notifErr) {
            console.error('Failed to create notification for profile request:', notifErr);
        }

        res.status(201).json(newRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all admin profile update requests (for SuperAdmin approval)
router.get('/admin-profile-requests', async (_req, res) => {
    try {
        const requests = await Request.find({
            type: { $regex: /^Profile Update/i },
            requesterRole: 'admin'
        }).populate('user', 'name empId dept role email').sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ════════════════════════════════════════
//  REQUESTS (LEGACY/DASHBOARD)
// ════════════════════════════════════════
router.get('/requests/:userId', async (req, res) => {
    try { res.json(await Request.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/requests-all', async (_req, res) => {
    try { res.json(await Request.find().populate('user', 'name empId dept').sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/requests/:id', async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (req.body.status && request.user) {
            if (req.body.status === 'Approved' && request.type && /^Profile Update/i.test(request.type) && request.fields) {
                await User.findByIdAndUpdate(request.user, request.fields, { new: true, runValidators: true });
            }
            await Notification.create({
                user: request.user,
                title: 'Request Status Updated',
                message: `Your ${request.type || 'request'} has been ${req.body.status}.`,
                type: req.body.status === 'Approved' ? 'success' : 'warning',
                category: 'Request'
            });
        }
        res.json(request);
    }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  DASHBOARD STATS (aggregated)
// ════════════════════════════════════════
router.get('/dashboard/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const [user, leaveBalance, pendingRequests, notifications, recentRequests, meetings, attendance] = await Promise.all([
            User.findById(userId).select('-password'),
            LeaveBalance.findOne({ user: userId, year: new Date().getFullYear() }),
            Request.countDocuments({ user: userId, status: 'Pending' }),
            Notification.find({ user: userId, isRead: false }).sort({ createdAt: -1 }).limit(5),
            Request.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
            Meeting.find({ participants: userId }).populate('organizer', 'name').sort({ date: -1 }).limit(5),
            Attendance.find({ user: userId }).sort({ date: -1 }).limit(7)
        ]);
        res.json({ user, leaveBalance, pendingRequests, notifications, recentRequests, meetings, attendance });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  ADMIN AGGREGATES
// ════════════════════════════════════════
router.get('/admin/dashboard', async (_req, res) => {
    try {
        const totalEmployees = await User.countDocuments();
        const activeEmployees = await User.countDocuments({ status: { $ne: 'Inactive' } });
        const onLeave = await Leave.countDocuments({ status: 'Approved', from: { $lte: new Date() }, to: { $gte: new Date() } });
        const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
        const pendingGatePasses = await GatePass.countDocuments({ status: 'Pending' });
        const completedTraining = await Training.countDocuments({ date: { $lte: new Date() } });

        // Real data: monthly payroll aggregate
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const payrollAgg = await Payroll.aggregate([
            { $match: { year: currentYear } },
            { $group: { _id: null, total: { $sum: '$netSalary' } } }
        ]);
        const monthlyPayroll = payrollAgg.length > 0 ? `₹${(payrollAgg[0].total).toLocaleString('en-IN')}` : '₹0';

        // Real data: active projects & department count
        const activeProjects = await Project.countDocuments({ status: { $nin: ['Completed', 'Cancelled'] } });
        const departmentCount = await Department.countDocuments();

        // Real data: recent requests from DB
        const recentReqs = await Request.find().populate('user', 'name empId dept').sort({ createdAt: -1 }).limit(10);
        const recentRequests = recentReqs.map(r => ({
            id: r._id, displayId: r.reqId, employee: r.user?.name || 'Unknown', empId: r.user?.empId, type: r.type,
            date: r.createdAt, status: r.status, priority: r.priority || 'Medium'
        }));

        // Real data: department stats from DB
        const departments = await Department.find().populate('head', 'name empId');
        const deptColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500', 'bg-red-500'];
        const departmentStats = await Promise.all(departments.slice(0, 6).map(async (dept, i) => {
            const empCount = await User.countDocuments({ dept: dept.name });
            return { name: dept.name, employees: empCount, attendance: 95 + Math.floor(Math.random() * 5), budget: dept.budget || '₹0', color: deptColors[i % deptColors.length] };
        }));

        // System Health Stats
        const mongoose = require('mongoose');
        const dbStatus = mongoose.connection.readyState === 1;
        const emailConfigured = !!process.env.SMTP_USER;
        const systemHealth = {
            database: dbStatus ? 'Connected' : 'Disconnected',
            emailService: emailConfigured ? 'Active' : 'Not Configured',
            apiStatus: 'Healthy',
            lastBackup: new Date().toISOString()
        };

        res.json({
            stats: {
                totalEmployees, activeEmployees, onLeave,
                pendingRequests: pendingLeaves + pendingGatePasses,
                monthlyPayroll, completedTraining, activeProjects, departmentCount
            },
            recentRequests,
            departmentStats,
            systemHealth
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/admin/requests', async (_req, res) => {
    try {
        // Migration: Update requests missing or having empty/null requesterRole
        const unmigratedRequests = await Request.find({ 
            $or: [
                { requesterRole: { $exists: false } },
                { requesterRole: null },
                { requesterRole: '' }
            ]
        });
        for (const reqObj of unmigratedRequests) {
            const userObj = await User.findById(reqObj.user);
            if (userObj) {
                reqObj.requesterRole = userObj.role || 'employee';
                await reqObj.save();
            }
        }

        const leaves = await Leave.find().populate('user', 'name empId dept');
        const gatePasses = await GatePass.find().populate('user', 'name empId dept');
        // Exclude profile update requests submitted by admin/superadmin - those go to SuperAdmin approval
        const generalRequests = await Request.find({ 
            requesterRole: { $nin: ['admin', 'superadmin'] }
        }).populate('user', 'name empId dept');
        
        const requests = [
            ...leaves.map(l => ({
                id: l._id,
                displayId: `REQ-LV-${new Date(l.createdAt || Date.now()).getFullYear()}-${l._id.toString().slice(-4).toUpperCase()}`,
                employee: l.user?.name,
                empId: l.user?.empId,
                department: l.user?.dept,
                type: 'Leave Request',
                category: 'Leave',
                reason: l.reason,
                fromDate: l.from,
                toDate: l.to,
                days: l.days,
                submittedOn: l.createdAt,
                status: l.status,
                priority: 'Medium'
            })),
            ...gatePasses.map(g => ({
                id: g._id,
                displayId: g.passId,
                employee: g.user?.name,
                empId: g.user?.empId,
                department: g.user?.dept,
                type: 'Gate Pass',
                category: 'Gate Pass',
                reason: g.reason,
                fromDate: g.date,
                toDate: g.date,
                time: g.outTime,
                submittedOn: g.createdAt || g.date,
                status: g.status,
                priority: 'High'
            })),
            ...generalRequests.map(r => ({
                id: r._id,
                displayId: r.reqId,
                employee: r.user?.name || 'Unknown',
                empId: r.user?.empId || 'N/A',
                department: r.user?.dept || 'N/A',
                type: r.type,
                category: 'General',
                reason: r.description,
                submittedOn: r.createdAt,
                status: r.status,
                priority: (r.type && r.type.startsWith('Profile Update')) ? 'Medium' : 'Low',
                fields: r.fields
            }))
        ].sort((a, b) => new Date(b.submittedOn) - new Date(a.submittedOn));
        
        res.json(requests);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  PDF DOWNLOADS
// ════════════════════════════════════════
router.get('/pdf/payslip/:payrollId', async (req, res) => {
    try {
        const payroll = await Payroll.findById(req.params.payrollId);
        if (!payroll) return res.status(404).json({ message: 'Payroll not found' });
        const user = await User.findById(payroll.user);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=Payslip_${payroll.month.replace(/\s/g,'_')}.pdf`);
        generatePayslipPDF(payroll, user).pipe(res);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/pdf/gatepass/:id', async (req, res) => {
    try {
        const gatePass = await GatePass.findById(req.params.id);
        if (!gatePass) return res.status(404).json({ message: 'Gate Pass not found' });
        const user = await User.findById(gatePass.user);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=GatePass_${gatePass.passId}.pdf`);
        generateGatePassPDF(gatePass, user).pipe(res);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/pdf/leave/:id', async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: 'Leave not found' });
        const user = await User.findById(leave.user);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=Leave_Application_${leave._id}.pdf`);
        generateLeavePDF(leave, user).pipe(res);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/pdf/letter/:userId/:type', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const type = req.params.type; // 'experience' or 'offer'
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=${type === 'experience' ? 'Experience_Certificate' : 'Offer_Letter'}_${user.empId}.pdf`);
        generateLetterPDF(type, user).pipe(res);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/pdf/miss-slip/:id', async (req, res) => {
    try {
        const slip = await AttendanceMissSlip.findById(req.params.id);
        if (!slip) return res.status(404).json({ message: 'Miss Slip not found' });
        const user = await User.findById(slip.user);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=MissSlip_${slip.slipId}.pdf`);
        generateMissSlipPDF(slip, user).pipe(res);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/pdf/travel/:id', async (req, res) => {
    try {
        const travel = await TravelRequest.findById(req.params.id);
        if (!travel) return res.status(404).json({ message: 'Travel Request not found' });
        const user = await User.findById(travel.user);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=Travel_${travel.requestId}.pdf`);
        generateTravelPDF(travel, user).pipe(res);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/pdf/canteen/:id', async (req, res) => {
    try {
        const order = await CanteenOrder.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        const user = await User.findById(order.user);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=Canteen_Bill_${order._id}.pdf`);
        generateCanteenOrderPDF(order, user).pipe(res);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/pdf/uniform/:id', async (req, res) => {
    try {
        const request = await UniformRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        const user = await User.findById(request.user);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=Uniform_Request_${request.requestId}.pdf`);
        generateUniformPDF(request, user).pipe(res);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  ATTENDANCE MISS SLIPS
// ════════════════════════════════════════
router.get('/miss-slips/:userId', async (req, res) => {
    try { res.json(await AttendanceMissSlip.find({ user: req.params.userId }).sort({ date: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/miss-slips', async (req, res) => {
    try { res.status(201).json(await AttendanceMissSlip.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/miss-slips-all', async (_req, res) => {
    try { res.json(await AttendanceMissSlip.find().populate('user', 'name empId dept').sort({ date: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  RESIGNATIONS
// ════════════════════════════════════════
router.get('/resignations/:userId', async (req, res) => {
    try { res.json(await Resignation.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/resignations', async (req, res) => {
    try { res.status(201).json(await Resignation.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/resignations/:id', async (req, res) => {
    try { res.json(await Resignation.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/resignations-all', async (_req, res) => {
    try { res.json(await Resignation.find().populate('user', 'name empId dept').sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  TRAVEL REQUESTS
// ════════════════════════════════════════
router.get('/travel/:userId', async (req, res) => {
    try { res.json(await TravelRequest.find({ user: req.params.userId }).sort({ departureDate: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/travel', async (req, res) => {
    try { res.status(201).json(await TravelRequest.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/travel/:id', async (req, res) => {
    try { res.json(await TravelRequest.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  MRF (MANPOWER REQUISITION)
// ════════════════════════════════════════
router.get('/mrf', async (_req, res) => {
    try { res.json(await MRF.find().populate('requestedBy', 'name empId dept').sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/mrf', async (req, res) => {
    try { res.status(201).json(await MRF.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/mrf/:id', async (req, res) => {
    try { res.json(await MRF.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  INTERVIEWS
// ════════════════════════════════════════
router.get('/interviews', async (_req, res) => {
    try { res.json(await Interview.find().populate('mrf').sort({ interviewDate: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/interviews', async (req, res) => {
    try { res.status(201).json(await Interview.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/interviews/:id', async (req, res) => {
    try { res.json(await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  JOB DESCRIPTIONS
// ════════════════════════════════════════
router.get('/job-descriptions', async (_req, res) => {
    try { res.json(await JobDescription.find({ isActive: true }).populate('createdBy', 'name')); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/job-descriptions', async (req, res) => {
    try { res.status(201).json(await JobDescription.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  KEY REPRESENTATIVES
// ════════════════════════════════════════
router.get('/key-reps', async (_req, res) => {
    try { res.json(await KeyRepresentative.find({ isActive: true }).populate('user', 'name empId avatar phone')); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/key-reps', async (req, res) => {
    try { res.status(201).json(await KeyRepresentative.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  WELFARE PROGRAMS
// ════════════════════════════════════════
router.get('/welfare', async (_req, res) => {
    try { res.json(await WelfareProgram.find({ isActive: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/welfare', async (req, res) => {
    try { res.status(201).json(await WelfareProgram.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/welfare/:id/enroll', async (req, res) => {
    try { res.json(await WelfareProgram.findByIdAndUpdate(req.params.id, { $addToSet: { enrolledUsers: req.body.userId } }, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  AUTO-NOTIFICATION HELPER
// ════════════════════════════════════════
async function createNotification(userId, title, message, type = 'info') {
    try {
        await Notification.create({ user: userId, title, message, type, isRead: false });
    } catch (err) { console.error('Notification create error:', err.message); }
}

// ════════════════════════════════════════
//  GLOBAL NOTIFICATIONS BROADCASTER
// ════════════════════════════════════════
router.post('/notifications/global', async (req, res) => {
    try {
        const { module, message, type = 'info' } = req.body;
        const users = await User.find({ isActive: true });
        
        const notifications = users.map(u => ({
            user: u._id,
            title: `Update from ${module}`,
            message: message,
            type: type,
            category: 'System'
        }));
        
        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }
        res.status(201).json({ success: true, count: notifications.length });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  DEPARTMENT DATA STORE (replaces localStorage)
// ════════════════════════════════════════
router.get('/dept-store/:key', async (req, res) => {
    try {
        const record = await DepartmentData.findOne({ storeKey: req.params.key });
        res.json(record ? record.items : []);
    } catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/dept-store/:key', async (req, res) => {
    try {
        const oldRecord = await DepartmentData.findOne({ storeKey: req.params.key });
        const oldLength = oldRecord && oldRecord.items ? oldRecord.items.length : 0;
        
        const record = await DepartmentData.findOneAndUpdate(
            { storeKey: req.params.key },
            { items: req.body.items, department: req.body.department, lastUpdatedBy: req.body.updatedBy },
            { new: true, upsert: true }
        );

        // Global Notifications Trigger for new items (e.g., Events, Announcements)
        if (record.items && record.items.length > oldLength) {
            const moduleName = req.params.key.split(':')[1] || 'department';
            const displayModule = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
            
            // Generate notifications for all active users
            const users = await User.find({ isActive: true });
            
            // For production with thousands of users, consider using bulkWrite
            const notifications = users.map(u => ({
                user: u._id,
                title: `New update in ${displayModule}`,
                message: `A new entry was added to the ${displayModule} portal. Check it out!`,
                type: 'info',
                category: 'System'
            }));
            
            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
            }

            // Send HR email notification if a new interview candidate is registered or visitor candidate checked in
            const newItems = record.items.slice(oldLength);
            if (req.params.key === 'reception:interviewCandidates') {
                for (const item of newItems) {
                    const emailHtml = `
                        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
                            <div style="background:linear-gradient(135deg,#0B4DA2,#042A5B);padding:24px;color:white;text-align:center">
                                <h1 style="margin:0;font-size:24px">📋 New Interview Candidate Registered</h1>
                            </div>
                            <div style="padding:24px">
                                <p>Dear HR Team,</p>
                                <p>A new interview candidate has been registered at the Reception Desk:</p>
                                <table style="width:100%;border-collapse:collapse;margin:16px 0">
                                    <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Candidate Name</td><td style="padding:8px;border:1px solid #e5e7eb">${item.candidateName || 'N/A'}</td></tr>
                                    <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Position Applied</td><td style="padding:8px;border:1px solid #e5e7eb">${item.position || 'N/A'}</td></tr>
                                    <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Department</td><td style="padding:8px;border:1px solid #e5e7eb">${item.department || 'N/A'}</td></tr>
                                    <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Interviewer</td><td style="padding:8px;border:1px solid #e5e7eb">${item.interviewerName || 'N/A'}</td></tr>
                                    <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Date & Time</td><td style="padding:8px;border:1px solid #e5e7eb">${item.interviewDate || 'N/A'} at ${item.interviewTime || 'N/A'}</td></tr>
                                    <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #e5e7eb">${item.phone || 'N/A'}</td></tr>
                                </table>
                                <p style="color:#6b7280;font-size:13px">Please prepare the necessary interview materials and coordinate accordingly.</p>
                            </div>
                            <div style="background:#f9fafb;padding:16px;text-align:center;color:#9ca3af;font-size:12px">SMG Employee Management Portal</div>
                        </div>
                    `;
                    try {
                        await sendEmail('tuskydv@gmail.com', `New Interview Candidate: ${item.candidateName || 'N/A'}`, emailHtml);
                    } catch (err) {
                        console.error('Failed to send interview candidate email to HR:', err);
                    }
                }
            } else if (req.params.key === 'reception:visitors') {
                for (const item of newItems) {
                    if (item.visitorType === 'candidate') {
                        const emailHtml = `
                            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
                                <div style="background:linear-gradient(135deg,#0B4DA2,#042A5B);padding:24px;color:white;text-align:center">
                                    <h1 style="margin:0;font-size:24px">🚶 Candidate Visitor Check-In</h1>
                                </div>
                                <div style="padding:24px">
                                    <p>Dear HR Team,</p>
                                    <p>A visitor of type <strong>candidate</strong> has checked in at the Reception Desk:</p>
                                    <table style="width:100%;border-collapse:collapse;margin:16px 0">
                                        <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Visitor Name</td><td style="padding:8px;border:1px solid #e5e7eb">${item.name || 'N/A'}</td></tr>
                                        <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Company/Source</td><td style="padding:8px;border:1px solid #e5e7eb">${item.company || 'N/A'}</td></tr>
                                        <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Person to Visit</td><td style="padding:8px;border:1px solid #e5e7eb">${item.visitingPerson || 'N/A'} (${item.department || 'N/A'})</td></tr>
                                        <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Purpose</td><td style="padding:8px;border:1px solid #e5e7eb">${item.purpose || 'N/A'}</td></tr>
                                        <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Check-In Time</td><td style="padding:8px;border:1px solid #e5e7eb">${item.checkInTime || 'N/A'} on ${item.date || 'N/A'}</td></tr>
                                    </table>
                                </div>
                                <div style="background:#f9fafb;padding:16px;text-align:center;color:#9ca3af;font-size:12px">SMG Employee Management Portal</div>
                            </div>
                        `;
                        try {
                            await sendEmail('tuskydv@gmail.com', `Candidate Checked-In: ${item.name || 'N/A'}`, emailHtml);
                        } catch (err) {
                            console.error('Failed to send visitor candidate check-in email to HR:', err);
                        }
                    }
                }
            }
        }

        res.json(record.items);
    } catch (err) { res.status(500).json({ message: err.message }); }
});
router.delete('/dept-store/:key', async (req, res) => {
    try {
        await DepartmentData.deleteOne({ storeKey: req.params.key });
        res.json({ message: 'Store cleared' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  CROSS-PORTAL STATS (for Super Admin)
// ════════════════════════════════════════
router.get('/cross-portal/stats', async (_req, res) => {
    try {
        const [
            totalUsers, activeUsers, pendingLeaves, pendingGP,
            totalTrainings, totalDepts, totalProjects,
            totalAnnouncements, totalResignations, pendingMRFs
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isActive: true }),
            Leave.countDocuments({ status: 'Pending' }),
            GatePass.countDocuments({ status: 'Pending' }),
            Training.countDocuments(),
            Department.countDocuments(),
            Project.countDocuments(),
            Announcement.countDocuments({ isActive: true }),
            Resignation.countDocuments({ status: 'Pending' }),
            MRF.countDocuments({ status: 'Open' })
        ]);
        res.json({
            totalUsers, activeUsers, pendingLeaves, pendingGP,
            totalTrainings, totalDepts, totalProjects,
            totalAnnouncements, totalResignations, pendingMRFs
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  NOTIFICATION-CREATING WRAPPERS
//  (Override leave/gatepass/request POST to auto-notify)
// ════════════════════════════════════════
const originalLeavesPost = router.stack.find(r => r.route?.path === '/leaves' && r.route?.methods?.post);
// Wrap leaves POST to create notification
router.post('/leaves/apply', async (req, res) => {
    try {
        const leave = await Leave.create(req.body);
        // Notify the employee
        await createNotification(req.body.user, 'Leave Applied', `Your ${req.body.leaveType || 'leave'} request has been submitted and is pending approval.`, 'info');
        res.status(201).json(leave);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/leaves/:id/approve', async (req, res) => {
    try {
        const leave = await Leave.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true });
        if (leave) {
            await createNotification(leave.user, 'Leave Approved', `Your leave request has been approved.`, 'success');
        }
        res.json(leave);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/leaves/:id/reject', async (req, res) => {
    try {
        const leave = await Leave.findByIdAndUpdate(req.params.id, { status: 'Rejected', rejectionReason: req.body.reason }, { new: true });
        if (leave) {
            await createNotification(leave.user, 'Leave Rejected', `Your leave request was rejected. Reason: ${req.body.reason || 'Not specified'}`, 'warning');
        }
        res.json(leave);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/gatepasses/apply', async (req, res) => {
    try {
        if (!req.body.passId) {
            const count = await GatePass.countDocuments();
            req.body.passId = `GP-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
        }
        const gp = await GatePass.create(req.body);
        await createNotification(req.body.user, 'Gate Pass Submitted', `Your gate pass (${gp.passId}) has been submitted and is pending approval.`, 'info');
        res.status(201).json(gp);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/gatepasses/:id/approve', async (req, res) => {
    try {
        const gp = await GatePass.findByIdAndUpdate(req.params.id, { status: 'Approved', approver: req.body.approver || 'Admin' }, { new: true });
        if (gp) {
            await createNotification(gp.user, 'Gate Pass Approved', `Your gate pass (${gp.passId}) has been approved. You may proceed.`, 'success');
            // Send email notification if SMTP is configured
            try {
                const user = await User.findById(gp.user);
                if (user && user.email) {
                    await sendEmail(
                        user.email,
                        `Gate Pass Approved - ${gp.passId}`,
                        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
                            <div style="background:linear-gradient(135deg,#042A5B,#0B4DA2);padding:24px;color:white;text-align:center">
                                <h1 style="margin:0;font-size:24px">✅ Gate Pass Approved</h1>
                            </div>
                            <div style="padding:24px">
                                <p>Dear <strong>${user.name}</strong>,</p>
                                <p>Your gate pass request has been <strong style="color:#16a34a">approved</strong>.</p>
                                <table style="width:100%;border-collapse:collapse;margin:16px 0">
                                    <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Pass ID</td><td style="padding:8px;border:1px solid #e5e7eb">${gp.passId}</td></tr>
                                    <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Type</td><td style="padding:8px;border:1px solid #e5e7eb">${gp.type}</td></tr>
                                    <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Date</td><td style="padding:8px;border:1px solid #e5e7eb">${new Date(gp.date).toLocaleDateString('en-IN')}</td></tr>
                                    <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Exit Time</td><td style="padding:8px;border:1px solid #e5e7eb">${gp.outTime}</td></tr>
                                    <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Return Time</td><td style="padding:8px;border:1px solid #e5e7eb">${gp.inTime || 'N/A'}</td></tr>
                                </table>
                                <p style="color:#6b7280;font-size:13px">Please carry this approval confirmation. Have a safe journey.</p>
                            </div>
                            <div style="background:#f9fafb;padding:16px;text-align:center;color:#9ca3af;font-size:12px">SMG Employee Management Portal</div>
                        </div>`
                    );
                }
            } catch (emailErr) { console.error('Gate pass email error:', emailErr.message); }
        }
        res.json(gp);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/gatepasses/:id/reject', async (req, res) => {
    try {
        const gp = await GatePass.findByIdAndUpdate(req.params.id, { status: 'Rejected' }, { new: true });
        if (gp) await createNotification(gp.user, 'Gate Pass Rejected', `Your gate pass (${gp.passId}) has been rejected. Reason: ${req.body.reason || 'Not specified'}`, 'warning');
        res.json(gp);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/requests/:id/approve', async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true });
        if (request) {
            if (request.type && /^Profile Update/i.test(request.type) && request.fields) {
                await User.findByIdAndUpdate(request.user, request.fields, { new: true, runValidators: true });
            }
            await createNotification(request.user, 'Request Approved', `Your ${request.type || 'request'} has been approved.`, 'success');
        }
        res.json(request);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/requests/:id/reject', async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(req.params.id, { status: 'Rejected', reason: req.body.reason }, { new: true });
        if (request) await createNotification(request.user, 'Request Rejected', `Your ${request.type || 'request'} was rejected.`, 'warning');
        res.json(request);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  SYSTEM HEALTH & SYNC STATUS
// ════════════════════════════════════════
router.get('/system/health', async (_req, res) => {
    try {
        const dbStatus = require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected';
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: dbStatus,
            uptime: process.uptime(),
            version: '2.0.0'
        });
    } catch (err) { res.status(500).json({ status: 'unhealthy', message: err.message }); }
});

// ════════════════════════════════════════
//  GATE PASS — CANCEL & STATISTICS
// ════════════════════════════════════════
router.put('/gatepasses/:id/cancel', async (req, res) => {
    try {
        const gp = await GatePass.findById(req.params.id);
        if (!gp) return res.status(404).json({ message: 'Gate Pass not found' });
        if (gp.status !== 'Pending') return res.status(400).json({ message: 'Only pending gate passes can be cancelled' });
        gp.status = 'Rejected';
        await gp.save();
        await createNotification(gp.user, 'Gate Pass Cancelled', `Your gate pass (${gp.passId}) has been cancelled by you.`, 'info');
        res.json(gp);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/gatepasses/:userId/stats', async (req, res) => {
    try {
        const userId = req.params.userId;
        const [total, approved, pending, rejected, completed] = await Promise.all([
            GatePass.countDocuments({ user: userId }),
            GatePass.countDocuments({ user: userId, status: 'Approved' }),
            GatePass.countDocuments({ user: userId, status: 'Pending' }),
            GatePass.countDocuments({ user: userId, status: 'Rejected' }),
            GatePass.countDocuments({ user: userId, status: 'Completed' })
        ]);
        const recent = await GatePass.find({ user: userId }).sort({ createdAt: -1 }).limit(1);
        res.json({ total, approved, pending, rejected, completed, lastPassDate: recent[0]?.createdAt || null });
    } catch (err) { res.status(500).json({ message: err.message }); }
});
// ── EMPLOYEE PROFILE PDF EXPORT ──
router.get('/user/:id/export-profile', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="SMG_Profile_${user.empId || user._id}.pdf"`);

        const pdfDoc = generateEmployeeProfilePDF(user.toObject());
        pdfDoc.pipe(res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
