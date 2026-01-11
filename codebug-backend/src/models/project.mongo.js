const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['ai', 'design', 'development', 'blockchain', 'fintech']
    },
    entity: {
        type: String,
        required: true,
        enum: ['Codebug AI', 'Codebug Studio', 'Codebug Works', 'Codebug Nexus']
    },
    description: {
        type: String,
        required: true
    },
    technologies: [{
        type: String,
        trim: true
    }],
    image: {
        type: String,
        default: '/project-placeholder.jpg'
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    stats: {
        type: Map,
        of: String,
        default: {}
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
