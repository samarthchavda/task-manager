import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MyTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const res = await axiosInstance.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
      toast.success('Task status updated!');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    return true;
  });

  if (loading) return <LoadingSpinner message="Loading your tasks..." />;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">My Tasks</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border px-4 py-2 rounded"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="border px-4 py-2 rounded"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">No tasks assigned to you</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} isAssigned editable />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
