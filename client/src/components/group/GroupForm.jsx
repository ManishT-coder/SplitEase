import React, { useState, useEffect } from 'react';
import { FiPlus, FiX, FiSearch, FiMail } from 'react-icons/fi';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useGroups } from '../../context/GroupContext';
import userService from '../../services/userService';
import { getErrorMessage } from '../../utils/formatters';

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const isInviteableEmail = (value) =>
  Boolean(value && EMAIL_RE.test(value) && value.length >= 2);

const GroupForm = ({ onClose, onCreated }) => {
  const { createGroup } = useGroups();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emails, setEmails] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchInput || searchInput.length < 2) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await userService.search(searchInput);
        if (!cancelled) {
          setSuggestions(
            results.filter((u) => !emails.includes(u.email.toLowerCase()))
          );
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchInput, emails]);

  const addEmail = (email) => {
    const normalized = email.toLowerCase().trim();
    if (normalized && !emails.includes(normalized)) {
      setEmails((prev) => [...prev, normalized]);
    }
    setSearchInput('');
    setSuggestions([]);
  };

  const removeEmail = (toRemove) => {
    setEmails((prev) => prev.filter((e) => e !== toRemove));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isInviteableEmail(searchInput)) {
        addEmail(searchInput);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Group name is required');
      return;
    }

    setSubmitting(true);
    try {
      await createGroup({
        name: name.trim(),
        description: description.trim(),
        members: emails
      });
      onCreated?.();
      onClose?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div>
        <label className="label">Group Name *</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Trip to Goa"
          autoFocus
        />
      </div>

      <div>
        <label className="label">Description</label>
        <input
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Goa trip expenses"
        />
      </div>

      <div>
        <label className="label">Add Members (by email)</label>
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <FiSearch size={16} />
          </div>
          <input
            className="input pl-10"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search by name or email... (Enter to add by email)"
          />
          {suggestions.length > 0 ||
          (isInviteableEmail(searchInput) &&
            !emails.includes(searchInput.toLowerCase().trim())) ? (
            <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
              {suggestions.map((user) => (
                <li key={user._id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
                    onClick={() => addEmail(user.email)}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                    <span className="ml-auto text-slate-400">
                      <FiPlus size={14} />
                    </span>
                  </button>
                </li>
              ))}
              {suggestions.length === 0 &&
                isInviteableEmail(searchInput) &&
                !emails.includes(searchInput.toLowerCase().trim()) && (
                  <li>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
                      onClick={() => addEmail(searchInput)}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                        <FiMail size={12} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          Invite new member
                        </p>
                        <p className="text-xs text-slate-400">
                          {searchInput.toLowerCase().trim()}
                        </p>
                      </div>
                      <span className="ml-auto text-slate-400">
                        <FiPlus size={14} />
                      </span>
                    </button>
                  </li>
                )}
            </ul>
          ) : null}
          {searching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-300 border-t-brand-600" />
            </div>
          )}
        </div>

        {emails.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {emails.map((email) => (
              <span
                key={email}
                className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
              >
                {email}
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="rounded-full hover:bg-brand-100"
                  aria-label={`Remove ${email}`}
                >
                  <FiX size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="mt-1 text-xs text-slate-400">
          Type an email and it will be added — new users get an invite account.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Group'}
        </Button>
      </div>
    </form>
  );
};

export default GroupForm;