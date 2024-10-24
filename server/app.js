import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Test route
app.get('/', (req, res) => {
    res.json({ message: "healthy" });
});

// Use the routes
app.use(cors());
app.use(router);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
