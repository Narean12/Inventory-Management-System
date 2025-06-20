import React, { useState, useEffect } from 'react';
import '../css/UserManagement.css';

export default function ProfileForm({ user, onSubmit }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        role: user.role || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="profile-form-input"
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="profile-form-input"
        />
      </label>
      <label>
        Role:
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="profile-form-input"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </label>
      <div className="form-buttons">
        <button type="submit" className="submit-btn">
          Update Profile
        </button>
      </div>
    </form>
  );
}
