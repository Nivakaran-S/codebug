const express = require('express');
const clientModel = require('../models/client.model');

const router = express.Router();

// GET /api/clients - Get all clients (Admin only)
router.get('/', async (req, res) => {
    try {
        const { status, search } = req.query;
        const clients = await clientModel.getAllClients({ status, search });
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ message: 'Failed to fetch clients' });
    }
});

// GET /api/clients/stats - Get client statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await clientModel.getClientStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching client stats:', error);
        res.status(500).json({ message: 'Failed to fetch client stats' });
    }
});

// ============ CLIENT SELF-SERVICE ENDPOINTS ============
// NOTE: These must be before /:id route to avoid being caught by the dynamic route

// GET /api/clients/profile - Get current client profile
router.get('/profile', async (req, res) => {
    try {
        // Only clients can access their own profile
        if (req.userRole !== 'client') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const client = await clientModel.getClientById(req.userId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        console.error('Error fetching client profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

// PUT /api/clients/profile - Update current client profile
router.put('/profile', async (req, res) => {
    try {
        // Only clients can update their own profile
        if (req.userRole !== 'client') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { name, company, phone } = req.body;
        const client = await clientModel.updateClient(req.userId, { name, company, phone });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json({ message: 'Profile updated successfully', client });
    } catch (error) {
        console.error('Error updating client profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// POST /api/clients/change-password - Change client password
router.post('/change-password', async (req, res) => {
    try {
        if (req.userRole !== 'client') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        const result = await clientModel.changePassword(req.userId, currentPassword, newPassword);
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Failed to change password' });
    }
});

// GET /api/clients/:id - Get single client
router.get('/:id', async (req, res) => {
    try {
        const client = await clientModel.getClientById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ message: 'Failed to fetch client' });
    }
});

// POST /api/clients - Create new client (Admin only)
router.post('/', async (req, res) => {
    try {
        const { name, email, password, company, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        // Check if client already exists
        const existingClient = await clientModel.getClientByEmail(email);
        if (existingClient) {
            return res.status(400).json({ message: 'Client with this email already exists' });
        }

        const client = await clientModel.createClient(
            { name, email, password, company, phone },
            req.adminId // Created by this admin
        );

        res.status(201).json({
            message: 'Client created successfully',
            client
        });
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ message: 'Failed to create client' });
    }
});

// PUT /api/clients/:id - Update client
router.put('/:id', async (req, res) => {
    try {
        const client = await clientModel.updateClient(req.params.id, req.body);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(400).json({ message: error.message || 'Failed to update client' });
    }
});

// PATCH /api/clients/:id/deactivate - Deactivate client
router.patch('/:id/deactivate', async (req, res) => {
    try {
        const client = await clientModel.deactivateClient(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json({ message: 'Client deactivated', client });
    } catch (error) {
        console.error('Error deactivating client:', error);
        res.status(500).json({ message: 'Failed to deactivate client' });
    }
});

// PATCH /api/clients/:id/activate - Activate client
router.patch('/:id/activate', async (req, res) => {
    try {
        const client = await clientModel.updateClient(req.params.id, { status: 'active' });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json({ message: 'Client activated', client });
    } catch (error) {
        console.error('Error activating client:', error);
        res.status(500).json({ message: 'Failed to activate client' });
    }
});

module.exports = router;
