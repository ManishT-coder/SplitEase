import React from 'react';

const Alert = ({ type = 'info', title, children, onClose }) => {
  const styles = {
    info: 'border-sky-200 bg-sky-50 text-sky-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    error: 'border-red-200 bg-red-50 text-red-800'
  };

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${styles[type]}`}>
      <span className="mt-0.5">{icons[type] || 'ℹ️'}</span>
      <div className="flex-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {children && <div className="text-sm">{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-sm opacity-60 hover:opacity-100"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;