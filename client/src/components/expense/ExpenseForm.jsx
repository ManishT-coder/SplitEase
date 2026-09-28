import React, { useState } from 'react';
import Button from '../common/Button';
import Alert from '../common/Alert';
import expenseService from '../../services/expenseService';
import { useGroups } from '../../context/GroupContext';
import { useAuth } from '../../hooks/useAuth';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { getErrorMessage } from '../../utils/formatters';

const ExpenseForm = ({ group, expense, onDone, onClose }) => {
  const { user } = useAuth();
  const { fetchGroupDetails } = useGroups();

  const [description, setDescription] = useState(expense?.description || '');
  const [amount, setAmount] = useState(expense?.amount || '');
  const [category, setCategory] = useState(expense?.category || 'food');
  const [date, setDate] = useState(
    expense?.date ? new Date(expense.date).toISOString().slice(0, 10) : ''
  );
  const [paidBy, setPaidBy] = useState(
    expense?.paidBy?._id || expense?.paidBy || user?._id || ''
  );
  const [selected, setSelected] = useState(
    () =>
      new Set(
        (expense?.splitAmong || group?.members || [])
          .map((m) => (m && m._id ? m._id : m))
          .map(String)
      )
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const members = group?.members || [];

  const toggleMember = (memberId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === members.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(members.map((m) => String(m._id))));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (selected.size === 0) {
      setError('Select at least one person to split with');
      return;
    }

    const payload = {
      description: description.trim(),
      amount: amountNum,
      groupId: group._id,
      paidBy,
      splitAmong: [...selected],
      category,
      date: date || undefined
    };

    setSubmitting(true);
    try {
      if (expense) {
        await expenseService.update(expense._id, payload);
      } else {
        await expenseService.create(payload);
      }
      await fetchGroupDetails(group._id);
      onDone?.();
      onClose?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const perPerson =
    amount && selected.size
      ? (Number(amount) / selected.size).toFixed(2)
      : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

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
            {selected.size === members.length ? 'Deselect all' : 'Select all'}
          </button>
        </div>

        <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200">
          {members.map((m) => {
            const id = String(m._id);
            const isChecked = selected.has(id);
            return (
              <label
                key={m._id}
                className={`flex cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-2 last:border-0 ${
                  isChecked ? 'bg-brand-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
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
        <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
          <span className="text-slate-500">Each of the </span>
          <span className="font-semibold text-slate-700">{selected.size}</span>{' '}
          <span className="text-slate-500">people will owe </span>
          <span className="font-bold text-brand-700">₹{perPerson}</span>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Saving...' : expense ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;