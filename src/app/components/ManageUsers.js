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
  const [editingUser, setEditingUser] = useState(null); // State for user to edit

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

  // Function to handle suspend user
  const suspendUser = async (userId) => {
    const userData = JSON.parse(localStorage.getItem('userData')); // Get userData from localStorage
    if (!userData || !userData.token) { // If token is not available
      setError('Authentication token is missing.');
      return;
    }

    try {
      const response = await axios.put(`/api/users/suspend/${userId}`, {}, {
        headers: { Authorization: `Bearer ${userData.token}` }, // Use the token from localStorage
      });

      // Update the user list to reflect the change (mark user as suspended)
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, suspended: true } : user
        )
      );

      alert('User suspended successfully.');
    } catch (err) {
      console.error('Error suspending user:', err);
      alert('Error suspending user.');
    }
  };

  // Function to handle unsuspend user
  const unsuspendUser = async (userId) => {
    const userData = JSON.parse(localStorage.getItem('userData')); // Get userData from localStorage
    if (!userData || !userData.token) { // If token is not available
      setError('Authentication token is missing.');
      return;
    }

    try {
      const response = await axios.put(`/api/users/unsuspend/${userId}`, {}, {
        headers: { Authorization: `Bearer ${userData.token}` }, // Use the token from localStorage
      });

      // Update the user list to reflect the change (mark user as unsuspended)
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, suspended: false } : user
        )
      );

      alert('User unsuspended successfully.');
    } catch (err) {
      console.error('Error unsuspending user:', err);
      alert('Error unsuspending user.');
    }
  };

  // Function to handle delete user
  const deleteUser = async (user_Id) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.token) {
      setError('Authentication token is missing.');
      return;
    }

    try {
      console.log(`Attempting to delete user with ID: ${user_Id}`);
      const response = await axios.delete(`/api/users/delete/${user_Id}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== user_Id));
      alert('User deleted successfully.');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(`Error deleting user: ${err.message}`);
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

  // Handle editing user profile
  const handleEditUser = (user) => {
    console.log('Editing user set:', user);
    setEditingUser(user);
  };

  // Handle update profile form submission
  const handleUpdateUser = async (updatedUser) => {
    console.log('Updating user:', updatedUser);
    const userData = JSON.parse(localStorage.getItem('userData'));
    console.log('Updated user data:', updatedUser);

    if (!userData || !userData.token) {
      console.error('Authentication token is missing.');
      return;
    }

    try {
      console.log('Updating user with ID:', updatedUser._id);

      const response = await axios.put(`/api/users/update/${updatedUser._id}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      console.log('User updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating user:', error.response || error.message);
    }
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

                {/* Open the user profile for editing */}
                <button onClick={() => handleEditUser(user)}>Edit</button>
                
                {/* Suspend button */}
                {user.suspended ? (
                  <button onClick={() => unsuspendUser(user._id)}>Unsuspend</button>
                ) : (
                  <button onClick={() => suspendUser(user._id)}>Suspend</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No users available.</p> // Show message if no users or empty array
        )}
      </div>

      {/* Render Edit User Form if editingUser is set */}
      {editingUser && (
        <div className="edit-user-form">
          <h2>Edit User Profile</h2>
          <form onSubmit={(e) => { 
            console.log('Form submitted!');
            e.preventDefault(); 
            console.log('Prevented default.');
            handleUpdateUser(editingUser);
          }}>
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              placeholder="Full Name"
            />
            <input
              type="text"
              value={editingUser.phone}
              onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
              placeholder="Phone Number"
            />
            <input
              type="email"
              value={editingUser.email}
              readOnly
              placeholder="Email Address"
            />
            <input
              type="password"
              value={editingUser.password}
              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
              placeholder="Password"
            />
            <input
              type="text"
              value={editingUser.street}
              onChange={(e) => setEditingUser({ ...editingUser, street: e.target.value })}
              placeholder="Street Address"
            />
            <input
              type="text"
              value={editingUser.city}
              onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
              placeholder="City"
            />
            <input
              type="text"
              value={editingUser.state}
              onChange={(e) => setEditingUser({ ...editingUser, state: e.target.value })}
              placeholder="State"
            />
            <button type="submit">Update Profile</button>
            <button onClick={() => setEditingUser(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
