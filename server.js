const express = require('express');
const axios = require('axios');
const haversine = require('haversine-distance');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files (for HTML)
app.use(express.static('public'));

// Ascora API credentials and endpoint (Replace these with your actual API credentials)
const ASCORA_API_URL = 'https://api.ascora.com/your-endpoint';
const ASCORA_API_KEY = 'your-api-key';

// Endpoint to fetch jobs and filter by distance
app.get('/jobs', async (req, res) => {
    const suburb = req.query.suburb;

    if (!suburb) {
        return res.status(400).json({ error: 'Suburb is required' });
    }

    try {
        // Get lat/lon for the suburb (replace this with an actual geocoding API)
        const suburbCoordinates = await getCoordinatesForSuburb(suburb);

        // Fetch jobs from Ascora API
        const jobsResponse = await axios.get(ASCORA_API_URL, {
            headers: { 'Authorization': `Bearer ${ASCORA_API_KEY}` }
        });

        const jobs = jobsResponse.data;

        // Filter jobs within 20km
        const filteredJobs = jobs.filter(job => {
            const jobCoordinates = { lat: job.latitude, lon: job.longitude };
            const distance = haversine(suburbCoordinates, jobCoordinates);
            return distance <= 20000; // 20km in meters
        });

        res.json(filteredJobs);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Placeholder function for suburb geocoding (use a real API like Google Maps)
async function getCoordinatesForSuburb(suburb) {
    // For now, just return fixed coordinates for testing
    // Replace with API call to get actual coordinates for the suburb
    return { lat: -31.9505, lon: 115.8605 }; // Perth, WA
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
