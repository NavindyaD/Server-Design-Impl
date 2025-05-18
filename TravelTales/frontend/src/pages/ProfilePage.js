// src/pages/ProfilePage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import FollowersList from '../components/Follow/FollowersList';
import FollowingList from '../components/Follow/FollowingList';
import FollowUserButton from '../components/Follow/FollowButton';

const ProfilePage = () => {
  const { userId } = useParams();

  return (
    <div>
      <h1>User Profile: {userId}</h1>
      <FollowUserButton targetUserId={parseInt(userId)} />
      <FollowersList userId={userId} />
      <FollowingList userId={userId} />
    </div>
  );
};

export default ProfilePage;
