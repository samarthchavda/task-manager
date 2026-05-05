import React from 'react';

// Reusable task status badge component
const StatusBadge = ({ status, priority }) => {
  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
  };

  const priorityStyles = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex gap-2">
      {status && (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || ''}`}>
          {status}
        </span>
      )}
      {priority && (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityStyles[priority] || ''}`}>
          {priority} Priority
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
