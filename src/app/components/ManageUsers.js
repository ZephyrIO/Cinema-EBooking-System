import React from 'react';
import UserCard from './UserCard';

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
    <div>
      {users.map((user) => (
        <div key={user.id}>
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
  );
};

export default ManageUsers;