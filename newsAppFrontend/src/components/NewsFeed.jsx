import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NewsFeed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/api/news'
  : 'https://news-aggregator-one-mu.vercel.app/api/news';

  useEffect(() => {
    const fetchRSSFeed = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setFeedItems(data);
      } catch (error) {
        console.error('Error fetching RSS feed:', error);
      }
      setLoading(false);
    };

    fetchRSSFeed();
  }, []);

  return (
    <div>
      <h1>Latest Top Stories</h1>
      {loading ? <p>Loading...</p> : (
        <ul>
          {feedItems.map((item) => {
            // Convert the title to a URL-friendly version (hyphenated)
            const headingSlug = item.title.replace(/\s+/g, '-').toLowerCase();
            return (
              <li key={item.link}>
                <Link to={`/news/${headingSlug}`}>
                  <h3>{item.title}</h3>
                </Link>
                <p>{item.pubDate}</p>
                <p>{item.contentSnippet}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NewsFeed;