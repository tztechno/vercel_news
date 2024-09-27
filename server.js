const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');  // CORSの問題を回避

const app = express();
app.use(cors());  // フロントエンドからのリクエストを許可

// ニュースをスクレイピングする関数
async function fetchNews() {
    const url = 'https://news.yahoo.co.jp/topics/top-picks';
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const newsItems = [];

        // Yahooニュースのタイトルを取得
        $('div.newsFeed_item_title').each((index, element) => {
            if (index < 10) {  // 上位10件を取得
                newsItems.push($(element).text());
            }
        });

        return newsItems;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

// エンドポイント: /news
app.get('/news', async (req, res) => {
    const news = await fetchNews();
    res.json(news);  // JSONでニュースリストを返す
});

// サーバーの起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

