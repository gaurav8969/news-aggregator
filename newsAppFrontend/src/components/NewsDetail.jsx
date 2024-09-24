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
    return <div>Loading...</div>;
  }

  // Filter the first .jpg image, since its mostly the main article img, after that advertisements may come
  const jpgImage = article.images.find((img) => img.endsWith('.jpg'));

  return (
    <div style={{textAlign: 'center'}}>
      <h1>{article.title}</h1>
      {/* conditional rendering */}
      {jpgImage && <img src={jpgImage} alt={article.title} />}
      <p>{article.fullText}</p>
      <h1>Summary</h1>
      <p>{article.summary}</p>
      <a href={article.link} target="_blank" rel="noopener noreferrer">Read more on the original website</a>
    </div>
  );
}

export default NewsDetail;