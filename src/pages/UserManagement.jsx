import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Edit, Trash2 } from 'lucide-react';
import '../css/NewOrderForm.css';
import '../css/UserManagement.css';
import UserForm from '../components/UserForm';
import { useAuth } from '../context/AuthContext';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isPasswordPromptVisible, setIsPasswordPromptVisible] = useState(false);
  const [pendingUserToEdit, setPendingUserToEdit] = useState(null);
  const [pendingUserToDelete, setPendingUserToDelete] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    fetchUsers(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    const handleSearchChange = () => {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('search') || '';
      setSearchQuery(query);
    };
    window.addEventListener('searchChanged', handleSearchChange);
    return () => {
      window.removeEventListener('searchChanged', handleSearchChange);
    };
  }, []);

  const fetchUsers = async (search = '') => {
    try {
      const url = search ? `http://localhost:5000/api/users?search=${encodeURIComponent(search)}` : 'http://localhost:5000/api/users';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteClick = (user) => {
    setPendingUserToDelete(user);
    setIsPasswordPromptVisible(true);
  };

  const confirmDeleteUser = async (password) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        // Password correct, proceed to delete user
        const deleteResponse = await fetch(`http://localhost:5000/api/users/${pendingUserToDelete._id}`, {
          method: 'DELETE',
        });
        if (deleteResponse.ok) {
          setUsers(users.filter((u) => u._id !== pendingUserToDelete._id));
        } else {
          console.error('Failed to delete user');
        }
      } else {
        // Password incorrect, logout immediately
        logout();
      }
    } catch (error) {
      console.error('Error verifying password or deleting user:', error);
      logout();
    } finally {
      setIsPasswordPromptVisible(false);
      setPendingUserToDelete(null);
    }
  };

  const handleEditClick = (user) => {
    setPendingUserToEdit(user);
    setIsPasswordPromptVisible(true);
  };

  const handlePasswordSubmit = async (password) => {
    // Verify admin password via backend API
    try {
      const response = await fetch('http://localhost:5000/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        // Password correct, show edit form
        setEditingUser(pendingUserToEdit);
        setIsEditFormVisible(true);
      } else {
        // Password incorrect, logout immediately
        logout();
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      logout();
    } finally {
      setIsPasswordPromptVisible(false);
      setPendingUserToEdit(null);
    }
  };

  const handleEditFormSubmit = async (updatedUser) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      if (response.ok) {
        setIsEditFormVisible(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleEditFormCancel = () => {
    setIsEditFormVisible(false);
    setEditingUser(null);
  };

  return (
    <div className="users-container">
      <Header />

      <div className="users-content">
        <h1 className="users-title">User Management</h1>

        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="new-order-form-input"
          style={{ marginBottom: '20px' }}
        />

        <div className="users-table-container">
          <table className="users-table">
        <thead>
          <tr className="table-header">
            <th style={{ paddingBottom: '10px' }}>Username</th>
            <th style={{ paddingBottom: '10px' }}>Email</th>
            <th style={{ paddingBottom: '10px' }}>Role</th>
            <th style={{ paddingBottom: '10px' }}>Actions</th>
          </tr>
        </thead>
            <tbody className="table-body">
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="actions">
                    <button className="edit-btn" onClick={() => handleEditClick(user)} title="Edit User">
                      <Edit className="icon" />
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteClick(user)} title="Delete User">
                      <Trash2 className="icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isPasswordPromptVisible && (
        <PasswordPrompt
          onSubmit={pendingUserToDelete ? confirmDeleteUser : handlePasswordSubmit}
          onCancel={() => {
            setIsPasswordPromptVisible(false);
            setPendingUserToEdit(null);
            setPendingUserToDelete(null);
          }}
        />
      )}

      {isEditFormVisible && editingUser && (
        <UserForm
          user={editingUser}
          onSubmit={handleEditFormSubmit}
          onCancel={handleEditFormCancel}
        />
      )}
    </div>
  );
}

// PasswordPrompt component
function PasswordPrompt({ onSubmit, onCancel }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="new-order-form-overlay" onClick={onCancel}>
      <div className="new-order-form" onClick={(e) => e.stopPropagation()}>
        <h2>Admin Password Required</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            className="new-order-form-input"
          />
          </label>
          <div className="form-buttons">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
