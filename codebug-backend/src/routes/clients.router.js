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
