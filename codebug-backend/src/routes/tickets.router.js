const express = require('express');
const ticketModel = require('../models/ticket.model');

const router = express.Router();

// GET /api/tickets - Get all tickets (role-based)
router.get('/', async (req, res) => {
    try {
        const { status, priority, category, search } = req.query;
        const filters = { status, priority, category, search };

        // If client, only show their tickets
        if (req.userRole === 'client') {
            filters.client = req.userId;
        }

        const tickets = await ticketModel.getAllTickets(filters);
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Failed to fetch tickets' });
    }
});

// GET /api/tickets/stats - Get ticket statistics
router.get('/stats', async (req, res) => {
    try {
        const clientId = req.userRole === 'client' ? req.userId : null;
        const stats = await ticketModel.getTicketStats(clientId);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching ticket stats:', error);
        res.status(500).json({ message: 'Failed to fetch ticket stats' });
    }
});

// GET /api/tickets/:id - Get single ticket
router.get('/:id', async (req, res) => {
    try {
        const ticket = await ticketModel.getTicketById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Clients can only view their own tickets
        if (req.userRole === 'client' && ticket.client._id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(ticket);
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ message: 'Failed to fetch ticket' });
    }
});

// POST /api/tickets - Create new ticket
router.post('/', async (req, res) => {
    try {
        const ticketData = {
            ...req.body,
            client: req.userRole === 'client' ? req.userId : req.body.client
        };

        // Add initial message if provided
        if (req.body.message) {
            ticketData.messages = [{
                sender: req.userRole,
                senderId: req.userId,
                senderName: req.userName || 'User',
                message: req.body.message
            }];
        }

        const ticket = await ticketModel.createTicket(ticketData);
        res.status(201).json(ticket);
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(400).json({ message: error.message || 'Failed to create ticket' });
    }
});

// POST /api/tickets/:id/messages - Add message to ticket
router.post('/:id/messages', async (req, res) => {
    try {
        const ticket = await ticketModel.getTicketById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Check access
        if (req.userRole === 'client' && ticket.client._id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const messageData = {
            sender: req.userRole,
            senderId: req.userId,
            senderName: req.userName || 'User',
            message: req.body.message,
            attachments: req.body.attachments || []
        };

        const updatedTicket = await ticketModel.addMessage(req.params.id, messageData);
        res.json(updatedTicket);
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ message: 'Failed to add message' });
    }
});

// PATCH /api/tickets/:id/status - Update ticket status
router.patch('/:id/status', async (req, res) => {
    try {
        // Only admins can change status (except clients can close their own)
        const ticket = await ticketModel.getTicketById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        if (req.userRole === 'client') {
            if (ticket.client._id.toString() !== req.userId) {
                return res.status(403).json({ message: 'Access denied' });
            }
            if (req.body.status !== 'closed') {
                return res.status(403).json({ message: 'Clients can only close tickets' });
            }
        }

        const updatedTicket = await ticketModel.updateTicketStatus(req.params.id, req.body.status);
        res.json(updatedTicket);
    } catch (error) {
        console.error('Error updating ticket status:', error);
        res.status(500).json({ message: 'Failed to update ticket status' });
    }
});

// PATCH /api/tickets/:id/assign - Assign ticket to admin (Admin only)
router.patch('/:id/assign', async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Only admins can assign tickets' });
        }

        const ticket = await ticketModel.assignTicket(req.params.id, req.body.adminId || req.adminId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (error) {
        console.error('Error assigning ticket:', error);
        res.status(500).json({ message: 'Failed to assign ticket' });
    }
});

// DELETE /api/tickets/:id - Delete ticket (Admin only)
router.delete('/:id', async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Only admins can delete tickets' });
        }

        const ticket = await ticketModel.deleteTicket(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ message: 'Failed to delete ticket' });
    }
});

module.exports = router;
