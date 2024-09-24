import React from "react";

const UserCard = ({ user, handleGrantAdmin, handleDelete, handleUpdate, handleSuspend }) => {
  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <p>ID: {user.id}</p>
    </div>
  );
};

export default UserCard;