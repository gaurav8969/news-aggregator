import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NewsFeed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRSSFeed = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/news');
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
      <h1>Times of India Top Stories</h1>
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