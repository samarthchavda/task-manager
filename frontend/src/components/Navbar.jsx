import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="border-b bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/dashboard" className="text-2xl font-bold">
            Team Task Manager
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className={`px-3 py-2 rounded ${location.pathname === '/dashboard' ? 'bg-slate-700' : ''}`}>
              Dashboard
            </Link>
            {user.role === 'Admin' && (
              <>
                <Link to="/projects" className={`px-3 py-2 rounded ${location.pathname === '/projects' ? 'bg-slate-700' : ''}`}>
                  Projects
                </Link>
                <Link to="/create-project" className={`px-3 py-2 rounded ${location.pathname === '/create-project' ? 'bg-slate-700' : ''}`}>
                  New Project
                </Link>
                <Link to="/create-task" className={`px-3 py-2 rounded ${location.pathname === '/create-task' ? 'bg-slate-700' : ''}`}>
                  New Task
                </Link>
              </>
            )}
            <Link to="/my-tasks" className={`px-3 py-2 rounded ${location.pathname === '/my-tasks' ? 'bg-slate-700' : ''}`}>
              My Tasks
            </Link>
            <div className="flex items-center space-x-3">
              <span className="text-sm">{user.name}</span>
              <span className="bg-slate-700 px-2 py-1 rounded text-xs">{user.role}</span>
            </div>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
