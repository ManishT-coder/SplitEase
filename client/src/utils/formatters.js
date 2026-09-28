export const formatCurrency = (amount, currency = 'INR') => {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatDate = (date, withTime = false) => {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {})
  });
};

export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};

export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  const responseError = error?.response?.data?.error;
  if (responseError) return responseError;
  const details = error?.response?.data?.details;
  if (details && typeof details === 'object') {
    return Object.values(details)[0];
  }
  if (error?.message && error.message !== 'Network Error') return error.message;
  return fallback;
};

export const initials = (name = '') => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
};

export const avatarUrl = (user) => {
  if (user?.avatar) return user.avatar;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '?')}&background=random`;
};

export const getColorForName = (name = '') => {
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-purple-100 text-purple-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-cyan-100 text-cyan-700'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};