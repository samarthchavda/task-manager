import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  const admins = users.filter((u) => u.role === 'Admin');
  const members = users.filter((u) => u.role === 'Member');

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Team Users</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admins */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-red-100 text-red-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                👑
              </span>
              Administrators ({admins.length})
            </h2>
            {admins.length === 0 ? (
              <p className="text-gray-500">No administrators</p>
            ) : (
              <div className="space-y-3">
                {admins.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-3 bg-red-50 rounded">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm font-medium">
                      Admin
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Members */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                👤
              </span>
              Members ({members.length})
            </h2>
            {members.length === 0 ? (
              <p className="text-gray-500">No members</p>
            ) : (
              <div className="space-y-3">
                {members.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm font-medium">
                      Member
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">👥 Total Users: {users.length}</h3>
          <p className="text-gray-600">
            Your team has <strong>{admins.length}</strong> administrator(s) and <strong>{members.length}</strong> member(s).
          </p>
        </div>
      </div>
    </div>
  );
};

export default Users;
