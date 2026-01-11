const express = require('express');
const reviewModel = require('../models/review.model');

const router = express.Router();

// GET /api/reviews - Get all reviews
router.get('/', async (req, res) => {
    try {
        const { status, featured } = req.query;
        const filters = { status };
        if (featured !== undefined) {
            filters.featured = featured === 'true';
        }
        const reviews = await reviewModel.getAllReviews(filters);
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});

// GET /api/reviews/public - Get approved reviews (public endpoint)
router.get('/public', async (req, res) => {
    try {
        const reviews = await reviewModel.getApprovedReviews();
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching approved reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});

// GET /api/reviews/stats - Get review statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await reviewModel.getReviewStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching review stats:', error);
        res.status(500).json({ message: 'Failed to fetch review stats' });
    }
});

// GET /api/reviews/:id - Get single review
router.get('/:id', async (req, res) => {
    try {
        const review = await reviewModel.getReviewById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        console.error('Error fetching review:', error);
        res.status(500).json({ message: 'Failed to fetch review' });
    }
});

// POST /api/reviews - Create new review
router.post('/', async (req, res) => {
    try {
        const review = await reviewModel.createReview(req.body);
        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(400).json({ message: error.message || 'Failed to create review' });
    }
});

// PUT /api/reviews/:id - Update review
router.put('/:id', async (req, res) => {
    try {
        const review = await reviewModel.updateReview(req.params.id, req.body);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(400).json({ message: error.message || 'Failed to update review' });
    }
});

// PATCH /api/reviews/:id/approve - Approve review
router.patch('/:id/approve', async (req, res) => {
    try {
        const review = await reviewModel.approveReview(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        console.error('Error approving review:', error);
        res.status(500).json({ message: 'Failed to approve review' });
    }
});

// PATCH /api/reviews/:id/reject - Reject review
router.patch('/:id/reject', async (req, res) => {
    try {
        const review = await reviewModel.rejectReview(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        console.error('Error rejecting review:', error);
        res.status(500).json({ message: 'Failed to reject review' });
    }
});

// PATCH /api/reviews/:id/featured - Toggle featured status
router.patch('/:id/featured', async (req, res) => {
    try {
        const review = await reviewModel.toggleFeatured(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        console.error('Error toggling featured status:', error);
        res.status(500).json({ message: 'Failed to toggle featured status' });
    }
});

// PATCH /api/reviews/approve-all - Approve all pending reviews
router.patch('/approve-all', async (req, res) => {
    try {
        const result = await reviewModel.approveAllPending();
        res.json({ message: `${result.modifiedCount} reviews approved` });
    } catch (error) {
        console.error('Error approving all reviews:', error);
        res.status(500).json({ message: 'Failed to approve reviews' });
    }
});

// DELETE /api/reviews/:id - Delete review
router.delete('/:id', async (req, res) => {
    try {
        const review = await reviewModel.deleteReview(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Failed to delete review' });
    }
});

module.exports = router;
