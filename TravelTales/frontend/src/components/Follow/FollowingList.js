import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import './FollowingList.css';

const FollowingList = () => {
  const { userId } = useParams();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (!userId) return;
    api.get(`/follow/following/${userId}`)
      .then(res => setFollowing(res.data))
      .catch(console.error);
  }, [userId]);

  return (
    <div className="following-container">
      <h3>Following</h3>
      {following.length === 0 ? (
        <p>Not following anyone yet.</p>
      ) : (
        <ul>
          {following.map(user => (
            <li key={user.id}>
              <Link to={`/profile/${user.id}`}>{user.username}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowingList;
