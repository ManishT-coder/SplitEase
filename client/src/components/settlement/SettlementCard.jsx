import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatters';

const SettlementCard = ({ settlement, onMarkPaid, currentUserId, loading = false }) => {
  const fromId = String(settlement.from?._id || settlement.from);
  const toId = String(settlement.to?._id || settlement.to);

  const isInvolved =
    String(currentUserId) === fromId || String(currentUserId) === toId;
  const canPay = isInvolved && !settlement.isSettled;

  return (
    <div
      className={`card flex items-center gap-4 p-4 ${
        settlement.isSettled
          ? 'border-emerald-200 bg-emerald-50/50'
          : 'border-slate-200 bg-white'
      }`}
    >
      <Avatar user={settlement.from} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1 text-sm">
          <span className="font-semibold text-slate-800">
            {settlement.from?.name || 'Unknown'}
          </span>
          <span className="text-slate-400">→</span>
          <span className="font-semibold text-slate-800">
            {settlement.to?.name || 'Unknown'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-brand-700">
            {formatCurrency(settlement.amount)}
          </span>
          {settlement.isSettled && (
            <span className="flex items-center gap-1 text-emerald-600">
              <FiCheckCircle size={12} />
              Settled
            </span>
          )}
        </div>
      </div>
      {canPay && (
        <Button
          variant="success"
          onClick={() => onMarkPaid?.(settlement._id)}
          disabled={loading}
          className="text-xs"
        >
          <FiCheckCircle size={14} />
          Mark Paid
        </Button>
      )}
    </div>
  );
};

export default SettlementCard;