import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

import api from '../../api/axios';
import { useAuthContext } from '../../context/AuthContext';
import CommentSection from '../CommentSection';
import './Feed.css';

const Feed = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    const token = user?.token || localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated');
      setLoading(false);
      navigate('/login');
      return;
    }

    const fetchFeedPosts = async (sort = sortOption) => {
      try {
        const res = await api.get('/follow/feed', {
          params: { sortBy: sort },
        });
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching feed:', err);
        setError('Failed to load feed');
      } finally {
        setLoading(false);
      }
    };

    const fetchFollowingList = async () => {
      try {
        const res = await api.get(`/follow/following/${user.id}`);
        setFollowingList(res.data.map((u) => u.id));
      } catch (err) {
        console.error('Error fetching following list:', err);
      }
    };

    fetchFeedPosts();
    fetchFollowingList();
  }, [user, navigate, sortOption]);

  const handleLike = async (postId) => {
    try {
      await api.post('/blogposts/like', { blogPostId: postId });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likeCount: (p.likeCount ?? 0) + 1 } : p
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to like post');
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await api.post('/blogposts/unlike', { blogPostId: postId });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, unlikeCount: Math.max((p.unlikeCount ?? 1) - 1, 0) }
            : p
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unlike post');
    }
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/blogposts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      alert('Post deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleFollow = async (followingId) => {
    try {
      await api.post('/follow/follow', { followingId });
      setFollowingList((prev) => [...prev, followingId]);
      alert('Followed successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to follow user');
    }
  };

  const handleUnfollow = async (followingId) => {
    try {
      await api.delete(`/follow/unfollow/${followingId}`);
      setFollowingList((prev) => prev.filter((id) => id !== followingId));
      alert('Unfollowed successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unfollow user');
    }
  };

  if (loading) return <p>Loading feed...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="feed-container">
      <h1>Feed</h1>

      <div className="sort-container">
        <label>Sort by: </label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="most_liked">Most Liked</option>
          <option value="most_commented">Most Commented</option>
        </select>
      </div>

      {posts.length === 0 ? (
        <p>No posts to display</p>
      ) : (
        posts.map((post) => {
          const isFollowing = followingList.includes(post.userId);
          const isOwnPost = user?.id === post.userId;

          return (
            <div key={post.id} className="post-item">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <div className="post-meta">
                <p>
                  <strong>Author:</strong>{' '}
                  {post.User?.username ? (
                    <Link to={`/profile/${post.User.id}`}>{post.User.username}</Link>
                  ) : (
                    'Unknown'
                  )}
                </p>
                <p><strong>Country:</strong> {post.countryName || post.country}</p>
                {post.flag && (
                  <img
                    src={post.flag}
                    alt={`${post.countryName || post.country} flag`}
                    style={{ width: '100px' }}
                  />
                )}
                <p><strong>Date:</strong> {new Date(post.dateOfVisit || post.createdAt).toLocaleDateString()}</p>
                <p><strong>Likes:</strong> {post.likeCount ?? 0}</p>
                <p><strong>Unlikes:</strong> {post.unlikeCount ?? 0}</p>
              </div>

              <div className="post-buttons">
                <button onClick={() => handleLike(post.id)}>
                  <FaThumbsUp style={{ color: 'blue', fontSize: '20px' }} /> Like
                </button>
                <button onClick={() => handleUnlike(post.id)}>
                  <FaThumbsDown style={{ color: 'red', fontSize: '20px' }} /> Unlike
                </button>

                {isOwnPost ? (
                  <button onClick={() => handleDelete(post.id)}>Delete</button>
                ) : (
                  user && (
                    isFollowing ? (
                      <button onClick={() => handleUnfollow(post.userId)}>Unfollow</button>
                    ) : (
                      <button onClick={() => handleFollow(post.userId)}>Follow</button>
                    )
                  )
                )}
              </div>

              <div className="comment-section">
                <CommentSection postId={post.id} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Feed;
