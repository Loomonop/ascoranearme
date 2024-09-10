const express = require('express');
const axios = require('axios');
const haversine = require('haversine-distance');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files (for HTML)
app.use(express.static('public'));

// Ascora API credentials and endpoint (Replace these with your actual API credentials)
const ASCORA_API_URL = 'https://api.ascora.com.au/Jobs/Jobs';
const ASCORA_API_KEY = 'daf63ee61dc244debce0f23a19f77497940f73112f6d486fb00bcab5844336f8:36ce34d2-9aa4-447c-ba9c-1978a906eb58';

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
            headers: { 
                'Auth': ASCORA_API_KEY,
                'Content-Type': 'application/json'
            },
            params: {
                JobStatus: 'ALL-OPEN',
                PageSize: 10,
                Page: 1
            }
        });

        const jobs = jobsResponse.data.results;

        // Filter jobs within 20km
        const filteredJobs = jobs.filter(job => {
            const jobCoordinates = { lat: job.latitude, lon: job.longitude };
            const distance = haversine(suburbCoordinates, jobCoordinates);
            return distance <= 20000; // 20km in meters
        });

        res.json(filteredJobs);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching jobs. Please try again later.' });
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
