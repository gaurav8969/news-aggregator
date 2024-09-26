import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function NewsDetail() {
  const { heading } = useParams();
  const [article, setArticle] = useState(null);
  const [showChevron, setShowChevron] = useState(false);
  const summaryRef = useRef(null); // Ref for the summary section
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

  // Scroll event listener to check when to show/hide chevron
  useEffect(() => {
    const handleScroll = () => {
      if (summaryRef.current) {
        const summaryTop = summaryRef.current.getBoundingClientRect().top;
        if (summaryTop > window.innerHeight || summaryTop < 0) {
          setShowChevron(true);
        } else {
          setShowChevron(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) {
    return <div style={styles.loadingText}>Loading...</div>;
  }

  const jpgImage = article.images.find((img) => img.endsWith('.jpg'));

  // Function to scroll to the summary section
  const scrollToSummary = () => {
    if (summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{article.title}</h1>
      {jpgImage && <img src={jpgImage} alt={article.title} style={styles.image} />}
      <p style={styles.text}>{article.fullText}</p>
      <h2 style={styles.subtitle}>Summary</h2>
      <p ref={summaryRef} style={styles.summary}>{article.summary}</p>
      <a href={article.link} target="_blank" rel="noopener noreferrer" style={styles.link}>
        Read more on the original website
      </a>

      {/* Chevron button, displayed conditionally */}
      {showChevron && (
        <button style={styles.chevronButton} onClick={scrollToSummary}>
          <svg style={styles.chevronButton} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000" height="800px" width="800px" version="1.1" id="Layer_1" viewBox="0 0 407.437 407.437" xmlSpace="preserve"> <polygon points="386.258,91.567 203.718,273.512 21.179,91.567 0,112.815 203.718,315.87 407.437,112.815 "/> </svg>
        </button>
      )}
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
    position: 'relative',
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
  chevronButton: {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '1.5rem',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    boxSizing: 'border-box',
    padding: '7px'
  },
};

export default NewsDetail;