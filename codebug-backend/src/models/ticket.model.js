const Ticket = require('./ticket.mongo');

// Get all tickets (with optional client filter)
async function getAllTickets(filters = {}) {
    const query = {};

    if (filters.client) {
        query.client = filters.client;
    }
    if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
    }
    if (filters.priority && filters.priority !== 'all') {
        query.priority = filters.priority;
    }
    if (filters.category && filters.category !== 'all') {
        query.category = filters.category;
    }
    if (filters.search) {
        query.$or = [
            { subject: { $regex: filters.search, $options: 'i' } },
            { description: { $regex: filters.search, $options: 'i' } },
            { ticketNumber: { $regex: filters.search, $options: 'i' } }
        ];
    }

    return await Ticket.find(query)
        .populate('client', 'name email company')
        .populate('order', 'title')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
}

// Get tickets for a specific client
async function getClientTickets(clientId) {
    return await Ticket.find({ client: clientId })
        .populate('order', 'title')
        .sort({ createdAt: -1 });
}

// Get ticket by ID
async function getTicketById(id) {
    return await Ticket.findById(id)
        .populate('client', 'name email company')
        .populate('order', 'title')
        .populate('assignedTo', 'name email');
}

// Create new ticket
async function createTicket(ticketData) {
    const ticket = new Ticket(ticketData);
    return await ticket.save();
}

// Update ticket
async function updateTicket(id, updateData) {
    return await Ticket.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
}

// Update ticket status
async function updateTicketStatus(id, status) {
    const updateData = { status };
    if (status === 'resolved') {
        updateData.resolvedAt = new Date();
    } else if (status === 'closed') {
        updateData.closedAt = new Date();
    }
    return await Ticket.findByIdAndUpdate(id, updateData, { new: true });
}

// Add message to ticket
async function addMessage(ticketId, messageData) {
    return await Ticket.findByIdAndUpdate(
        ticketId,
        {
            $push: { messages: messageData },
            $set: { status: messageData.sender === 'admin' ? 'in-progress' : 'open' }
        },
        { new: true }
    );
}

// Assign ticket to admin
async function assignTicket(ticketId, adminId) {
    return await Ticket.findByIdAndUpdate(
        ticketId,
        { assignedTo: adminId, status: 'in-progress' },
        { new: true }
    );
}

// Delete ticket
async function deleteTicket(id) {
    return await Ticket.findByIdAndDelete(id);
}

// Get ticket stats
async function getTicketStats(clientId = null) {
    const query = clientId ? { client: clientId } : {};

    const total = await Ticket.countDocuments(query);
    const open = await Ticket.countDocuments({ ...query, status: 'open' });
    const inProgress = await Ticket.countDocuments({ ...query, status: 'in-progress' });
    const resolved = await Ticket.countDocuments({ ...query, status: 'resolved' });
    const closed = await Ticket.countDocuments({ ...query, status: 'closed' });

    return { total, open, inProgress, resolved, closed };
}

module.exports = {
    getAllTickets,
    getClientTickets,
    getTicketById,
    createTicket,
    updateTicket,
    updateTicketStatus,
    addMessage,
    assignTicket,
    deleteTicket,
    getTicketStats
};
