const express = require('express');
const messageModel = require('../models/message.model');

const router = express.Router();

// GET /api/messages - Get all messages
router.get('/', async (req, res) => {
    try {
        const { status, search } = req.query;
        const messages = await messageModel.getAllMessages({ status, search });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
});

// GET /api/messages/stats - Get message statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await messageModel.getMessageStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching message stats:', error);
        res.status(500).json({ message: 'Failed to fetch message stats' });
    }
});

// GET /api/messages/:id - Get single message
router.get('/:id', async (req, res) => {
    try {
        const message = await messageModel.getMessageById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.json(message);
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ message: 'Failed to fetch message' });
    }
});

// POST /api/messages - Create new message (from contact form)
router.post('/', async (req, res) => {
    try {
        const message = await messageModel.createMessage(req.body);
        res.status(201).json(message);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(400).json({ message: error.message || 'Failed to send message' });
    }
});

// PATCH /api/messages/:id/read - Mark message as read
router.patch('/:id/read', async (req, res) => {
    try {
        const message = await messageModel.markAsRead(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.json(message);
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ message: 'Failed to mark message as read' });
    }
});

// POST /api/messages/:id/reply - Reply to message
router.post('/:id/reply', async (req, res) => {
    try {
        const { replyMessage } = req.body;
        const message = await messageModel.replyToMessage(req.params.id, replyMessage);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.json(message);
    } catch (error) {
        console.error('Error replying to message:', error);
        res.status(500).json({ message: 'Failed to reply to message' });
    }
});

// PATCH /api/messages/:id/archive - Archive message
router.patch('/:id/archive', async (req, res) => {
    try {
        const message = await messageModel.archiveMessage(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.json(message);
    } catch (error) {
        console.error('Error archiving message:', error);
        res.status(500).json({ message: 'Failed to archive message' });
    }
});

// PUT /api/messages/:id - Update message
router.put('/:id', async (req, res) => {
    try {
        const message = await messageModel.updateMessage(req.params.id, req.body);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.json(message);
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(400).json({ message: error.message || 'Failed to update message' });
    }
});

// DELETE /api/messages/:id - Delete message
router.delete('/:id', async (req, res) => {
    try {
        const message = await messageModel.deleteMessage(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Failed to delete message' });
    }
});

module.exports = router;
