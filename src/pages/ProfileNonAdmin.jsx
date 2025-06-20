import React, { useState } from 'react';
import Header from '../components/HeaderNotAdmin';
import { useAuth } from '../context/AuthContext';
import ProfileForm from '../components/ProfileForm';
import '../css/Profile.css';

export default function ProfileNonAdmin() {
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState('');

  const handleSubmit = async (updatedUser) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data); // update user in context
        setMessage('Profile updated successfully.');
      } else {
        setMessage('Failed to update profile.');
      }
    } catch (error) {
      setMessage('Error updating profile.');
    }
  };

  return (
    <div className="users-container">
      <Header />
      <div className="profile-container">
        <h1>Profile</h1>
        {message && <p className="update-message">{message}</p>}
        <div className="profile-content">
          <div className="profile-image-container">
            <img
              src="https://i.pinimg.com/236x/88/66/3f/88663f119118254fa0e22a36a5b490aa.jpg"
              alt="Profile"
              className="profile-image"
            />
          </div>
          <div className="profile-form-container">
            <ProfileForm user={user} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}
