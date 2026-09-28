import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useGroups } from '../context/GroupContext';
import { useAuth } from '../hooks/useAuth';
import groupService from '../services/groupService';
import expenseService from '../services/expenseService';
import { EXPENSE_CATEGORIES } from '../utils/constants';
import { formatCurrency, getErrorMessage } from '../utils/formatters';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const today = () => new Date().toISOString().slice(0, 10);

const AddExpense = () => {
  const navigate = useNavigate();
  const { groups, loading: groupsLoading } = useGroups();
  const { user } = useAuth();

  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [groupDetails, setGroupDetails] = useState(null);
  const [membersLoading, setMembersLoading] = useState(false);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState('food');
  const [paidBy, setPaidBy] = useState('');
  const [splitAmong, setSplitAmong] = useState(new Set());

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (groups.length === 1 && !selectedGroupId) {
      setSelectedGroupId(groups[0]._id);
    }
  }, [groups, selectedGroupId]);

  useEffect(() => {
    if (!selectedGroupId) {
      setGroupDetails(null);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setMembersLoading(true);
      setError(null);
      try {
        const data = await groupService.getById(selectedGroupId);
        if (!cancelled) {
          setGroupDetails(data);
          const membersList = data.members || [];
          const memberIds = membersList.map((m) => String(m._id));
          setSplitAmong(new Set(memberIds));
          const me = membersList.find(
            (m) => String(m._id) === String(user?._id)
          );
          setPaidBy((me ?? membersList[0])?._id || '');
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
          setGroupDetails(null);
        }
      } finally {
        if (!cancelled) setMembersLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [selectedGroupId, user]);

  const members = groupDetails?.members || [];

  const toggleMember = (id) => {
    setSplitAmong((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (splitAmong.size === members.length) {
      setSplitAmong(new Set());
    } else {
      setSplitAmong(new Set(members.map((m) => String(m._id))));
    }
  };

  const perPerson =
    amount && splitAmong.size
      ? (Number(amount) / splitAmong.size).toFixed(2)
      : null;

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setDate(today);
    setCategory('food');
    if (members.length) {
      const me = members.find((m) => String(m._id) === String(user?._id));
      setPaidBy((me ?? members[0])._id);
      setSplitAmong(new Set(members.map((m) => String(m._id))));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedGroupId) {
      setError('Please select a group');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (splitAmong.size === 0) {
      setError('Select at least one person to split with');
      return;
    }

    const payload = {
      description: description.trim(),
      amount: amountNum,
      groupId: selectedGroupId,
      paidBy,
      splitAmong: [...splitAmong],
      category,
      date: date || undefined,
    };

    setSubmitting(true);
    try {
      await expenseService.create(payload);
      setSuccess(true);
      resetForm();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (groupsLoading) return <Loading label="Loading groups..." fullPage />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
          <FiDollarSign size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add Expense</h1>
          <p className="text-sm text-slate-500">Split a new expense with your group</p>
        </div>
      </div>

      {success && (
        <Alert type="success" title="Expense added successfully" onClose={() => setSuccess(false)}>
          <button
            onClick={() => navigate(`/groups/${selectedGroupId}`)}
            className="mt-1 text-sm font-medium text-emerald-700 underline hover:text-emerald-800"
          >
            View group
          </button>
        </Alert>
      )}

      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          <div className="flex items-center gap-2">
            <FiAlertCircle />
            {error}
          </div>
        </Alert>
      )}

      <div className="card space-y-6 p-6">
        <div>
          <label className="label">Select Group *</label>
          <select
            className="input"
            value={selectedGroupId}
            onChange={(e) => {
              setSelectedGroupId(e.target.value);
              setSuccess(false);
              setError(null);
            }}
          >
            <option value="">-- choose a group --</option>
            {groups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
          {groups.length === 1 && (
            <p className="mt-1 text-xs text-slate-400">Auto-selected — you only have one group</p>
          )}
        </div>
      </div>

      {selectedGroupId && (
        <div className="card space-y-6 p-6">
          {membersLoading ? (
            <Loading label="Loading members..." />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label">Description *</label>
                  <input
                    className="input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Dinner at restaurant"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="label">Amount *</label>
                  <input
                    className="input"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="label">Date</label>
                  <input
                    className="input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Category</label>
                  <select
                    className="input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Paid By</label>
                  <select
                    className="input"
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                  >
                    {members.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                        {String(m._id) === String(user?._id) ? ' (you)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="label mb-0">Split Among</label>
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    {splitAmong.size === members.length ? 'Deselect all' : 'Select all'}
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200">
                  {members.map((m) => {
                    const id = String(m._id);
                    const checked = splitAmong.has(id);
                    return (
                      <label
                        key={m._id}
                        className={`flex cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-2 last:border-0 ${
                          checked ? 'bg-brand-50/50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleMember(id)}
                          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                          {m.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {m.name}
                          {String(m._id) === String(user?._id) && (
                            <span className="ml-1 text-xs text-slate-400">(you)</span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {perPerson && (
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm">
                  <FiDollarSign className="text-brand-500" />
                  <span className="text-slate-500">Each of</span>
                  <span className="font-semibold text-slate-700">{splitAmong.size}</span>
                  <span className="text-slate-500">people will owe</span>
                  <span className="font-bold text-brand-700">{formatCurrency(perPerson)}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  <FiCheckCircle size={16} />
                  {submitting ? 'Adding...' : 'Add Expense'}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default AddExpense;
