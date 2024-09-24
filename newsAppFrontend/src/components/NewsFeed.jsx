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
    <div style={styles.container}>
      <h1 style={styles.title}>Latest Top Stories</h1>
      {loading ? (
        <p style={styles.loadingText}>Loading...</p>
      ) : (
        <ul style={styles.list}>
          {feedItems.map((item) => {
            const headingSlug = item.title.replace(/\s+/g, '-').toLowerCase();
            return (
              <li key={item.link} style={styles.listItem}>
                <Link to={`/news/${headingSlug}`} style={styles.link}>
                  <h3>{item.title}</h3>
                </Link>
                <p style={styles.pubDate}>{new Date(item.pubDate).toLocaleDateString()}</p>
                <p style={styles.snippet}>{item.contentSnippet}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// Define styles
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    color: '#333',
    marginBottom: '20px',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '1.2rem',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    borderBottom: '1px solid #ddd',
    padding: '20px 0',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
    fontSize: '1.4rem',
  },
  pubDate: {
    fontSize: '0.9rem',
    color: '#666',
  },
  snippet: {
    marginTop: '10px',
    color: '#555',
  },
};

export default NewsFeed;