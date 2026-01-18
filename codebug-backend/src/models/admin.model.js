const Admin = require('./admin.mongo');
const jwt = require('jsonwebtoken');

// Get admin by email
async function getAdminByEmail(email) {
    return await Admin.findOne({ email });
}

// Get admin by ID
async function getAdminById(id) {
    return await Admin.findById(id).select('-password');
}

// Create new admin
async function createAdmin(adminData) {
    const admin = new Admin(adminData);
    return await admin.save();
}

// Update admin
async function updateAdmin(id, updateData) {
    // Don't allow password update through this method
    delete updateData.password;
    return await Admin.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
}

// Authenticate admin
async function authenticateAdmin(email, password) {
    const admin = await Admin.findOne({ email });
    if (!admin) {
        return { success: false, message: 'Admin not found' };
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
        return { success: false, message: 'Invalid password' };
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: admin._id, email: admin.email, role: admin.role, name: admin.name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        success: true,
        token,
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        }
    };
}

// Change password
async function changePassword(id, currentPassword, newPassword) {
    const admin = await Admin.findById(id);
    if (!admin) {
        return { success: false, message: 'Admin not found' };
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
        return { success: false, message: 'Current password is incorrect' };
    }

    admin.password = newPassword;
    await admin.save();

    return { success: true, message: 'Password changed successfully' };
}

module.exports = {
    getAdminByEmail,
    getAdminById,
    createAdmin,
    updateAdmin,
    authenticateAdmin,
    changePassword
};
