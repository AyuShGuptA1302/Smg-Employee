import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl mb-4" style={{ color: 'var(--smg-royal)' }}>
          404
        </h1>
        <h2 className="text-2xl mb-2" style={{ color: 'var(--smg-dark)' }}>
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/employee/dashboard')}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity mx-auto"
          style={{ backgroundColor: 'var(--smg-royal)' }}
        >
          <Home size={18} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
