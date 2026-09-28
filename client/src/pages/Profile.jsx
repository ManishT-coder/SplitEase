import React, { useState, useEffect } from 'react';
import { FiSave, FiUser } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import { getErrorMessage } from '../utils/formatters';
import Avatar from '../components/common/Avatar';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';

const Profile = () => {
  const { user, updateUser, loading } = useAuth();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  if (loading || !user) {
    return <Loading fullPage />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await userService.updateProfile({
        name: name.trim(),
        avatar: avatar.trim()
      });
      updateUser(response.user);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update profile'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
      <div className="card p-6 sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <Avatar user={{ ...user, avatar: avatar.trim() || user.avatar }} size="xl" />
            <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white ring-4 ring-white">
              <FiUser size={16} />
            </span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              {user.name || user.email}
            </h1>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        {success && (
          <div className="mb-4">
            <Alert type="success" onClose={() => setSuccess('')}>
              {success}
            </Alert>
          </div>
        )}
        {error && (
          <div className="mb-4">
            <Alert type="error" onClose={() => setError('')}>
              {error}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="label">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label htmlFor="avatar" className="label">
              Avatar URL <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="avatar"
              type="url"
              className="input"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={saving}>
            <FiSave size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;