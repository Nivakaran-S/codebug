// Vercel Serverless Function Handler
require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection caching for serverless
let cachedConnection = null;

async function connectToDatabase() {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('Using cached database connection');
        return cachedConnection;
    }

    try {
        console.log('Creating new database connection...');
        cachedConnection = await mongoose.connect(process.env.MONGO_URL, {
            bufferCommands: false,
            maxPoolSize: 10,
        });
        console.log('Connected to MongoDB');
        return cachedConnection;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        throw error;
    }
}

// Serverless handler - must export the app
module.exports = async (req, res) => {
    try {
        // Connect to database first
        await connectToDatabase();

        // Import app after dotenv is loaded
        const app = require('../src/app');

        // Handle the request
        return app(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
