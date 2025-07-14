import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/css/UserProfile.css';

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth/profile", {
          withCredentials: true,
        });
        setProfile(response.data);
      } catch (err) {
        setError("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>API Key:</strong> {profile.apiKey || "No API key assigned"}</p>
      <p><strong>Usage Count:</strong> {profile.usageCount}</p>
      <p><strong>Last Used:</strong> {profile.lastUsedAt ? new Date(profile.lastUsedAt).toLocaleString() : "Never"}</p>
    </div>
  );
}

export default UserProfile;
