const mongoose = require('mongoose');

const caseStudySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    client: {
        type: String,
        required: true,
        trim: true
    },
    industry: {
        type: String,
        required: true,
        trim: true
    },
    challenge: {
        type: String,
        required: true
    },
    solution: {
        type: String,
        required: true
    },
    results: {
        type: String,
        required: true
    },
    testimonial: {
        type: String
    },
    technologies: [{
        type: String,
        trim: true
    }],
    image: {
        type: String,
        default: '/case-study-placeholder.jpg'
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CaseStudy', caseStudySchema);
