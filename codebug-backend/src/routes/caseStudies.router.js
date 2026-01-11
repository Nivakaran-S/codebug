const express = require('express');
const caseStudyModel = require('../models/caseStudy.model');

const router = express.Router();

// GET /api/case-studies - Get all case studies
router.get('/', async (req, res) => {
    try {
        const { status, featured } = req.query;
        const filters = { status };
        if (featured !== undefined) {
            filters.featured = featured === 'true';
        }
        const caseStudies = await caseStudyModel.getAllCaseStudies(filters);
        res.json(caseStudies);
    } catch (error) {
        console.error('Error fetching case studies:', error);
        res.status(500).json({ message: 'Failed to fetch case studies' });
    }
});

// GET /api/case-studies/public - Get published case studies (public endpoint)
router.get('/public', async (req, res) => {
    try {
        const caseStudies = await caseStudyModel.getPublishedCaseStudies();
        res.json(caseStudies);
    } catch (error) {
        console.error('Error fetching published case studies:', error);
        res.status(500).json({ message: 'Failed to fetch case studies' });
    }
});

// GET /api/case-studies/stats - Get case study statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await caseStudyModel.getCaseStudyStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching case study stats:', error);
        res.status(500).json({ message: 'Failed to fetch case study stats' });
    }
});

// GET /api/case-studies/:id - Get single case study
router.get('/:id', async (req, res) => {
    try {
        const caseStudy = await caseStudyModel.getCaseStudyById(req.params.id);
        if (!caseStudy) {
            return res.status(404).json({ message: 'Case study not found' });
        }
        res.json(caseStudy);
    } catch (error) {
        console.error('Error fetching case study:', error);
        res.status(500).json({ message: 'Failed to fetch case study' });
    }
});

// POST /api/case-studies - Create new case study
router.post('/', async (req, res) => {
    try {
        const caseStudy = await caseStudyModel.createCaseStudy(req.body);
        res.status(201).json(caseStudy);
    } catch (error) {
        console.error('Error creating case study:', error);
        res.status(400).json({ message: error.message || 'Failed to create case study' });
    }
});

// PUT /api/case-studies/:id - Update case study
router.put('/:id', async (req, res) => {
    try {
        const caseStudy = await caseStudyModel.updateCaseStudy(req.params.id, req.body);
        if (!caseStudy) {
            return res.status(404).json({ message: 'Case study not found' });
        }
        res.json(caseStudy);
    } catch (error) {
        console.error('Error updating case study:', error);
        res.status(400).json({ message: error.message || 'Failed to update case study' });
    }
});

// PATCH /api/case-studies/:id/featured - Toggle featured status
router.patch('/:id/featured', async (req, res) => {
    try {
        const caseStudy = await caseStudyModel.toggleFeatured(req.params.id);
        if (!caseStudy) {
            return res.status(404).json({ message: 'Case study not found' });
        }
        res.json(caseStudy);
    } catch (error) {
        console.error('Error toggling featured status:', error);
        res.status(500).json({ message: 'Failed to toggle featured status' });
    }
});

// PATCH /api/case-studies/:id/status - Update case study status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const caseStudy = await caseStudyModel.updateCaseStudy(req.params.id, { status });
        if (!caseStudy) {
            return res.status(404).json({ message: 'Case study not found' });
        }
        res.json(caseStudy);
    } catch (error) {
        console.error('Error updating case study status:', error);
        res.status(400).json({ message: error.message || 'Failed to update case study status' });
    }
});

// DELETE /api/case-studies/:id - Delete case study
router.delete('/:id', async (req, res) => {
    try {
        const caseStudy = await caseStudyModel.deleteCaseStudy(req.params.id);
        if (!caseStudy) {
            return res.status(404).json({ message: 'Case study not found' });
        }
        res.json({ message: 'Case study deleted successfully' });
    } catch (error) {
        console.error('Error deleting case study:', error);
        res.status(500).json({ message: 'Failed to delete case study' });
    }
});

module.exports = router;
