const mongoose = require('mongoose');

const jobPositionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    department: {
        type: String,
        required: true,
        enum: ['engineering', 'design', 'ai', 'blockchain', 'marketing', 'operations', 'hr'],
        default: 'engineering'
    },
    type: {
        type: String,
        required: true,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
        default: 'full-time'
    },
    location: {
        type: String,
        required: true,
        default: 'Remote'
    },
    description: {
        type: String,
        required: [true, 'Job description is required']
    },
    requirements: [{
        type: String,
        trim: true
    }],
    responsibilities: [{
        type: String,
        trim: true
    }],
    benefits: [{
        type: String,
        trim: true
    }],
    salary: {
        min: { type: Number },
        max: { type: Number },
        currency: { type: String, default: 'USD' },
        isVisible: { type: Boolean, default: false }
    },
    experience: {
        min: { type: Number, default: 0 },
        max: { type: Number },
        level: {
            type: String,
            enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
            default: 'mid'
        }
    },
    skills: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'open', 'closed', 'filled'],
        default: 'draft'
    },
    isUrgent: {
        type: Boolean,
        default: false
    },
    applicationCount: {
        type: Number,
        default: 0
    },
    postedAt: {
        type: Date
    },
    closingDate: {
        type: Date
    }
}, {
    timestamps: true
});

// Set posted date when status changes to open (async middleware for Mongoose 8+)
jobPositionSchema.pre('save', async function () {
    if (this.isModified('status') && this.status === 'open' && !this.postedAt) {
        this.postedAt = new Date();
    }
});

// Indexes
jobPositionSchema.index({ status: 1, department: 1 });
jobPositionSchema.index({ type: 1, status: 1 });
jobPositionSchema.index({ postedAt: -1 });

const JobPosition = mongoose.model('JobPosition', jobPositionSchema);

module.exports = JobPosition;
