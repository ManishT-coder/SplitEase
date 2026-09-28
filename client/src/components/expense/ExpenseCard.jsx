import React from 'react';
import { FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategory } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const { user } = useAuth();
  const category = getCategory(expense.category);
  const canEdit = String(expense.paidBy?._id || expense.paidBy) === String(user?._id);

  return (
    <div className="card flex items-start gap-4 p-4 transition hover:shadow-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xl">
        {category.icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-semibold text-slate-800">{expense.description}</p>
            <p className="text-sm text-slate-500">
              {expense.paidBy?.name} paid · {formatDate(expense.date)}
            </p>
          </div>
          <p className="text-lg font-bold text-slate-800">
            {formatCurrency(expense.amount)}
          </p>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
            {category.label}
          </span>
          {expense.perPerson ? (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-700">
              {formatCurrency(expense.perPerson)} / person
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-400">
              <FiUsers size={12} />
              Split among {expense.splitAmong?.length || 0}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-1">
        {canEdit && (
          <>
            <button
              type="button"
              onClick={() => onEdit?.(expense)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
              title="Edit expense"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(expense)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              title="Delete expense"
            >
              <FiTrash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseCard;