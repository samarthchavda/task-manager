import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get('/projects');
      setProjects(res.data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
            <p className="mt-2 text-slate-600">Each project groups a team and the tasks assigned to that team.</p>
          </div>
          <Link to="/create-project" className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
            New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-slate-200">
            <p className="mb-4 text-slate-500">No projects yet</p>
            <Link to="/create-project" className="text-slate-900 underline underline-offset-4">
              Create the first project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <div key={project._id} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900">{project.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{project.description || 'No description provided.'}</p>
                <div className="mt-4 text-sm text-slate-500">
                  Team members: {project.members?.length || 0}
                </div>
                <div className="mt-5 flex gap-3">
                  <Link
                    to={`/create-task?projectId=${project._id}`}
                    className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-center text-sm text-white hover:bg-slate-800"
                  >
                    Create Task
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
