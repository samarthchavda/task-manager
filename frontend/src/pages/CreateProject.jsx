import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';

const CreateProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/users');
      setAllUsers(res.data);
    } catch (err) {
      console.log('Failed to load users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Project title is required');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/projects', { title, description, members });
      toast.success('Project created!');
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
    setLoading(false);
  };

  const toggleMember = (userId) => {
    setMembers((prev) =>
      prev.includes(userId) ? prev.filter((m) => m !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Create New Project</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Project Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 h-24"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Add Team Members</label>
            <div className="space-y-2">
              {allUsers.map((user) => (
                <label key={user._id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={members.includes(user._id)}
                    onChange={() => toggleMember(user._id)}
                    className="mr-2"
                  />
                  <span>{user.name} ({user.role})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded font-medium hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
