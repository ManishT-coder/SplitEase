import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { useGroups } from '../context/GroupContext';
import { useAuth } from '../hooks/useAuth';
import expenseService from '../services/expenseService';
import groupService from '../services/groupService';
import { formatCurrency, getErrorMessage } from '../utils/formatters';
import SettlementCard from '../components/settlement/SettlementCard';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';

const Settlements = () => {
  const { groupId: urlGroupId } = useParams();
  const { groups, loading: groupsLoading } = useGroups();
  const { user } = useAuth();

  const [selectedGroupId, setSelectedGroupId] = useState(urlGroupId || '');
  const [groupDetails, setGroupDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [settlements, setSettlements] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [payingId, setPayingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const selectedGroup = groups.find((g) => g._id === selectedGroupId);

  useEffect(() => {
    if (urlGroupId) setSelectedGroupId(urlGroupId);
  }, [urlGroupId]);

  useEffect(() => {
    if (selectedGroupId) {
      setSettlements(null);
      setError(null);
      setSuccess(null);
    }
  }, [selectedGroupId]);

  useEffect(() => {
    if (!selectedGroupId) {
      setGroupDetails(null);
      return;
    }
    let cancelled = false;
    const loadDetails = async () => {
      setDetailsLoading(true);
      try {
        const data = await groupService.getById(selectedGroupId);
        if (!cancelled) setGroupDetails(data);
      } catch {
        if (!cancelled) setGroupDetails(null);
      } finally {
        if (!cancelled) setDetailsLoading(false);
      }
    };
    loadDetails();
    return () => { cancelled = true; };
  }, [selectedGroupId]);

  const handleCalculate = async () => {
    if (!selectedGroupId) return;
    setCalculating(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await expenseService.calculateSettlements(selectedGroupId);
      const result = data.settlements || data;
      setSettlements(Array.isArray(result) ? result : []);
      if (Array.isArray(result) && result.length === 0) {
        setSuccess('All settled up!');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCalculating(false);
    }
  };

  const handleMarkPaid = async (settlementId) => {
    setPayingId(settlementId);
    setError(null);
    try {
      await expenseService.markSettlementPaid(settlementId);
      await handleCalculate();
      setSuccess('Settlement marked as paid');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPayingId(null);
    }
  };

  if (groupsLoading) return <Loading label="Loading groups..." fullPage />;

  const balanceList = groupDetails?.balances
    ? Object.values(groupDetails.balances).sort((a, b) => b.balance - a.balance)
    : [];

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
          <FiCheckCircle size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Settlements</h1>
          <p className="text-sm text-slate-500">Calculate and track payments between members</p>
        </div>
      </div>

      <div className="card p-6">
        <label className="label">Select Group</label>
        <select
          className="input"
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
        >
          <option value="">-- choose a group --</option>
          {groups.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert type="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {!selectedGroupId && (
        <EmptyState
          icon="💸"
          title="Select a group to see settlements"
          subtitle="Pick a group from the dropdown above to view and manage settlements"
        />
      )}

      {selectedGroupId && (
        <>
          {selectedGroup && (
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{selectedGroup.name}</h2>
                <p className="text-sm text-slate-500">
                  {selectedGroup.members?.length || 0} member
                  {(selectedGroup.members?.length || 0) !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                variant="primary"
                onClick={handleCalculate}
                disabled={calculating}
              >
                <FiArrowRight size={16} />
                {calculating ? 'Calculating...' : 'Calculate Settlements'}
              </Button>
            </div>
          )}

          {calculating && <Loading label="Calculating optimal settlements..." />}

          {!calculating && settlements && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Settlements
              </h3>
              {settlements.length === 0 ? (
                <EmptyState
                  icon="✅"
                  title="All settled up!"
                  subtitle="No payments need to be made in this group"
                />
              ) : (
                settlements.map((s) => (
                  <SettlementCard
                    key={s._id}
                    settlement={s}
                    onMarkPaid={handleMarkPaid}
                    currentUserId={user?._id}
                    loading={payingId === s._id}
                  />
                ))
              )}
            </div>
          )}

          {!calculating && balanceList.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Balance Summary
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {balanceList.map((entry) => {
                  const value = Number(entry.balance);
                  return (
                    <div
                      key={entry.memberId}
                      className="card flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                          {entry.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {entry.name}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          value > 0
                            ? 'text-emerald-600'
                            : value < 0
                              ? 'text-red-600'
                              : 'text-slate-400'
                        }`}
                      >
                        {value > 0 ? '+' : ''}{formatCurrency(value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!calculating && detailsLoading && (
            <Loading label="Loading balance summary..." />
          )}
        </>
      )}
    </div>
  );
};

export default Settlements;
