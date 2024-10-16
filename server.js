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

        // rowsを使って特定のクラスを持つ要素を取得
        const rows = $('div.sc-3ls169-0.dHAJpi');
        const newsItems = [];
        
        // rows内の個々の要素に対してループを実行
        rows.each((index, element) => {
            // もしrowsからさらに特定のデータを抽出したい場合
            const title = $(element).find('div.newsFeed_item_title').text();
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
