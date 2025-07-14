import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/css/AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/admin/apikeys/users', {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Failed to fetch users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const generateKey = async (userId) => {
    try {
      const res = await axios.post(`http://localhost:3001/api/admin/apikeys/${userId}/generate`, {}, {
        withCredentials: true,
      });
      setMessage(res.data.message);
      fetchUsers();
    } catch (error) {
      console.error('Error generating API key:', error);
      setMessage('Failed to generate key.');
    }
  };

  const deleteKey = async (userId) => {
    try {
      const res = await axios.delete(`http://localhost:3001/api/admin/apikeys/${userId}`, {
        withCredentials: true,
      });
      setMessage(res.data.message);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting API key:', error);
      setMessage('Failed to delete key.');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {message && <p>{message}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Username</th>
            <th>API Key</th>
            <th>Usage</th>
            <th>Last Used</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, username, apiKey, usageCount, lastUsedAt }) => (
            <tr key={id}>
              <td>{username}</td>
              <td>{apiKey || 'None'}</td>
              <td>{usageCount}</td>
              <td>{lastUsedAt ? new Date(lastUsedAt).toLocaleString() : 'Never'}</td>
              <td>
                <button onClick={() => generateKey(id)}>Generate</button>
                <button onClick={() => deleteKey(id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
