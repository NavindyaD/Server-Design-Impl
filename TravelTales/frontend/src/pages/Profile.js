import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    api.get(`/users/${username}`).then((res) => {
      setUser(res.data);
      setFollowed(res.data.followed);
    });
  }, [username]);

  const toggleFollow = async () => {
    if (followed) {
      await api.post(`/users/${username}/unfollow`);
    } else {
      await api.post(`/users/${username}/follow`);
    }
    setFollowed(!followed);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>{username}'s Profile</h2>
      <button onClick={toggleFollow}>{followed ? 'Unfollow' : 'Follow'}</button>
    </div>
  );
}

export default Profile;
