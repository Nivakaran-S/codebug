const express = require('express');
const projectModel = require('../models/project.model');

const router = express.Router();

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
    try {
        const { category, status, search } = req.query;
        const projects = await projectModel.getAllProjects({ category, status, search });
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Failed to fetch projects' });
    }
});

// GET /api/projects/stats - Get project statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await projectModel.getProjectStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching project stats:', error);
        res.status(500).json({ message: 'Failed to fetch project stats' });
    }
});

// GET /api/projects/:id - Get single project
router.get('/:id', async (req, res) => {
    try {
        const project = await projectModel.getProjectById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Failed to fetch project' });
    }
});

// POST /api/projects - Create new project
router.post('/', async (req, res) => {
    try {
        const project = await projectModel.createProject(req.body);
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(400).json({ message: error.message || 'Failed to create project' });
    }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res) => {
    try {
        const project = await projectModel.updateProject(req.params.id, req.body);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(400).json({ message: error.message || 'Failed to update project' });
    }
});

// PATCH /api/projects/:id/status - Update project status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const project = await projectModel.updateProject(req.params.id, { status });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        console.error('Error updating project status:', error);
        res.status(400).json({ message: error.message || 'Failed to update project status' });
    }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
    try {
        const project = await projectModel.deleteProject(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Failed to delete project' });
    }
});

module.exports = router;
