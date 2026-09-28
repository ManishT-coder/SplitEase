import React from 'react';

const Loading = ({ label = 'Loading...', fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <svg
        className="h-10 w-10 animate-spin text-brand-600"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">{content}</div>
    );
  }
  return content;
};

export default Loading;