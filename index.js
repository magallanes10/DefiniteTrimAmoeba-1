const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

app.get('/gdphtop', async (req, res) => {
    const url = 'https://gdph.ps.fhgdps.com/tools/stats/top24h.php';

    try {
        // Single set of headers with Mozilla-like user-agent
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/91.0'
        };

        const response = await axios.get(url, { headers });
        const html = response.data;
        const $ = cheerio.load(html);

        const leaderboard = [];

        $('table tr').each((index, element) => {
            if (index !== 0) {
                const rank = $(element).find('td:nth-child(1)').text();
                const userID = $(element).find('td:nth-child(2)').text();
                const username = $(element).find('td:nth-child(3)').text();
                const stars = $(element).find('td:nth-child(4)').text();

                leaderboard.push({
                    rank: parseInt(rank),
                    userID: parseInt(userID),
                    username,
                    stars: parseInt(stars)
                });
            }
        });

        res.json(leaderboard);

    } catch (error) {
        console.error("Error fetching the leaderboard:", error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
