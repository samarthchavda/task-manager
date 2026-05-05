import React from 'react';

// Reusable loading spinner component
const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className={`${sizeClasses[size]} border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin`} />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
