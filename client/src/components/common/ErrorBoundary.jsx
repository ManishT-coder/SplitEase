import React, { Component } from 'react';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="text-4xl">⚠️</p>
          <h2 className="text-xl font-semibold text-slate-800">
            Something went wrong
          </h2>
          <p className="max-w-md text-sm text-slate-500">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;