import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiDollarSign, FiPlus } from 'react-icons/fi';
import { useGroups } from '../context/GroupContext';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import Alert from '../components/common/Alert';
import Avatar from '../components/common/Avatar';
import ExpenseForm from '../components/expense/ExpenseForm';
import ExpenseCard from '../components/expense/ExpenseCard';
import MemberList from '../components/group/MemberList';
import AddMemberForm from '../components/group/AddMemberForm';
import SettlementCard from '../components/settlement/SettlementCard';
import expenseService from '../services/expenseService';
import { formatCurrency } from '../utils/formatters';

const TABS = {
  EXPENSES: 'Expenses',
  MEMBERS: 'Members',
  SETTLEMENTS: 'Settlements'
};

const GroupDetail = () => {
  const { groupId } = useParams();
  const { fetchGroupDetails, activeGroup } = useGroups();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(TABS.EXPENSES);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [settlementLoading, setSettlementLoading] = useState(false);
  const [settlementLoaded, setSettlementLoaded] = useState(false);
  const [payingId, setPayingId] = useState(null);
  const [error, setError] = useState('');

  const loadGroup = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await fetchGroupDetails(groupId);
    } catch (err) {
      setError('Failed to load group. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [fetchGroupDetails, groupId]);

  useEffect(() => {
    loadGroup();
  }, [loadGroup]);

  const handleCalculateSettlements = async () => {
    setError('');
    setSettlementLoading(true);
    try {
      const result = await expenseService.calculateSettlements(groupId);
      setSettlements(result.settlements || []);
      setSettlementLoaded(true);
    } catch {
      setError('Failed to calculate settlements. Please try again.');
    } finally {
      setSettlementLoading(false);
    }
  };

  const handleMarkPaid = async (settlementId) => {
    setPayingId(settlementId);
    setError('');
    try {
      await expenseService.markSettlementPaid(settlementId);
      await handleCalculateSettlements();
    } catch {
      setError('Failed to mark settlement as paid. Please try again.');
    } finally {
      setPayingId(null);
    }
  };

  const handleDeleteExpense = async (expense) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    setError('');
    try {
      await expenseService.remove(expense._id);
      await loadGroup();
    } catch {
      setError('Failed to delete expense. Please try again.');
    }
  };

  if (loading && !activeGroup) return <Loading fullPage />;
  if (!activeGroup) return null;

  const expenses = activeGroup.expenses || [];
  const members = activeGroup.members || [];
  const balances = activeGroup.balances || {};
  const myBalanceEntry = Object.values(balances).find(
    (b) => String(b.memberId) === String(user?._id)
  );
  const myBalance = myBalanceEntry?.balance ?? 0;

  const balanceList = Object.values(balances).sort(
    (a, b) => b.balance - a.balance
  );

  return (
    <div>
      <Link
        to="/groups"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
      >
        <FiArrowLeft />
        Back to Groups
      </Link>

      {error && (
        <div className="mb-4">
          <Alert type="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </div>
      )}

      <div className="card mb-8 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-100 text-2xl font-bold text-brand-700">
              {activeGroup.name?.[0]?.toUpperCase() || 'G'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {activeGroup.name}
              </h1>
              {activeGroup.description && (
                <p className="text-sm text-slate-500">{activeGroup.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {members.slice(0, 4).map((member) => (
                <Avatar key={member._id} user={member} size="sm" />
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
              <FiUsers />
              {members.length} members
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-lg border border-brand-100 bg-brand-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white">
              <FiDollarSign />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Your Balance</p>
              <p
                className={`text-xl font-bold ${
                  myBalance > 0
                    ? 'text-emerald-600'
                    : myBalance < 0
                      ? 'text-red-600'
                      : 'text-slate-800'
                }`}
              >
                {myBalance > 0 ? '+' : myBalance < 0 ? '-' : ''}
                {formatCurrency(Math.abs(myBalance))}
              </p>
            </div>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block">
            {myBalance > 0
              ? 'You are owed this amount'
              : myBalance < 0
                ? 'You owe this amount'
                : 'You are all settled up'}
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-1 border-b border-slate-200">
        {Object.values(TABS).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === TABS.EXPENSES && (
        <div>
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setEditingExpense(null);
                setIsExpenseOpen(true);
              }}
              className="btn-primary"
            >
              <FiPlus />
              Add Expense
            </button>
          </div>

          {expenses.length === 0 ? (
            <EmptyState
              icon="💸"
              title="No expenses yet"
              subtitle="Add your first expense to start splitting costs."
              action={
                <button
                  type="button"
                  onClick={() => setIsExpenseOpen(true)}
                  className="btn-primary"
                >
                  <FiPlus />
                  Add Expense
                </button>
              }
            />
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <ExpenseCard
                  key={expense._id}
                  expense={expense}
                  onEdit={(exp) => {
                    setEditingExpense(exp);
                    setIsExpenseOpen(true);
                  }}
                  onDelete={handleDeleteExpense}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === TABS.MEMBERS && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="card p-5 lg:col-span-2">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Members ({members.length})
            </h2>
            <MemberList
              members={members}
              groupId={groupId}
              createdBy={activeGroup.createdBy?._id || activeGroup.createdBy}
            />
          </div>
          <div className="card h-fit p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Add Member
            </h2>
            <AddMemberForm groupId={groupId} onAdded={loadGroup} />
          </div>
        </div>
      )}

      {activeTab === TABS.SETTLEMENTS && (
        <div className="space-y-6">
          {balanceList.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Balance Summary
              </h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {balanceList.map((b) => (
                  <div
                    key={b.memberId}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {b.name}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        b.balance > 0
                          ? 'text-emerald-600'
                          : b.balance < 0
                            ? 'text-red-600'
                            : 'text-slate-400'
                      }`}
                    >
                      {b.balance > 0 ? '+' : ''}
                      {formatCurrency(b.balance)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCalculateSettlements}
              disabled={settlementLoading}
              className="btn-primary"
            >
              <FiDollarSign />
              {settlementLoading ? 'Calculating...' : 'Calculate Settlements'}
            </button>
          </div>

          {settlementLoaded && settlements.length === 0 ? (
            <EmptyState
              icon="✅"
              title="All settled up!"
              subtitle="No payments need to be made in this group."
            />
          ) : (
            <div className="space-y-3">
              {settlements.map((settlement) => (
                <SettlementCard
                  key={settlement._id}
                  settlement={settlement}
                  currentUserId={user?._id}
                  loading={payingId === settlement._id}
                  onMarkPaid={handleMarkPaid}
                />
              ))}
              {!settlementLoaded && settlements.length === 0 && (
                <EmptyState
                  icon="🧮"
                  title="No settlements calculated yet"
                  subtitle="Click Calculate Settlements to see who owes whom."
                />
              )}
            </div>
          )}
        </div>
      )}

      <Modal
        open={isExpenseOpen}
        onClose={() => {
          setIsExpenseOpen(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm
          group={activeGroup}
          expense={editingExpense}
          onDone={loadGroup}
          onClose={() => {
            setIsExpenseOpen(false);
            setEditingExpense(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default GroupDetail;