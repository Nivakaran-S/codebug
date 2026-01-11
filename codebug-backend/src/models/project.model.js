const Project = require('./project.mongo');

// Get all projects
async function getAllProjects(filters = {}) {
    const query = {};

    if (filters.category && filters.category !== 'all') {
        query.category = filters.category;
    }
    if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
    }
    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: 'i' } },
            { description: { $regex: filters.search, $options: 'i' } }
        ];
    }

    return await Project.find(query).sort({ createdAt: -1 });
}

// Get project by ID
async function getProjectById(id) {
    return await Project.findById(id);
}

// Create new project
async function createProject(projectData) {
    const project = new Project(projectData);
    return await project.save();
}

// Update project
async function updateProject(id, updateData) {
    return await Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
}

// Delete project
async function deleteProject(id) {
    return await Project.findByIdAndDelete(id);
}

// Get project stats
async function getProjectStats() {
    const total = await Project.countDocuments();
    const published = await Project.countDocuments({ status: 'published' });
    const draft = await Project.countDocuments({ status: 'draft' });
    const archived = await Project.countDocuments({ status: 'archived' });

    return { total, published, draft, archived };
}

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectStats
};
