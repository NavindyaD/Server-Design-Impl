import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import CreatePost from './components/Blog/CreatePost';
import PostList from './components/Blog/PostList';
import UserPosts from './pages/UserPosts';
import EditPost from './components/Blog/EditPost';
import ProfilePage from './pages/ProfilePage';
import Feed from './components/Blog/Feed';
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/userPosts/:userId" element={<UserPosts />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
