const CaseStudy = require('./caseStudy.mongo');

// Get all case studies
async function getAllCaseStudies(filters = {}) {
    const query = {};

    if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
    }
    if (filters.featured !== undefined) {
        query.featured = filters.featured;
    }

    return await CaseStudy.find(query).sort({ createdAt: -1 });
}

// Get case study by ID
async function getCaseStudyById(id) {
    return await CaseStudy.findById(id);
}

// Create new case study
async function createCaseStudy(caseStudyData) {
    const caseStudy = new CaseStudy(caseStudyData);
    return await caseStudy.save();
}

// Update case study
async function updateCaseStudy(id, updateData) {
    return await CaseStudy.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
}

// Toggle featured
async function toggleFeatured(id) {
    const caseStudy = await CaseStudy.findById(id);
    if (!caseStudy) return null;

    caseStudy.featured = !caseStudy.featured;
    return await caseStudy.save();
}

// Delete case study
async function deleteCaseStudy(id) {
    return await CaseStudy.findByIdAndDelete(id);
}

// Get case study stats
async function getCaseStudyStats() {
    const total = await CaseStudy.countDocuments();
    const published = await CaseStudy.countDocuments({ status: 'published' });
    const featured = await CaseStudy.countDocuments({ featured: true });

    return { total, published, featured };
}

// Get published case studies for public view
async function getPublishedCaseStudies() {
    return await CaseStudy.find({ status: 'published' }).sort({ featured: -1, createdAt: -1 });
}

module.exports = {
    getAllCaseStudies,
    getCaseStudyById,
    createCaseStudy,
    updateCaseStudy,
    toggleFeatured,
    deleteCaseStudy,
    getCaseStudyStats,
    getPublishedCaseStudies
};
