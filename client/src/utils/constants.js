export const EXPENSE_CATEGORIES = [
  { value: 'food', label: 'Food & Dining', icon: '🍔' },
  { value: 'travel', label: 'Travel & Transport', icon: '🚗' },
  { value: 'housing', label: 'Housing & Utilities', icon: '🏠' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎮' },
  { value: 'shopping', label: 'Shopping', icon: '🛒' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'health', label: 'Health', icon: '🏥' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'gifts', label: 'Gifts', icon: '🎁' },
  { value: 'other', label: 'Other', icon: '📦' }
];

export const getCategory = (value) =>
  EXPENSE_CATEGORIES.find((c) => c.value === value) || EXPENSE_CATEGORIES[9];

export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];

export const NAV_LINKS = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/groups', label: 'Groups', icon: 'groups' },
  { path: '/add-expense', label: 'Add Expense', icon: 'add' },
  { path: '/profile', label: 'Profile', icon: 'profile' }
];