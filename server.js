const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

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

app.get('/api/news', async (req, res) => {
    const news = await fetchNews();
    res.json(news);
});

// ローカル開発用のサーバー起動コード
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Vercel用のエクスポート
module.exports = app;
