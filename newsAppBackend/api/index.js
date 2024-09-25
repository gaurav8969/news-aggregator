// server.js
const express = require('express');
const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const parser = new Parser();

const { HfInference } = require('@huggingface/inference');
const inference = new HfInference('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');

app.use(cors());

// Fetch RSS feed and assign unique ID
app.get('/api/news', async (req, res) => {
  try {
    const feed = await parser.parseURL('https://timesofindia.indiatimes.com/rssfeedstopstories.cms');
    const items = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
    }));
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching RSS feed', error });
  }
});

// Scrape individual news articles
app.get('/api/news/:heading', async (req, res) => {
    const { heading } = req.params;
    try {
        const feed = await parser.parseURL('https://timesofindia.indiatimes.com/rssfeedstopstories.cms');
        const article = await findArticleByHeading(feed, heading);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        // Fetch the original article HTML and scrape it using cheerio
        const { data: html } = await axios.get(article.link);
        const $ = cheerio.load(html);

        // Extracting the necessary content (modify selectors as needed based on the Times of India structure)
        const fullText = $('div._s30J.clearfix').text();
        const images = $('img').map((i, el) => $(el).attr('src')).get();

        // Generate a summary using Hugging Face API
        const summaryResponse = await inference.summarization({
            model: 'facebook/bart-large-cnn', // You can use a different model as needed
            inputs: fullText,
            parameters: { max_length: 150, min_length: 40 }, // Adjust as per your needs
        });
        const summary = summaryResponse.summary_text;

        res.json({
            title: article.title,
            fullText,
            images,
            link: article.link,
            summary
        });
    } catch (error) {
        res.status(500).json({ message: 'Error scraping article', error });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  if(process.env.NODE_ENV === 'development'){
    console.log(`Server running on port ${PORT}`);
  }
  console.log(`Access endpoint at http://localhost:${PORT}/api/news`);
});

async function findArticleByHeading(feed, heading) {
    const formattedHeading = heading.replace(/-/g, ' ');
    return feed.items.find((article) => article.title.toLowerCase() === formattedHeading.toLowerCase());
}