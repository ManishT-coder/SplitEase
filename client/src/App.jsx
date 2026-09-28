import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import Loading from './components/common/Loading';
import { useAuth } from './hooks/useAuth';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Groups = lazy(() => import('./pages/Groups'));
const GroupDetail = lazy(() => import('./pages/GroupDetail'));
const AddExpense = lazy(() => import('./pages/AddExpense'));
const Settlements = lazy(() => import('./pages/Settlements'));
const Profile = lazy(() => import('./pages/Profile'));

const AppLayout = ({ children }) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <ErrorBoundary>{children}</ErrorBoundary>
    </main>
    <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
      SplitEase — Split expenses with friends, effortlessly 💰
    </footer>
  </div>
);

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <Loading label="Loading..." />
          </div>
        }
      >
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Groups />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups/:groupId"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <GroupDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settlements"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Settlements />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-expense"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AddExpense />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;