const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Article title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    excerpt: {
        type: String,
        required: [true, 'Article excerpt is required'],
        maxlength: [500, 'Excerpt cannot exceed 500 characters']
    },
    content: {
        type: String,
        required: [true, 'Article content is required']
    },
    category: {
        type: String,
        required: true,
        enum: ['ai', 'development', 'design', 'blockchain', 'business', 'tutorial'],
        default: 'development'
    },
    tags: [{
        type: String,
        trim: true
    }],
    author: {
        name: { type: String, required: true },
        avatar: { type: String },
        role: { type: String }
    },
    coverImage: {
        type: String
    },
    readTime: {
        type: Number,
        default: 5 // minutes
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Generate slug from title before saving
articleSchema.pre('save', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    // Set published date when status changes to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

// Calculate read time based on content
articleSchema.pre('save', function (next) {
    if (this.isModified('content')) {
        const wordsPerMinute = 200;
        const wordCount = this.content.split(/\s+/).length;
        this.readTime = Math.ceil(wordCount / wordsPerMinute);
    }
    next();
});

// Indexes for efficient queries
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1, status: 1 });
articleSchema.index({ slug: 1 });
articleSchema.index({ isFeatured: 1, status: 1 });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
