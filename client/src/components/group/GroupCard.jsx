import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiDollarSign } from 'react-icons/fi';
import { formatCurrency, timeAgo } from '../../utils/formatters';
import Avatar from '../common/Avatar';

const GroupCard = ({ group }) => {
  return (
    <Link
      to={`/groups/${group._id}`}
      className="card flex flex-col gap-3 p-5 transition hover:border-brand-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-xl text-brand-700">
            {group.name?.[0]?.toUpperCase() || 'G'}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{group.name}</h3>
            {group.description && (
              <p className="line-clamp-1 text-xs text-slate-500">
                {group.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <FiUsers size={14} />
          {group.members?.length || 0} members
        </span>
        <span className="flex items-center gap-1">
          <FiDollarSign size={14} />
          {formatCurrency(group.totalExpenses || 0)}
        </span>
      </div>

      {group.members?.length > 0 && (
        <div className="flex -space-x-2">
          {group.members.slice(0, 4).map((m) => (
            <Avatar key={m._id} user={m} size="xs" className="border-2 border-white" />
          ))}
          {group.members.length > 4 && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
              +{group.members.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="text-xs text-slate-400">
        Created {timeAgo(group.createdAt)}
      </div>
    </Link>
  );
};

export default GroupCard;