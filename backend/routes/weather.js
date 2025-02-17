const express = require('express');
const axios = require('axios');

const router = express.Router();

// GET /weather lat=...&lon=...
router.get('/', async (req, res) => {
    const { lat, lon, location } = req.query;

    try {
        let params = {
            appid: process.env.OPENWEATHER_API_KEY,
            units: 'metric'
        };

        if (lat && lon) {
            params.lat = lat;
            params.lon = lon;
        } else if (location) {
            .
            params.q = location; 
        } else {
            return res.status(400).json({ error: 'Missing required location parameters' });
        }

        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params
        });

        const weatherData = response.data;
        // Define clear night as less than 10% cloud cover (customize as needed)
        const isClearNight = weatherData.clouds && weatherData.clouds.all < 10;

        res.json({ data: weatherData, clearNight: isClearNight });
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Error retrieving weather data' });
    }
});

module.exports = router;