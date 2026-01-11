const Order = require('./order.mongo');

// Get all orders (with optional client filter)
async function getAllOrders(filters = {}) {
    const query = {};

    if (filters.client) {
        query.client = filters.client;
    }
    if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
    }
    if (filters.category && filters.category !== 'all') {
        query.category = filters.category;
    }
    if (filters.priority && filters.priority !== 'all') {
        query.priority = filters.priority;
    }
    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: 'i' } },
            { description: { $regex: filters.search, $options: 'i' } }
        ];
    }

    return await Order.find(query).populate('client', 'name email company').sort({ createdAt: -1 });
}

// Get orders for a specific client
async function getClientOrders(clientId) {
    return await Order.find({ client: clientId }).sort({ createdAt: -1 });
}

// Get order by ID
async function getOrderById(id) {
    return await Order.findById(id).populate('client', 'name email company');
}

// Create new order
async function createOrder(orderData) {
    const order = new Order(orderData);
    return await order.save();
}

// Update order
async function updateOrder(id, updateData) {
    return await Order.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('client', 'name email company');
}

// Update order status
async function updateOrderStatus(id, status) {
    return await Order.findByIdAndUpdate(id, { status }, { new: true });
}

// Update order progress
async function updateOrderProgress(id, progress) {
    return await Order.findByIdAndUpdate(id, { progress }, { new: true });
}

// Add milestone
async function addMilestone(orderId, milestone) {
    return await Order.findByIdAndUpdate(
        orderId,
        { $push: { milestones: milestone } },
        { new: true }
    );
}

// Update milestone
async function updateMilestone(orderId, milestoneId, updateData) {
    return await Order.findOneAndUpdate(
        { _id: orderId, 'milestones._id': milestoneId },
        { $set: { 'milestones.$': { ...updateData, _id: milestoneId } } },
        { new: true }
    );
}

// Delete order
async function deleteOrder(id) {
    return await Order.findByIdAndDelete(id);
}

// Get order stats
async function getOrderStats(clientId = null) {
    const query = clientId ? { client: clientId } : {};

    const total = await Order.countDocuments(query);
    const pending = await Order.countDocuments({ ...query, status: 'pending' });
    const inProgress = await Order.countDocuments({ ...query, status: 'in-progress' });
    const review = await Order.countDocuments({ ...query, status: 'review' });
    const completed = await Order.countDocuments({ ...query, status: 'completed' });

    return { total, pending, inProgress, review, completed };
}

module.exports = {
    getAllOrders,
    getClientOrders,
    getOrderById,
    createOrder,
    updateOrder,
    updateOrderStatus,
    updateOrderProgress,
    addMilestone,
    updateMilestone,
    deleteOrder,
    getOrderStats
};
