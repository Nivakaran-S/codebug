const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderName: {
        type: String,
        required: true,
        trim: true
    },
    senderEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'replied', 'archived'],
        default: 'unread'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    repliedAt: {
        type: Date
    },
    replyMessage: {
        type: String
    },
    company: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
