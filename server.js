const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic route to check if the server is running
app.get('/', (req, res) => {
    res.send('Hello! This is the Ascora Near Me app.');
});

// Route to handle job search (you can extend this later)
app.get('/jobs', async (req, res) => {
    // Example: pretend to call an external API (replace with your actual logic)
    try {
        const response = await axios.get('https://api.example.com/jobs');
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching jobs');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
