import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewsFeed from './components/NewsFeed';
import NewsDetail from './components/NewsDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/news" element={<NewsFeed />} />
        <Route path="/news/:heading" element={<NewsDetail />} />
      </Routes>
    </Router>
  );
}

export default App;