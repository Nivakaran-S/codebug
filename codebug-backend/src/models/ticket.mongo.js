const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['client', 'admin'],
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'messages.senderModel'
    },
    senderModel: {
        type: String,
        enum: ['Client', 'Admin']
    },
    senderName: String,
    message: {
        type: String,
        required: true
    },
    attachments: [{
        name: String,
        url: String
    }],
    readAt: Date
}, { timestamps: true });

const ticketSchema = new mongoose.Schema({
    ticketNumber: {
        type: String,
        unique: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['general', 'technical', 'billing', 'feature-request', 'bug-report'],
        default: 'general'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    messages: [messageSchema],
    resolvedAt: Date,
    closedAt: Date
}, {
    timestamps: true
});

// Generate ticket number before saving
ticketSchema.pre('save', async function (next) {
    if (!this.ticketNumber) {
        const count = await mongoose.model('Ticket').countDocuments();
        this.ticketNumber = `TKT-${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
