// src/components/FollowersList.js
import React, { useEffect, useState } from 'react';
import api, { setAuthToken } from '../../api/axios';
import { Link } from 'react-router-dom';

const FollowersList = ({ userId }) => {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    api.get(`/follow/followers/${userId}`)
      .then(res => setFollowers(res.data))
      .catch(console.error);
  }, [userId]);

  return (
    <div>
      <h3>Followers</h3>
      {followers.length === 0 && <p>No followers yet.</p>}
      <ul>
        {followers.map(follower => (
          <li key={follower.id}>
            <Link to={`/profile/${follower.id}`}>{follower.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowersList;
