const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    dueDate: Date,
    completedAt: Date
}, { _id: true });

const orderSchema = new mongoose.Schema({
    title: {
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
    category: {
        type: String,
        enum: ['web', 'mobile', 'ai', 'design', 'blockchain', 'other'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'review', 'completed', 'cancelled'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    budget: {
        type: Number
    },
    currency: {
        type: String,
        default: 'USD'
    },
    startDate: {
        type: Date
    },
    deadline: {
        type: Date
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    milestones: [milestoneSchema],
    attachments: [{
        name: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
