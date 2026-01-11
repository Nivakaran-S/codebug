const express = require('express');
const router = express.Router();
const articleModel = require('../models/article.model');

// GET /api/articles - Get all articles (admin)
router.get('/', async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            category: req.query.category,
            featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
            search: req.query.search
        };

        const articles = await articleModel.getAllArticles(filters);
        res.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ message: 'Failed to fetch articles' });
    }
});

// GET /api/articles/public - Get published articles (public)
router.get('/public', async (req, res) => {
    try {
        const articles = await articleModel.getPublicArticles();
        res.json(articles);
    } catch (error) {
        console.error('Error fetching public articles:', error);
        res.status(500).json({ message: 'Failed to fetch articles' });
    }
});

// GET /api/articles/featured - Get featured articles (public)
router.get('/featured', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const articles = await articleModel.getFeaturedArticles(limit);
        res.json(articles);
    } catch (error) {
        console.error('Error fetching featured articles:', error);
        res.status(500).json({ message: 'Failed to fetch featured articles' });
    }
});

// GET /api/articles/category/:category - Get articles by category (public)
router.get('/category/:category', async (req, res) => {
    try {
        const articles = await articleModel.getArticlesByCategory(req.params.category);
        res.json(articles);
    } catch (error) {
        console.error('Error fetching articles by category:', error);
        res.status(500).json({ message: 'Failed to fetch articles' });
    }
});

// GET /api/articles/stats - Get article statistics (admin)
router.get('/stats', async (req, res) => {
    try {
        const stats = await articleModel.getArticleStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching article stats:', error);
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
});

// GET /api/articles/slug/:slug - Get article by slug (public)
router.get('/slug/:slug', async (req, res) => {
    try {
        const article = await articleModel.getArticleBySlug(req.params.slug);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ message: 'Failed to fetch article' });
    }
});

// GET /api/articles/:id - Get article by ID
router.get('/:id', async (req, res) => {
    try {
        const article = await articleModel.getArticleById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ message: 'Failed to fetch article' });
    }
});

// POST /api/articles - Create new article (admin only)
router.post('/', async (req, res) => {
    try {
        const article = await articleModel.createArticle(req.body);
        res.status(201).json(article);
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(400).json({ message: error.message || 'Failed to create article' });
    }
});

// PUT /api/articles/:id - Update article (admin only)
router.put('/:id', async (req, res) => {
    try {
        const article = await articleModel.updateArticle(req.params.id, req.body);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(400).json({ message: error.message || 'Failed to update article' });
    }
});

// PATCH /api/articles/:id/status - Update article status (admin only)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const article = await articleModel.updateArticleStatus(req.params.id, status);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        console.error('Error updating article status:', error);
        res.status(400).json({ message: 'Failed to update status' });
    }
});

// PATCH /api/articles/:id/featured - Toggle featured status (admin only)
router.patch('/:id/featured', async (req, res) => {
    try {
        const article = await articleModel.toggleFeatured(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        console.error('Error toggling featured:', error);
        res.status(400).json({ message: 'Failed to toggle featured' });
    }
});

// DELETE /api/articles/:id - Delete article (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const article = await articleModel.deleteArticle(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({ message: 'Failed to delete article' });
    }
});

module.exports = router;
