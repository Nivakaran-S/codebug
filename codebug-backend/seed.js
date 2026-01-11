// Seed script to create initial admin account
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected!');

        // Define admin schema directly to avoid model issues
        const adminSchema = new mongoose.Schema({
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            role: { type: String, default: 'admin' }
        }, { timestamps: true });

        const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@codebug.com' });
        if (existingAdmin) {
            console.log('Admin already exists:', existingAdmin.email);
            await mongoose.disconnect();
            process.exit(0);
        }

        // Hash password manually
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create admin
        const admin = new Admin({
            name: 'Admin',
            email: 'admin@codebug.com',
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('\nAdmin created successfully!');
        console.log('Email: admin@codebug.com');
        console.log('Password: admin123');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

seed();
