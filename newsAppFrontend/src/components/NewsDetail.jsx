import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function NewsDetail() {
  const { heading } = useParams();
  const [article, setArticle] = useState(null);
  const API_URL = process.env.NODE_ENV === 'development'
    ? `http://localhost:5000/api/news/${heading}`
    : `https://news-aggregator-one-mu.vercel.app/api/news/${heading}`;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(API_URL);
        setArticle(response.data);
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };
    fetchArticle();
  }, [heading]);

  if (!article) {
    return <div style={styles.loadingText}>Loading...</div>;
  }

  const jpgImage = article.images.find((img) => img.endsWith('.jpg'));

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{article.title}</h1>
      {jpgImage && <img src={jpgImage} alt={article.title} style={styles.image} />}
      <p style={styles.text}>{article.fullText}</p>
      <h2 style={styles.subtitle}>Summary</h2>
      <p style={styles.summary}>{article.summary}</p>
      <a href={article.link} target="_blank" rel="noopener noreferrer" style={styles.link}>
        Read more on the original website
      </a>
    </div>
  );
}

// Define styles
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '20px',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  text: {
    fontSize: '1rem',
    color: '#555',
    lineHeight: '1.6',
    textAlign: 'justify',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#007bff',
    marginBottom: '10px',
  },
  summary: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '20px',
  },
  link: {
    textDecoration: 'none',
    fontSize: '1.2rem',
    color: '#007bff',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '1.2rem',
  },
};

export default NewsDetail;