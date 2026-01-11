const Review = require('./review.mongo');

// Get all reviews
async function getAllReviews(filters = {}) {
    const query = {};

    if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
    }
    if (filters.featured !== undefined) {
        query.featured = filters.featured;
    }

    return await Review.find(query).sort({ createdAt: -1 });
}

// Get review by ID
async function getReviewById(id) {
    return await Review.findById(id);
}

// Create new review
async function createReview(reviewData) {
    const review = new Review(reviewData);
    return await review.save();
}

// Update review
async function updateReview(id, updateData) {
    return await Review.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
}

// Approve review
async function approveReview(id) {
    return await Review.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
}

// Reject review
async function rejectReview(id) {
    return await Review.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
}

// Toggle featured
async function toggleFeatured(id) {
    const review = await Review.findById(id);
    if (!review) return null;

    review.featured = !review.featured;
    return await review.save();
}

// Bulk approve pending reviews
async function approveAllPending() {
    return await Review.updateMany({ status: 'pending' }, { status: 'approved' });
}

// Delete review
async function deleteReview(id) {
    return await Review.findByIdAndDelete(id);
}

// Get review stats
async function getReviewStats() {
    const total = await Review.countDocuments();
    const pending = await Review.countDocuments({ status: 'pending' });
    const approved = await Review.countDocuments({ status: 'approved' });
    const featured = await Review.countDocuments({ featured: true });

    // Calculate average rating of approved reviews
    const avgResult = await Review.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const averageRating = avgResult.length > 0 ? Math.round(avgResult[0].avgRating * 10) / 10 : 0;

    return { total, pending, approved, featured, averageRating };
}

// Get approved reviews for public view
async function getApprovedReviews() {
    return await Review.find({ status: 'approved' }).sort({ featured: -1, createdAt: -1 });
}

module.exports = {
    getAllReviews,
    getReviewById,
    createReview,
    updateReview,
    approveReview,
    rejectReview,
    toggleFeatured,
    approveAllPending,
    deleteReview,
    getReviewStats,
    getApprovedReviews
};
