const jwt = require('jsonwebtoken');

// Universal auth middleware to verify JWT token (works for both admin and client)
const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Set user info from token
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        req.userRole = decoded.role; // 'admin' or 'client'
        req.userName = decoded.name;

        // For backwards compatibility
        if (decoded.role === 'admin') {
            req.adminId = decoded.id;
            req.adminEmail = decoded.email;
            req.adminRole = decoded.role;
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};

// Admin-only middleware (must be used after authMiddleware)
const adminOnly = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
    next();
};

// Client-only middleware (must be used after authMiddleware)
const clientOnly = (req, res, next) => {
    if (req.userRole !== 'client') {
        return res.status(403).json({ message: 'Forbidden: Client access required' });
    }
    next();
};

// Role-based access control middleware
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

module.exports = { authMiddleware, adminOnly, clientOnly, requireRole };
