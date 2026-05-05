import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import DashboardCard from '../components/DashboardCard';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [memberTaskSummary, setMemberTaskSummary] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '', projectId: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        axiosInstance.get('/projects'),
        axiosInstance.get('/tasks'),
      ]);

      const projectsData = projectsRes.data;
      const tasksData = tasksRes.data;

      // Calculate statistics
      const now = new Date();
      const overdueTasks = tasksData.filter(
        (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Completed'
      ).length;

      setStats({
        totalProjects: projectsData.length,
        totalTasks: tasksData.length,
        pendingTasks: tasksData.filter((t) => t.status === 'Pending').length,
        inProgressTasks: tasksData.filter((t) => t.status === 'In Progress').length,
        completedTasks: tasksData.filter((t) => t.status === 'Completed').length,
        overdueTasks,
      });

      // Calculate member-wise task summary
      const memberSummary = {};
      tasksData.forEach((task) => {
        if (task.assignedTo) {
          if (!memberSummary[task.assignedTo._id]) {
            memberSummary[task.assignedTo._id] = {
              name: task.assignedTo.name,
              total: 0,
              completed: 0,
              pending: 0,
            };
          }
          memberSummary[task.assignedTo._id].total += 1;
          if (task.status === 'Completed') memberSummary[task.assignedTo._id].completed += 1;
          if (task.status === 'Pending') memberSummary[task.assignedTo._id].pending += 1;
        }
      });

      setMemberTaskSummary(Object.values(memberSummary).sort((a, b) => b.total - a.total));
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
      toast.success('Task status updated!');
      fetchDashboardData(); // Refresh to update member summaries
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.projectId && task.projectId._id !== filters.projectId) return false;
    return true;
  });

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your task overview.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard title="Total Projects" value={stats.totalProjects} icon="📁" color="blue" />
          <DashboardCard title="Total Tasks" value={stats.totalTasks} icon="📋" color="purple" />
          <DashboardCard title="Pending" value={stats.pendingTasks} icon="⏳" color="yellow" />
          <DashboardCard title="In Progress" value={stats.inProgressTasks} icon="🔄" color="blue" />
          <DashboardCard title="Completed" value={stats.completedTasks} icon="✅" color="green" />
          <DashboardCard title="Overdue" value={stats.overdueTasks} icon="⚠️" color="red" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b bg-white rounded-t-lg">
          {['overview', 'tasks', 'members'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'overview' ? 'Overview' : tab === 'tasks' ? 'All Tasks' : 'Team Performance'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Overview</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Completion Rate:</span>
                    <span className="font-bold text-green-600">
                      {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Tasks in Progress:</span>
                    <span className="font-bold text-blue-600">{stats.inProgressTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Overdue Tasks:</span>
                    <span className={`font-bold ${stats.overdueTasks > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {stats.overdueTasks}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Projects */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Active Projects</h3>
                {projects.length === 0 ? (
                  <p className="text-gray-500 text-sm">No projects created yet.</p>
                ) : (
                  <div className="space-y-2">
                    {projects.slice(0, 3).map((p) => (
                      <div key={p._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-semibold text-gray-800">{p.title}</p>
                          <p className="text-xs text-gray-500">{p.members?.length || 0} members</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Priority Breakdown */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-4">Priority Breakdown</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>High Priority
                    </span>
                    <span className="font-bold">
                      {tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>Medium Priority
                    </span>
                    <span className="font-bold">
                      {tasks.filter((t) => t.priority === 'Medium' && t.status !== 'Completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>Low Priority
                    </span>
                    <span className="font-bold">
                      {tasks.filter((t) => t.priority === 'Low' && t.status !== 'Completed').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="font-bold mb-4">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project</label>
                  <select
                    value={filters.projectId}
                    onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Projects</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setFilters({ status: '', priority: '', projectId: '' })}
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Filters
              </button>
            </div>

            {/* Task List */}
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500 text-lg">No tasks found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-6 text-gray-800">Team Performance</h3>
            {memberTaskSummary.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No members have tasks assigned yet.</p>
            ) : (
              <div className="space-y-4">
                {memberTaskSummary.map((member) => (
                  <div key={member.name} className="border rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">{member.name}</h4>
                        <p className="text-sm text-gray-600">
                          {member.total} {member.total === 1 ? 'task' : 'tasks'} assigned
                        </p>
                      </div>
                      <span className="text-3xl font-bold text-blue-600">
                        {member.total > 0 ? Math.round((member.completed / member.total) * 100) : 0}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{ width: `${member.total > 0 ? (member.completed / member.total) * 100 : 0}%` }}
                      />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-green-50 p-3 rounded">
                        <span className="text-gray-600">Completed</span>
                        <p className="font-bold text-green-600 text-lg">{member.completed}</p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded">
                        <span className="text-gray-600">Pending</span>
                        <p className="font-bold text-yellow-600 text-lg">{member.pending}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <span className="text-gray-600">In Progress</span>
                        <p className="font-bold text-blue-600 text-lg">{member.total - member.completed - member.pending}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
