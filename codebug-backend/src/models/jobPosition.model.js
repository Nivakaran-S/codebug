const JobPosition = require('./jobPosition.mongo');

// Get all job positions with filters
async function getAllPositions(filters = {}) {
    const query = {};

    if (filters.status) {
        query.status = filters.status;
    }
    if (filters.department) {
        query.department = filters.department;
    }
    if (filters.type) {
        query.type = filters.type;
    }
    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: 'i' } },
            { description: { $regex: filters.search, $options: 'i' } },
            { skills: { $in: [new RegExp(filters.search, 'i')] } }
        ];
    }

    return await JobPosition.find(query)
        .sort({ isUrgent: -1, postedAt: -1, createdAt: -1 })
        .lean();
}

// Get open positions for public view
async function getOpenPositions() {
    return await JobPosition.find({ status: 'open' })
        .sort({ isUrgent: -1, postedAt: -1 })
        .lean();
}

// Get positions by department
async function getPositionsByDepartment(department) {
    return await JobPosition.find({ department, status: 'open' })
        .sort({ postedAt: -1 })
        .lean();
}

// Get position by ID
async function getPositionById(id) {
    return await JobPosition.findById(id).lean();
}

// Create new position
async function createPosition(data) {
    const position = new JobPosition(data);
    await position.save();
    return position;
}

// Update position
async function updatePosition(id, data) {
    return await JobPosition.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
    );
}

// Update position status
async function updatePositionStatus(id, status) {
    const updateData = { status };
    if (status === 'open') {
        updateData.postedAt = new Date();
    }
    return await JobPosition.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
    );
}

// Toggle urgent status
async function toggleUrgent(id) {
    const position = await JobPosition.findById(id);
    if (!position) return null;

    position.isUrgent = !position.isUrgent;
    await position.save();
    return position;
}

// Increment application count
async function incrementApplicationCount(id) {
    return await JobPosition.findByIdAndUpdate(
        id,
        { $inc: { applicationCount: 1 } },
        { new: true }
    );
}

// Delete position
async function deletePosition(id) {
    return await JobPosition.findByIdAndDelete(id);
}

// Get position stats
async function getPositionStats() {
    const [total, open, closed, filled] = await Promise.all([
        JobPosition.countDocuments(),
        JobPosition.countDocuments({ status: 'open' }),
        JobPosition.countDocuments({ status: 'closed' }),
        JobPosition.countDocuments({ status: 'filled' })
    ]);

    const totalApplications = await JobPosition.aggregate([
        { $group: { _id: null, total: { $sum: '$applicationCount' } } }
    ]);

    const byDepartment = await JobPosition.aggregate([
        { $match: { status: 'open' } },
        { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    return {
        total,
        open,
        closed,
        filled,
        totalApplications: totalApplications[0]?.total || 0,
        byDepartment: byDepartment.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {})
    };
}

module.exports = {
    getAllPositions,
    getOpenPositions,
    getPositionsByDepartment,
    getPositionById,
    createPosition,
    updatePosition,
    updatePositionStatus,
    toggleUrgent,
    incrementApplicationCount,
    deletePosition,
    getPositionStats
};
