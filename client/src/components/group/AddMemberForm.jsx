import React, { useState } from 'react';
import { FiPlus, FiUser } from 'react-icons/fi';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useGroups } from '../../context/GroupContext';
import { getErrorMessage } from '../../utils/formatters';

const AddMemberForm = ({ groupId, onAdded }) => {
  const { addMember } = useGroups();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await addMember(groupId, email.trim());
      setEmail('');
      setSuccess(
        response?.created
          ? 'Member added (invite created)'
          : 'Member added successfully'
      );
      onAdded?.();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert type="success" onClose={() => setSuccess(false)}>
          {success}
        </Alert>
      )}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <FiUser size={16} />
          </div>
          <input
            className="input pl-10"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter member email"
          />
        </div>
        <Button type="submit" variant="primary" disabled={submitting || !email.trim()}>
          <FiPlus size={16} />
          Add
        </Button>
      </div>
    </form>
  );
};

export default AddMemberForm;