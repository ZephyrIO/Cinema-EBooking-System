import React from 'react';
import UserCard from './UserCard';
import './ManageUsers.css';

const users = [
  {
    id: 1,
    name: 'John Doe',
  },
  {
    id: 2,
    name: 'Jane Doe',
  },
  // Add more users here...
];

const ManageUsers = () => {
  return (
    <div className="adminMainScreen">
        <h1 className='title'>Admin Dashboard</h1> 
    <div>
      {users.map((user) => (
        <div key={user.id} className="user-card-container">
          <UserCard user={user} />
          <div className="button-group">
            <button>Grant Admin</button>
            <button>Delete</button>
            <button>Update</button>
            <button>Suspend</button>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default ManageUsers;