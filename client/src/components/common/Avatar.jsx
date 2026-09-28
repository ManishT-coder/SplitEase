import React from 'react';
import { avatarUrl } from '../../utils/formatters';

const Avatar = ({ user, name, size = 'md', className = '' }) => {
  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-20 w-20 text-2xl'
  };

  const displayName = user?.name || name || '?';

  return (
    <img
      src={avatarUrl(user)}
      alt={displayName}
      title={displayName}
      className={`${sizes[size] || sizes.md} rounded-full object-cover ring-2 ring-white ${className}`}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;
      }}
    />
  );
};

export default Avatar;