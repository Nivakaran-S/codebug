const express = require('express');
const orderModel = require('../models/order.model');

const router = express.Router();

// GET /api/orders - Get all orders (role-based)
router.get('/', async (req, res) => {
    try {
        const { status, category, priority, search } = req.query;
        const filters = { status, category, priority, search };

        // If client, only show their orders
        if (req.userRole === 'client') {
            filters.client = req.userId;
        }

        const orders = await orderModel.getAllOrders(filters);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// GET /api/orders/stats - Get order statistics
router.get('/stats', async (req, res) => {
    try {
        const clientId = req.userRole === 'client' ? req.userId : null;
        const stats = await orderModel.getOrderStats(clientId);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching order stats:', error);
        res.status(500).json({ message: 'Failed to fetch order stats' });
    }
});

// GET /api/orders/:id - Get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await orderModel.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Clients can only view their own orders
        if (req.userRole === 'client' && order.client._id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Failed to fetch order' });
    }
});

// POST /api/orders - Create new order (Admin only)
router.post('/', async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Only admins can create orders' });
        }

        const order = await orderModel.createOrder(req.body);
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(400).json({ message: error.message || 'Failed to create order' });
    }
});

// PUT /api/orders/:id - Update order (Admin only)
router.put('/:id', async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Only admins can update orders' });
        }

        const order = await orderModel.updateOrder(req.params.id, req.body);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(400).json({ message: error.message || 'Failed to update order' });
    }
});

// PATCH /api/orders/:id/status - Update order status (Admin only)
router.patch('/:id/status', async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Only admins can update order status' });
        }

        const { status } = req.body;
        const order = await orderModel.updateOrderStatus(req.params.id, status);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update order status' });
    }
});

// PATCH /api/orders/:id/progress - Update order progress (Admin only)
router.patch('/:id/progress', async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Only admins can update progress' });
        }

        const { progress } = req.body;
        const order = await orderModel.updateOrderProgress(req.params.id, progress);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error updating order progress:', error);
        res.status(500).json({ message: 'Failed to update order progress' });
    }
});

// POST /api/orders/:id/milestones - Add milestone (Admin only)
router.post('/:id/milestones', async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Only admins can add milestones' });
        }

        const order = await orderModel.addMilestone(req.params.id, req.body);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error adding milestone:', error);
        res.status(500).json({ message: 'Failed to add milestone' });
    }
});

// PATCH /api/orders/:id/milestones/:milestoneId - Update milestone (Admin only)
router.patch('/:id/milestones/:milestoneId', async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Only admins can update milestones' });
        }

        const order = await orderModel.updateMilestone(req.params.id, req.params.milestoneId, req.body);
        if (!order) {
            return res.status(404).json({ message: 'Order or milestone not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error updating milestone:', error);
        res.status(500).json({ message: 'Failed to update milestone' });
    }
});

// DELETE /api/orders/:id - Delete order (Admin only)
router.delete('/:id', async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Only admins can delete orders' });
        }

        const order = await orderModel.deleteOrder(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Failed to delete order' });
    }
});

module.exports = router;
