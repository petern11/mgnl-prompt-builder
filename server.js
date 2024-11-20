// Import required modules
import express from 'express';
import cors from 'cors';  // Don't forget to install: npm install cors
import { execute } from './index.js';

const app = express();

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());

// Create GET endpoint
app.get('/api/prompt', async (req, res) => {
    try {
        const result = await execute();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error running model:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

// Start server
app.listen(3311, () => {
    console.log(`
🚀 Server running at http://localhost:3311/api/prompt
    `);
});