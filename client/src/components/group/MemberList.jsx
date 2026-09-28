import React, { useState } from 'react';
import { FiUserMinus } from 'react-icons/fi';
import Avatar from '../common/Avatar';
import Alert from '../common/Alert';
import { useGroups } from '../../context/GroupContext';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/formatters';

const MemberList = ({ members = [], groupId, createdBy }) => {
  const { removeMember } = useGroups();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isCreator = String(createdBy) === String(user?._id);

  const handleRemove = async (memberId) => {
    if (!window.confirm('Remove this member?')) return;
    setLoading(true);
    setError(null);
    try {
      await removeMember(groupId, memberId);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to remove member'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <ul className="divide-y divide-slate-100">
        {members.map((member) => (
          <li key={member._id} className="flex items-center gap-3 py-3">
            <Avatar user={member} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">
                {member.name}
                {String(member._id) === String(user?._id) && (
                  <span className="ml-2 text-xs text-slate-400">(you)</span>
                )}
              </p>
              <p className="truncate text-xs text-slate-400">{member.email}</p>
            </div>
            {isCreator && String(member._id) !== String(user?._id) && (
              <button
                type="button"
                onClick={() => handleRemove(member._id)}
                disabled={loading}
                className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                title="Remove member"
              >
                <FiUserMinus size={16} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;