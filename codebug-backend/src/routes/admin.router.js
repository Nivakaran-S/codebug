const express = require('express');
const adminModel = require('../models/admin.model');
const clientModel = require('../models/client.model');
const projectModel = require('../models/project.model');
const messageModel = require('../models/message.model');
const caseStudyModel = require('../models/caseStudy.model');
const reviewModel = require('../models/review.model');
const orderModel = require('../models/order.model');
const ticketModel = require('../models/ticket.model');
const { authMiddleware, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

// ============ PUBLIC AUTH ENDPOINTS ============

// POST /api/admin/unified-login - Unified login for both admin and client
router.post('/unified-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Try admin login first
        const adminResult = await adminModel.authenticateAdmin(email, password);
        if (adminResult.success) {
            res.cookie('token', adminResult.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.json({
                message: 'Login successful',
                user: { ...adminResult.admin, role: 'admin' },
                redirectTo: '/admin'
            });
        }

        // If not admin, try client login
        const clientResult = await clientModel.authenticateClient(email, password);
        if (clientResult.success) {
            res.cookie('token', clientResult.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.json({
                message: 'Login successful',
                user: { ...clientResult.client, role: 'client' },
                redirectTo: '/portal'
            });
        }

        // Neither admin nor client found
        return res.status(401).json({ message: 'Invalid email or password' });
    } catch (error) {
        console.error('Error during unified login:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

// POST /api/admin/login - Admin login (legacy, kept for backwards compatibility)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const result = await adminModel.authenticateAdmin(email, password);

        if (!result.success) {
            return res.status(401).json({ message: result.message });
        }

        // Set HTTP-only cookie with JWT
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: 'Login successful',
            user: { ...result.admin, role: 'admin' }
        });
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

// POST /api/admin/client-login - Client login (legacy, kept for backwards compatibility)
router.post('/client-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const result = await clientModel.authenticateClient(email, password);

        if (!result.success) {
            return res.status(401).json({ message: result.message });
        }

        // Set HTTP-only cookie with JWT
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: 'Login successful',
            user: { ...result.client, role: 'client' }
        });
    } catch (error) {
        console.error('Error during client login:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

// POST /api/admin/register - Register new admin (protected in production)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        // Check if admin already exists
        const existingAdmin = await adminModel.getAdminByEmail(email);
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        const admin = await adminModel.createAdmin({ name, email, password, role: role || 'admin' });

        res.status(201).json({
            message: 'Admin created successfully',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ message: 'Failed to register admin' });
    }
});

// ============ PROTECTED ADMIN ENDPOINTS ============

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', authMiddleware, adminOnly, async (req, res) => {
    try {
        const [projectStats, messageStats, caseStudyStats, reviewStats, clientStats, orderStats, ticketStats] = await Promise.all([
            projectModel.getProjectStats(),
            messageModel.getMessageStats(),
            caseStudyModel.getCaseStudyStats(),
            reviewModel.getReviewStats(),
            clientModel.getClientStats(),
            orderModel.getOrderStats(),
            ticketModel.getTicketStats()
        ]);

        res.json({
            projects: projectStats,
            messages: messageStats,
            caseStudies: caseStudyStats,
            reviews: reviewStats,
            clients: clientStats,
            orders: orderStats,
            tickets: ticketStats
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
    }
});

// POST /api/admin/register-admin - Register new admin (admin only)
router.post('/register-admin', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        const existingAdmin = await adminModel.getAdminByEmail(email);
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        const admin = await adminModel.createAdmin({ name, email, password, role: role || 'admin' });

        res.status(201).json({
            message: 'Admin registered successfully',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ message: 'Failed to register admin' });
    }
});

// POST /api/admin/register-client - Register new client (admin only)
router.post('/register-client', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { name, email, password, company, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        const existingClient = await clientModel.getClientByEmail(email);
        if (existingClient) {
            return res.status(400).json({ message: 'Client with this email already exists' });
        }

        const client = await clientModel.createClient(
            { name, email, password, company, phone },
            req.adminId
        );

        res.status(201).json({
            message: 'Client registered successfully',
            client
        });
    } catch (error) {
        console.error('Error registering client:', error);
        res.status(500).json({ message: 'Failed to register client' });
    }
});

// GET /api/admin/profile - Get current admin profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        if (req.userRole === 'admin') {
            const admin = await adminModel.getAdminById(req.userId);
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            res.json({ ...admin.toObject(), role: 'admin' });
        } else {
            const client = await clientModel.getClientById(req.userId);
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            res.json({ ...client.toObject(), role: 'client' });
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

// PUT /api/admin/profile - Update profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, company, phone } = req.body;
        let updated;

        if (req.userRole === 'admin') {
            updated = await adminModel.updateAdmin(req.userId, { name });
        } else {
            updated = await clientModel.updateClient(req.userId, { name, company, phone });
        }

        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updated);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// POST /api/admin/change-password - Change password
router.post('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required' });
        }

        let result;
        if (req.userRole === 'admin') {
            result = await adminModel.changePassword(req.userId, currentPassword, newPassword);
        } else {
            result = await clientModel.changePassword(req.userId, currentPassword, newPassword);
        }

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        res.json({ message: result.message });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Failed to change password' });
    }
});

module.exports = router;
