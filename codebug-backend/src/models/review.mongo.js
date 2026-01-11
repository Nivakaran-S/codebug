const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    clientCompany: {
        type: String,
        required: true,
        trim: true
    },
    clientRole: {
        type: String,
        required: true,
        trim: true
    },
    clientAvatar: {
        type: String
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
