const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Routers
const adminRouter = require('./routes/admin.router');
const projectsRouter = require('./routes/projects.router');
const messagesRouter = require('./routes/messages.router');
const caseStudiesRouter = require('./routes/caseStudies.router');
const reviewsRouter = require('./routes/reviews.router');
const clientsRouter = require('./routes/clients.router');
const ordersRouter = require('./routes/orders.router');
const ticketsRouter = require('./routes/tickets.router');
const articlesRouter = require('./routes/articles.router');
const careersRouter = require('./routes/careers.router');

// Middleware
const { authMiddleware, adminOnly } = require('./middleware/auth.middleware');

const app = express();

// CORS Configuration
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://codebug.lk',
            'https://www.codebug.lk',
            'https://codebug.nivakaran.dev',
            'https://nivakaran.dev',
            'https://codebug-8u99.vercel.app',
            // Allow all Vercel preview deployments
            /https:\/\/codebug.*\.vercel\.app$/,
        ],
        credentials: true,
    })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(express.json());
app.use(cookieParser());

// ============ PUBLIC ROUTES ============

// Auth endpoints
app.use('/api/admin', adminRouter);

// Contact form submission (public)
app.post('/api/messages/contact', async (req, res) => {
    try {
        const messageModel = require('./models/message.model');
        // Map frontend field names to backend field names
        const { name, email, subject, message, company, phone } = req.body;
        const messageData = {
            senderName: name,
            senderEmail: email,
            subject: subject || 'Contact Form Submission',
            message: message,
            company: company,
            phone: phone
        };
        const createdMessage = await messageModel.createMessage(messageData);
        res.status(201).json({ message: 'Message sent successfully', data: createdMessage });
    } catch (error) {
        console.error('Error sending contact message:', error);
        res.status(400).json({ message: error.message || 'Failed to send message' });
    }
});

// Public projects (portfolio)
app.get('/api/projects/public', async (req, res) => {
    try {
        const projectModel = require('./models/project.model');
        const projects = await projectModel.getPublishedProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch projects' });
    }
});

// Public case studies and reviews
app.get('/api/case-studies/public', async (req, res) => {
    try {
        const caseStudyModel = require('./models/caseStudy.model');
        const caseStudies = await caseStudyModel.getPublishedCaseStudies();
        res.json(caseStudies);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch case studies' });
    }
});

app.get('/api/reviews/public', async (req, res) => {
    try {
        const reviewModel = require('./models/review.model');
        const reviews = await reviewModel.getApprovedReviews();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});

// Public articles (blog/insights)
app.get('/api/articles/public', async (req, res) => {
    try {
        const articleModel = require('./models/article.model');
        const articles = await articleModel.getPublicArticles();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch articles' });
    }
});

app.get('/api/articles/featured', async (req, res) => {
    try {
        const articleModel = require('./models/article.model');
        const articles = await articleModel.getFeaturedArticles(parseInt(req.query.limit) || 3);
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch featured articles' });
    }
});

app.get('/api/articles/slug/:slug', async (req, res) => {
    try {
        const articleModel = require('./models/article.model');
        const article = await articleModel.getArticleBySlug(req.params.slug);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch article' });
    }
});

// Public job positions (careers)
app.get('/api/careers/open', async (req, res) => {
    try {
        const positionModel = require('./models/jobPosition.model');
        const positions = await positionModel.getOpenPositions();
        res.json(positions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch positions' });
    }
});

app.get('/api/careers/department/:department', async (req, res) => {
    try {
        const positionModel = require('./models/jobPosition.model');
        const positions = await positionModel.getPositionsByDepartment(req.params.department);
        res.json(positions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch positions' });
    }
});

app.post('/api/careers/:id/apply', async (req, res) => {
    try {
        const positionModel = require('./models/jobPosition.model');
        const position = await positionModel.incrementApplicationCount(req.params.id);
        if (!position) {
            return res.status(404).json({ message: 'Position not found' });
        }
        res.json({ message: 'Application recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to record application' });
    }
});

// ============ AUTHENTICATED ROUTES ============

// Routes for both admin and client (role-based internally)
app.use('/api/orders', authMiddleware, ordersRouter);
app.use('/api/tickets', authMiddleware, ticketsRouter);

// Admin-only routes
app.use('/api/projects', authMiddleware, adminOnly, projectsRouter);
app.use('/api/messages', authMiddleware, adminOnly, messagesRouter);
app.use('/api/case-studies', authMiddleware, adminOnly, caseStudiesRouter);
app.use('/api/reviews', authMiddleware, adminOnly, reviewsRouter);
app.use('/api/clients', authMiddleware, clientsRouter); // Both admin and clients (routes handle permissions)
app.use('/api/articles', authMiddleware, adminOnly, articlesRouter);
app.use('/api/careers', authMiddleware, adminOnly, careersRouter);

// ============ AUTH UTILITIES ============

// Check auth status
app.get('/check-cookie', (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name
        });
    } catch (err) {
        console.error('Error verifying token:', err.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
});

// Logout
app.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
    });
    res.json({ message: 'Logged out successfully!' });
});

// ============ ROOT & ERROR HANDLERS ============

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Codebug API!',
        version: '2.0',
        endpoints: {
            auth: '/api/admin',
            projects: '/api/projects',
            messages: '/api/messages',
            caseStudies: '/api/case-studies',
            reviews: '/api/reviews',
            clients: '/api/clients',
            orders: '/api/orders',
            tickets: '/api/tickets'
        }
    });
});

// 404 handler
app.use((req, res) => {
    console.warn(`404 Error: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err.stack || err.message);
    res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
