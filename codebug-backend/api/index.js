const mongoose = require('mongoose');
const app = require('../src/app');
require('dotenv').config();

// MongoDB connection caching for serverless
let isConnected = false;

async function connectToDatabase() {
    if (isConnected) {
        console.log('Using cached database connection');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            bufferCommands: false,
        });

        isConnected = conn.connection.readyState === 1;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// Serverless handler
module.exports = async (req, res) => {
    await connectToDatabase();
    return app(req, res);
};
