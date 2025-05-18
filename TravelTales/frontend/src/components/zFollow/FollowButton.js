// src/components/FollowUserButton.js
import React, { useState, useEffect, useContext } from 'react';
import api, { setAuthToken } from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const FollowUserButton = ({ targetUserId }) => {
  const { user, token } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!token) return;

    setAuthToken(token);

    // Check if current user follows targetUserId
    api.get(`/follow/following/${user.id}`)
      .then(res => {
        const followingIds = res.data.map(u => u.id);
        setIsFollowing(followingIds.includes(targetUserId));
      })
      .catch(err => {
        console.error(err);
      });
  }, [token, targetUserId, user.id]);

  const handleFollow = () => {
    if (!token) return alert('Login required');
    setAuthToken(token);

    if (isFollowing) {
      api.delete(`/follow/unfollow/${targetUserId}`)
        .then(() => setIsFollowing(false))
        .catch(console.error);
    } else {
      api.post('/follow/follow', { followingId: targetUserId })
        .then(() => setIsFollowing(true))
        .catch(console.error);
    }
  };

  if (user.id === targetUserId) return null; // Cannot follow self

  return (
    <button onClick={handleFollow}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowUserButton;
