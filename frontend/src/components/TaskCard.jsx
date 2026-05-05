import React from 'react';
import StatusBadge from './StatusBadge';

// Reusable task card component for displaying task information
const TaskCard = ({ task, onStatusChange, onDelete, isAssigned = false, editable = false }) => {
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  const isOverdue = dueDate < today && task.status !== 'Completed';
  const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-5 mb-4 border-l-4 transition hover:shadow-lg ${
        isOverdue ? 'border-red-500 bg-red-50' : 'border-blue-500'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
          {task.description && <p className="text-gray-600 text-sm mt-1">{task.description}</p>}
        </div>
        {isOverdue && <span className="text-red-600 text-xs font-bold bg-red-200 px-2 py-1 rounded">OVERDUE</span>}
      </div>

      <div className="mb-3">
        <StatusBadge status={task.status} priority={task.priority} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
        <div>
          <span className="font-semibold">Project:</span> {task.projectId?.title || 'Unknown'}
        </div>
        {task.assignedTo && (
          <div>
            <span className="font-semibold">Assigned to:</span> {task.assignedTo?.name}
          </div>
        )}
        <div>
          <span className="font-semibold">Due:</span>{' '}
          {task.dueDate ? (
            <span className={isOverdue ? 'text-red-600 font-bold' : ''}>
              {dueDate.toLocaleDateString()} {isOverdue && `(${Math.abs(daysUntilDue)} days ago)`}
            </span>
          ) : (
            'No due date'
          )}
        </div>
      </div>

      {editable && (
        <div className="flex gap-2 pt-3 border-t">
          {isAssigned && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className="flex-1 px-3 py-2 border rounded text-sm font-medium bg-blue-50 border-blue-300 focus:outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task._id)}
              className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
