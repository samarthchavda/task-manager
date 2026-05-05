import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import DashboardCard from '../components/DashboardCard';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([axiosInstance.get('/projects'), axiosInstance.get('/tasks')]);
        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const sortedTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const overdueTasks = sortedTasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed');

  const counts = {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    pendingTasks: tasks.filter((task) => task.status === 'Pending').length,
    inProgressTasks: tasks.filter((task) => task.status === 'In Progress').length,
    completedTasks: tasks.filter((task) => task.status === 'Completed').length,
    overdueTasks: overdueTasks.length,
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-600">A quick view of projects, task status, and overdue work.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DashboardCard title="Projects" value={counts.totalProjects} icon="PRJ" tone="slate" />
          <DashboardCard title="Tasks" value={counts.totalTasks} icon="TSK" tone="indigo" />
          <DashboardCard title="Pending" value={counts.pendingTasks} icon="PND" tone="zinc" />
          <DashboardCard title="In Progress" value={counts.inProgressTasks} icon="IPR" tone="sky" />
          <DashboardCard title="Completed" value={counts.completedTasks} icon="CMP" tone="indigo" />
          <DashboardCard title="Overdue" value={counts.overdueTasks} icon="OVD" tone="zinc" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Overdue Tasks</h2>
              <span className="text-sm text-slate-500">{overdueTasks.length} total</span>
            </div>

            {overdueTasks.length === 0 ? (
              <p className="text-sm text-slate-500">No overdue tasks right now.</p>
            ) : (
              <div className="space-y-4">
                {overdueTasks.slice(0, 4).map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent Tasks</h2>
              <span className="text-sm text-slate-500">Latest 5</span>
            </div>

            {sortedTasks.length === 0 ? (
              <p className="text-sm text-slate-500">No tasks have been created yet.</p>
            ) : (
              <div className="space-y-3">
                {sortedTasks.slice(0, 5).map((task) => (
                  <div key={task._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{task.title}</p>
                        <p className="text-sm text-slate-500">{task.projectId?.title || 'Project'}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Assigned to: <span className="font-semibold">{task.assignedTo?.name || 'Unassigned'}</span>
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                        {task.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'not set'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;