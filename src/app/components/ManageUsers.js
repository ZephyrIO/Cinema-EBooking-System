'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from './UserCard';
import './ManageUsers.css';

const ManageUsers = () => {
  // State to store users, loading, error, and confirmation states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // State for confirmation of delete

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      const userData = JSON.parse(localStorage.getItem('userData')); // Get userData from localStorage
      if (!userData || !userData.token) { // If token is not available
        setError('Authentication token is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/all-users', {
          headers: { Authorization: `Bearer ${userData.token}` }, // Use the token from localStorage
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle granting admin privileges
  const grantAdmin = async (userId) => {
    const userData = JSON.parse(localStorage.getItem('userData')); // Get userData from localStorage
    if (!userData || !userData.token) { // If token is not available
      setError('Authentication token is missing.');
      return;
    }

    try {
      const response = await axios.put(`/api/users/grant-admin/${userId}`, {}, {
        headers: { Authorization: `Bearer ${userData.token}` }, // Use the token from localStorage
      });

      // Update the user list to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAdmin: true } : user
        )
      );

      alert('User granted admin privileges.');
    } catch (err) {
      console.error('Error granting admin privileges:', err);
      alert('Error granting admin privileges.');
    }
  };

  // Function to handle removing admin privileges
  const removeAdmin = async (userId) => {
    const userData = JSON.parse(localStorage.getItem('userData')); // Get userData from localStorage
    if (!userData || !userData.token) { // If token is not available
      setError('Authentication token is missing.');
      return;
    }

    try {
      const response = await axios.put(`/api/users/remove-admin/${userId}`, {}, {
        headers: { Authorization: `Bearer ${userData.token}` }, // Use the token from localStorage
      });

      // Update the user list to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAdmin: false } : user
        )
      );

      alert('User removed from admin privileges.');
    } catch (err) {
      console.error('Error removing admin privileges:', err);
      alert('Error removing admin privileges.');
    }
  };

  // Function to handle delete user
  const deleteUser = async (user_Id) => {
    const userData = JSON.parse(localStorage.getItem('userData')); // Get userData from localStorage
    if (!userData || !userData.token) { // If token is not available
      setError('Authentication token is missing.');
      return;
    }

    try {
      const response = await axios.delete(`/api/delete/users/${user_Id}`, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });

      // Remove the user from the list after successful deletion
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== user_Id));

      alert('User deleted successfully.');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error deleting user.');
    }
  };

  // Confirm the deletion
  const handleConfirmDelete = (userId) => {
    setConfirmDelete(userId);
  };

  // Cancel the deletion
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Render loading, error, or users based on the state
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="adminMainScreen">
      <h1 className="title">Admin Dashboard</h1>
      <div>
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="user-card-container">
              <UserCard user={user} />
              <div className="button-group">
                {user.isAdmin ? (
                  <button onClick={() => removeAdmin(user._id)}>Remove Admin</button>
                ) : (
                  <button onClick={() => grantAdmin(user._id)}>Grant Admin</button>
                )}
                
                {/* Check if the delete confirmation is required */}
                {confirmDelete === user._id ? (
                  <div>
                    <button onClick={() => deleteUser(user._id)}>Confirm Delete</button>
                    <button onClick={handleCancelDelete}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => handleConfirmDelete(user._id)}>Delete</button>
                )}

                <button>Update</button>
                <button>Suspend</button>
              </div>
            </div>
          ))
        ) : (
          <p>No users available.</p> // Show message if no users or empty array
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
