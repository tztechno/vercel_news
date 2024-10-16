```
http://localhost:3000

http://localhost:3000/api/news

node server.js

git init
git remote add origin https://github.com/tztechno/vercel_news.git
git add .
git commit -m "2024-09-27"
git push -u origin master
```


```

scraping in nodejs

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

```
