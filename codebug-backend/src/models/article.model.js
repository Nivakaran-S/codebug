const Article = require('./article.mongo');

// Get all articles with filters
async function getAllArticles(filters = {}) {
    const query = {};

    if (filters.status) {
        query.status = filters.status;
    }
    if (filters.category) {
        query.category = filters.category;
    }
    if (filters.featured !== undefined) {
        query.isFeatured = filters.featured;
    }
    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: 'i' } },
            { excerpt: { $regex: filters.search, $options: 'i' } },
            { tags: { $in: [new RegExp(filters.search, 'i')] } }
        ];
    }

    return await Article.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .lean();
}

// Get published articles for public view
async function getPublicArticles() {
    return await Article.find({ status: 'published' })
        .select('-content') // Exclude full content for listing
        .sort({ publishedAt: -1 })
        .lean();
}

// Get featured articles
async function getFeaturedArticles(limit = 3) {
    return await Article.find({ status: 'published', isFeatured: true })
        .select('-content')
        .sort({ publishedAt: -1 })
        .limit(limit)
        .lean();
}

// Get article by ID
async function getArticleById(id) {
    return await Article.findById(id).lean();
}

// Get article by slug
async function getArticleBySlug(slug) {
    const article = await Article.findOne({ slug, status: 'published' });
    if (article) {
        // Increment view count
        article.views += 1;
        await article.save();
    }
    return article;
}

// Create new article
async function createArticle(data) {
    const article = new Article(data);
    await article.save();
    return article;
}

// Update article
async function updateArticle(id, data) {
    return await Article.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
    );
}

// Update article status
async function updateArticleStatus(id, status) {
    const updateData = { status };
    if (status === 'published') {
        updateData.publishedAt = new Date();
    }
    return await Article.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
    );
}

// Toggle featured status
async function toggleFeatured(id) {
    const article = await Article.findById(id);
    if (!article) return null;

    article.isFeatured = !article.isFeatured;
    await article.save();
    return article;
}

// Delete article
async function deleteArticle(id) {
    return await Article.findByIdAndDelete(id);
}

// Get article stats
async function getArticleStats() {
    const [total, published, draft, featured] = await Promise.all([
        Article.countDocuments(),
        Article.countDocuments({ status: 'published' }),
        Article.countDocuments({ status: 'draft' }),
        Article.countDocuments({ isFeatured: true, status: 'published' })
    ]);

    const totalViews = await Article.aggregate([
        { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    return {
        total,
        published,
        draft,
        featured,
        totalViews: totalViews[0]?.total || 0
    };
}

// Get articles by category
async function getArticlesByCategory(category) {
    return await Article.find({ category, status: 'published' })
        .select('-content')
        .sort({ publishedAt: -1 })
        .lean();
}

module.exports = {
    getAllArticles,
    getPublicArticles,
    getFeaturedArticles,
    getArticleById,
    getArticleBySlug,
    createArticle,
    updateArticle,
    updateArticleStatus,
    toggleFeatured,
    deleteArticle,
    getArticleStats,
    getArticlesByCategory
};
