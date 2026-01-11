const Client = require('./client.mongo');
const jwt = require('jsonwebtoken');

// Get all clients
async function getAllClients(filters = {}) {
    const query = {};

    if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
    }
    if (filters.search) {
        query.$or = [
            { name: { $regex: filters.search, $options: 'i' } },
            { email: { $regex: filters.search, $options: 'i' } },
            { company: { $regex: filters.search, $options: 'i' } }
        ];
    }

    return await Client.find(query).select('-password').sort({ createdAt: -1 });
}

// Get client by ID
async function getClientById(id) {
    return await Client.findById(id).select('-password');
}

// Get client by email
async function getClientByEmail(email) {
    return await Client.findOne({ email });
}

// Create new client
async function createClient(clientData, createdBy) {
    const client = new Client({
        ...clientData,
        createdBy
    });
    await client.save();
    const { password, ...clientWithoutPassword } = client.toObject();
    return clientWithoutPassword;
}

// Update client
async function updateClient(id, updateData) {
    // Don't allow password update through this method
    delete updateData.password;
    return await Client.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
}

// Authenticate client
async function authenticateClient(email, password) {
    const client = await Client.findOne({ email });
    if (!client) {
        return { success: false, message: 'Client not found' };
    }

    if (client.status !== 'active') {
        return { success: false, message: 'Account is inactive' };
    }

    const isMatch = await client.comparePassword(password);
    if (!isMatch) {
        return { success: false, message: 'Invalid password' };
    }

    // Generate JWT token with role
    const token = jwt.sign(
        { id: client._id, email: client.email, role: 'client' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        success: true,
        token,
        client: {
            id: client._id,
            name: client.name,
            email: client.email,
            company: client.company,
            role: 'client'
        }
    };
}

// Change password
async function changePassword(id, currentPassword, newPassword) {
    const client = await Client.findById(id);
    if (!client) {
        return { success: false, message: 'Client not found' };
    }

    const isMatch = await client.comparePassword(currentPassword);
    if (!isMatch) {
        return { success: false, message: 'Current password is incorrect' };
    }

    client.password = newPassword;
    await client.save();

    return { success: true, message: 'Password changed successfully' };
}

// Deactivate client
async function deactivateClient(id) {
    return await Client.findByIdAndUpdate(id, { status: 'inactive' }, { new: true }).select('-password');
}

// Get client stats
async function getClientStats() {
    const total = await Client.countDocuments();
    const active = await Client.countDocuments({ status: 'active' });
    const inactive = await Client.countDocuments({ status: 'inactive' });

    return { total, active, inactive };
}

module.exports = {
    getAllClients,
    getClientById,
    getClientByEmail,
    createClient,
    updateClient,
    authenticateClient,
    changePassword,
    deactivateClient,
    getClientStats
};
