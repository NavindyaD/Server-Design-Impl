import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import Login from './components/Login';
import Register from './components/Register';
import LikedPosts from './components/LikedPosts';
import './App.css';

const App = () => {
  return (
    <Router>
      <Header />
      <div className="App">
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<BlogPost />} />
          <Route path="/liked-posts" element={<LikedPosts />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
