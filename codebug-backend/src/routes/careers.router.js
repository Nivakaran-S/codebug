const express = require('express');
const router = express.Router();
const positionModel = require('../models/jobPosition.model');

// GET /api/careers - Get all positions (admin)
router.get('/', async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            department: req.query.department,
            type: req.query.type,
            search: req.query.search
        };

        const positions = await positionModel.getAllPositions(filters);
        res.json(positions);
    } catch (error) {
        console.error('Error fetching positions:', error);
        res.status(500).json({ message: 'Failed to fetch positions' });
    }
});

// GET /api/careers/open - Get open positions (public)
router.get('/open', async (req, res) => {
    try {
        const positions = await positionModel.getOpenPositions();
        res.json(positions);
    } catch (error) {
        console.error('Error fetching open positions:', error);
        res.status(500).json({ message: 'Failed to fetch positions' });
    }
});

// GET /api/careers/department/:department - Get positions by department (public)
router.get('/department/:department', async (req, res) => {
    try {
        const positions = await positionModel.getPositionsByDepartment(req.params.department);
        res.json(positions);
    } catch (error) {
        console.error('Error fetching positions by department:', error);
        res.status(500).json({ message: 'Failed to fetch positions' });
    }
});

// GET /api/careers/stats - Get position statistics (admin)
router.get('/stats', async (req, res) => {
    try {
        const stats = await positionModel.getPositionStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching position stats:', error);
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
});

// GET /api/careers/:id - Get position by ID
router.get('/:id', async (req, res) => {
    try {
        const position = await positionModel.getPositionById(req.params.id);
        if (!position) {
            return res.status(404).json({ message: 'Position not found' });
        }
        res.json(position);
    } catch (error) {
        console.error('Error fetching position:', error);
        res.status(500).json({ message: 'Failed to fetch position' });
    }
});

// POST /api/careers - Create new position (admin only)
router.post('/', async (req, res) => {
    try {
        const position = await positionModel.createPosition(req.body);
        res.status(201).json(position);
    } catch (error) {
        console.error('Error creating position:', error);
        res.status(400).json({ message: error.message || 'Failed to create position' });
    }
});

// POST /api/careers/:id/apply - Record application (public)
router.post('/:id/apply', async (req, res) => {
    try {
        const position = await positionModel.incrementApplicationCount(req.params.id);
        if (!position) {
            return res.status(404).json({ message: 'Position not found' });
        }
        res.json({ message: 'Application recorded successfully', position });
    } catch (error) {
        console.error('Error recording application:', error);
        res.status(500).json({ message: 'Failed to record application' });
    }
});

// PUT /api/careers/:id - Update position (admin only)
router.put('/:id', async (req, res) => {
    try {
        const position = await positionModel.updatePosition(req.params.id, req.body);
        if (!position) {
            return res.status(404).json({ message: 'Position not found' });
        }
        res.json(position);
    } catch (error) {
        console.error('Error updating position:', error);
        res.status(400).json({ message: error.message || 'Failed to update position' });
    }
});

// PATCH /api/careers/:id/status - Update position status (admin only)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const position = await positionModel.updatePositionStatus(req.params.id, status);
        if (!position) {
            return res.status(404).json({ message: 'Position not found' });
        }
        res.json(position);
    } catch (error) {
        console.error('Error updating position status:', error);
        res.status(400).json({ message: 'Failed to update status' });
    }
});

// PATCH /api/careers/:id/urgent - Toggle urgent status (admin only)
router.patch('/:id/urgent', async (req, res) => {
    try {
        const position = await positionModel.toggleUrgent(req.params.id);
        if (!position) {
            return res.status(404).json({ message: 'Position not found' });
        }
        res.json(position);
    } catch (error) {
        console.error('Error toggling urgent:', error);
        res.status(400).json({ message: 'Failed to toggle urgent' });
    }
});

// DELETE /api/careers/:id - Delete position (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const position = await positionModel.deletePosition(req.params.id);
        if (!position) {
            return res.status(404).json({ message: 'Position not found' });
        }
        res.json({ message: 'Position deleted successfully' });
    } catch (error) {
        console.error('Error deleting position:', error);
        res.status(500).json({ message: 'Failed to delete position' });
    }
});

module.exports = router;
