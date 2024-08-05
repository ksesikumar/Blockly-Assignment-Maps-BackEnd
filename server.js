const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 6540;

app.use(cors());
app.use(express.json()); // For parsing application/json

const dummyDataPath = path.join(__dirname, 'dummyData.json');
const fs = require('fs');

let dummyData = [];

fs.readFile(dummyDataPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading dummyData.json:', err);
        return;
    }
    try {
        dummyData = JSON.parse(data);
    } catch (parseErr) {
        console.error('Error parsing dummyData.json:', parseErr);
    }
});

let currentIndex = 0;

app.get('/api/vehicle', (req, res) => {
    if (!dummyData.length) {
        return res.status(500).json({ error: 'No data available' });
    }

    const currentData = dummyData[currentIndex];
    currentIndex = (currentIndex + 1) % dummyData.length;

    res.json({
        currentPosition: {
            lat: currentData.latitude,
            lng: currentData.longitude,
        },
        route: dummyData.slice(0, currentIndex + 1).map(({ latitude, longitude }) => ({
            lat: latitude,
            lng: longitude,
        })),
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});