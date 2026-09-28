import React from 'react';
import { Link } from 'react-router-dom';
import { FiFolder, FiUsers, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useGroups } from '../context/GroupContext';
import { formatCurrency, getColorForName } from '../utils/formatters';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';

const StatsCard = ({ icon, label, value, iconClassName }) => (
  <div className="card flex items-center gap-4 p-5">
    <span
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
    >
      {icon}
    </span>
    <div className="min-w-0">
      <p className="truncate text-sm text-slate-500">{label}</p>
      <p className="truncate font-semibold text-slate-800">{value}</p>
    </div>
  </div>
);

const RecentGroupCard = ({ group }) => (
  <Link
    to={`/groups/${group._id}`}
    className="card flex flex-col gap-3 p-5 transition hover:border-brand-200 hover:shadow-md"
  >
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${getColorForName(
            group.name
          )}`}
        >
          <span className="text-lg font-bold">{group.name?.[0]?.toUpperCase() || 'G'}</span>
        </div>
        <h3 className="truncate font-semibold text-slate-800">{group.name}</h3>
      </div>
      <FiArrowRight className="mt-1 shrink-0 text-slate-400" />
    </div>
    <div className="flex items-center gap-4 text-sm text-slate-500">
      <span className="flex items-center gap-1">
        <FiUsers size={14} />
        {group.members?.length || 0} member{(group.members?.length || 0) === 1 ? '' : 's'}
      </span>
      <span className="flex items-center gap-1">
        <FiDollarSign size={14} />
        {formatCurrency(group.totalExpenses || 0)}
      </span>
    </div>
  </Link>
);

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { groups, loading: groupsLoading } = useGroups();

  if (loading || groupsLoading) {
    return <Loading fullPage />;
  }

  const firstName = user?.name?.split(' ')[0] || 'there';
  const totalGroups = groups.length;
  const uniqueMembers = new Set();
  groups.forEach((group) =>
    (group.members || []).forEach((member) => uniqueMembers.add(member._id || member))
  );
  const recentGroups = groups.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, {firstName}!
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track your shared expenses and settle up easily.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          icon={<FiFolder size={22} />}
          label="Total Groups"
          value={totalGroups}
          iconClassName="bg-brand-100 text-brand-700"
        />
        <StatsCard
          icon={<FiUsers size={22} />}
          label="Total Members"
          value={uniqueMembers.size}
          iconClassName="bg-emerald-100 text-emerald-700"
        />
        <StatsCard
          icon={<FiDollarSign size={22} />}
          label="Quick Balance"
          value="View a group for details"
          iconClassName="bg-amber-100 text-amber-700"
        />
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Recent Groups</h2>
          {groups.length > 4 && (
            <Link
              to="/groups"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all <FiArrowRight size={14} />
            </Link>
          )}
        </div>

        {totalGroups === 0 ? (
          <EmptyState
            icon="🗂️"
            title="No groups yet"
            subtitle="Create your first group to start splitting expenses with friends."
            action={
              <Link to="/groups/new" className="btn btn-primary">
                Create a Group
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentGroups.map((group) => (
              <RecentGroupCard key={group._id} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;