import React from 'react';
import { useAuthContext } from '../../context/AuthContext';

const FollowUserButton = ({ targetUserId }) => {
  const { user } = useAuthContext();

  if (!user || !user.id) {
    return <button disabled>Login required to follow</button>;
  }

  // Your existing follow logic here, e.g.:
  const handleFollow = () => {
    // API call to follow targetUserId
  };

  return (
    <button onClick={handleFollow}>
      Follow
    </button>
  );
};

export default FollowUserButton;
