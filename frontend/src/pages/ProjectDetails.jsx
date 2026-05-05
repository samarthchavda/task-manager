import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        axiosInstance.get(`/projects/${id}`),
        axiosInstance.get(`/tasks?projectId=${id}`),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!project) return <div className="text-center py-10">Project not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/projects" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Projects
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <p className="text-sm text-gray-500 mb-4">Created by: {project.createdBy?.name}</p>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Team Members ({project.members?.length || 0})</h3>
            <div className="flex flex-wrap gap-2">
              {project.members?.map((member) => (
                <span key={member._id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                  {member.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Tasks</h2>
            <Link
              to={`/create-task?projectId=${id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Task
            </Link>
          </div>

          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks in this project</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Assigned To</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Priority</th>
                    <th className="px-4 py-2">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{task.title}</td>
                      <td className="px-4 py-2">{task.assignedTo?.name || 'Unassigned'}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-white text-xs font-medium ${
                            task.status === 'Completed'
                              ? 'bg-green-500'
                              : task.status === 'In Progress'
                              ? 'bg-blue-500'
                              : 'bg-yellow-500'
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            task.priority === 'High'
                              ? 'bg-red-100 text-red-700'
                              : task.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
