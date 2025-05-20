import React from 'react';
import { useParams } from 'react-router-dom';
import FollowersList from '../components/Follow/FollowersList';
import FollowingList from '../components/Follow/FollowingList';
import './ProfilePage.css';

const ProfilePage = () => {
  const { userId } = useParams();

  return (
    <div className="profile-page">
      <h1>User Profile: {userId}</h1>
      <div className="follow-lists">
        <FollowersList userId={userId} />
        <FollowingList userId={userId} />
      </div>
    </div>
  );
};

export default ProfilePage;
