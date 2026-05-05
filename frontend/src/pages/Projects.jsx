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

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await axiosInstance.delete(`/projects/${id}`);
        setProjects(projects.filter((p) => p._id !== id));
        toast.success('Project deleted');
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Projects</h1>
          <Link to="/create-project" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">No projects yet</p>
            <Link to="/create-project" className="text-blue-600 hover:underline">
              Create the first project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                <p className="text-sm text-gray-500 mb-4">Members: {project.members?.length || 0}</p>
                <div className="flex gap-2">
                  <Link
                    to={`/projects/${project._id}`}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-center text-sm hover:bg-blue-700"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
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
