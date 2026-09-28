import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiCreditCard } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/groups', label: 'Groups' },
    { to: '/add-expense', label: 'Add Expense' },
    { to: '/profile', label: 'Profile' }
  ];

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-white/10 text-white'
        : 'text-white/70 hover:text-white hover:bg-white/5'
    }`;

  return (
    <nav className="bg-brand-700 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <FiCreditCard className="text-white" size={20} />
              </span>
              <span className="text-xl font-bold text-white">SplitEase</span>
            </Link>
          </div>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/10"
            >
              <span className="text-sm font-medium text-white/90">
                {user?.name?.split(' ')[0]}
              </span>
              <Avatar user={user} size="sm" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-white md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-brand-800 md:hidden">
          <div className="space-y-1 px-4 py-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;