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
        const newsItems = [];
        $('div.newsFeed_item_title').each((index, element) => {
            if (index < 10) {
                newsItems.push($(element).text());
            }
        });
        return newsItems;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

// APIエンドポイントを /news から /api/news に変更
app.get('/api/news', async (req, res) => {
    const news = await fetchNews();
    res.json(news);
});

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, 'public')));

// すべてのルートで index.html を提供
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
