import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 24, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin h-${size/4} w-${size/4}`} />
    </div>
  );
};

export const LoadingCard = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <LoadingSpinner size={32} className="py-8" />
      {children && (
        <div className="text-center text-gray-500 mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export const LoadingPage = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size={48} className="mb-4" />
        <p className="text-lg text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;