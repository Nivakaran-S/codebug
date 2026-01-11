const Message = require('./message.mongo');

// Get all messages
async function getAllMessages(filters = {}) {
    const query = {};

    if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
    }
    if (filters.search) {
        query.$or = [
            { senderName: { $regex: filters.search, $options: 'i' } },
            { subject: { $regex: filters.search, $options: 'i' } },
            { message: { $regex: filters.search, $options: 'i' } }
        ];
    }

    return await Message.find(query).sort({ createdAt: -1 });
}

// Get message by ID
async function getMessageById(id) {
    return await Message.findById(id);
}

// Create new message (from contact form)
async function createMessage(messageData) {
    const message = new Message(messageData);
    return await message.save();
}

// Update message status
async function updateMessage(id, updateData) {
    return await Message.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
}

// Mark as read
async function markAsRead(id) {
    return await Message.findByIdAndUpdate(id, { status: 'read' }, { new: true });
}

// Reply to message
async function replyToMessage(id, replyMessage) {
    return await Message.findByIdAndUpdate(id, {
        status: 'replied',
        repliedAt: new Date(),
        replyMessage
    }, { new: true });
}

// Archive message
async function archiveMessage(id) {
    return await Message.findByIdAndUpdate(id, { status: 'archived' }, { new: true });
}

// Delete message
async function deleteMessage(id) {
    return await Message.findByIdAndDelete(id);
}

// Get message stats
async function getMessageStats() {
    const total = await Message.countDocuments();
    const unread = await Message.countDocuments({ status: 'unread' });
    const replied = await Message.countDocuments({ status: 'replied' });

    return { total, unread, replied };
}

module.exports = {
    getAllMessages,
    getMessageById,
    createMessage,
    updateMessage,
    markAsRead,
    replyToMessage,
    archiveMessage,
    deleteMessage,
    getMessageStats
};
