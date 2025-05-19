import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import CreatePost from './components/Blog/CreatePost';
import PostList from './components/Blog/PostList';
import UserPosts from './pages/UserPosts';
// import FeedPosts from './components/Follow/FeedPosts';
// import FollowButton from './components/Follow/FollowButton';
// import FollowersList from './components/Follow/FollowersList';
// import FollowingList from './components/Follow/FollowingList';
import EditPost from './components/Blog/EditPost';
import ProfilePage from './pages/ProfilePage';
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
          
<Route path="/profiles/:userId" element={<UserPosts />} />


           {/* <Route path="/feed" element={<FeedPosts />} /> Show feed on home */}
        <Route path="/profile/:userId" element={<ProfilePage />} />
       <Route path="/edit/:id" element={<EditPost />} />


          {/* New routes for follow system */}
        
          {/* <Route path="/follow/:id" element={<FollowButton />} />
          <Route path="/followers/:userId" element={<FollowersList />} />
          <Route path="/following/:userId" element={<FollowingList />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
