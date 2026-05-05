import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import CreateTask from './pages/CreateTask';
import MyTasks from './pages/MyTasks';
import NotFound from './pages/NotFound';

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <RoleBasedRoute allowedRoles={['Admin']}>
              <Projects />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/create-project"
          element={
            <RoleBasedRoute allowedRoles={['Admin']}>
              <CreateProject />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/create-task"
          element={
            <RoleBasedRoute allowedRoles={['Admin']}>
              <CreateTask />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/my-tasks"
          element={
            <ProtectedRoute>
              <MyTasks />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
