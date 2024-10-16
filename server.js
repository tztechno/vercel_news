const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

async function fetchNews() {
    const url = 'https://news.yahoo.co.jp/topics/top-picks';
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const rows = $('div.sc-3ls169-0.dHAJpi');
        const newsItems = [];

        rows.each((index, element) => {
            const title = $(element).text();
            if (title && index < 10) {
                newsItems.push(title);
            }
        });
        return newsItems;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

app.get('/api/news', async (req, res) => {
    const news = await fetchNews();
    res.json(news);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
