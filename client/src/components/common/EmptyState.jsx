import React from 'react';

const EmptyState = ({
  icon = '🗂️',
  title = 'Nothing here yet',
  subtitle,
  description,
  action
}) => {
  const text = subtitle || description;
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <span className="text-5xl">{icon}</span>
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      {text && <p className="max-w-sm text-sm text-slate-500">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;