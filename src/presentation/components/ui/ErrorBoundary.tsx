'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="p-6 text-center border border-dashed border-[var(--bq-paper-300)] rounded-2xl bg-[var(--bq-paper-50)]">
          <div className="text-sm font-semibold text-[var(--bq-paper-700)] mb-1">
            Bagian ini gagal dimuat
          </div>
          <div className="text-xs text-[var(--bq-paper-500)] mb-3">
            Tenang, fitur lain tetap berfungsi.
          </div>
          <button
            onClick={this.handleReset}
            className="text-xs font-semibold text-[var(--bq-brown-500)] hover:underline"
          >
            Coba lagi
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
