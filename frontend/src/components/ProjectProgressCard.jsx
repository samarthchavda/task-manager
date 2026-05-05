import React from 'react';

// Component to display project progress and statistics
const ProjectProgressCard = ({ project, tasksCount, completedTasksCount }) => {
  const progress = tasksCount > 0 ? Math.round((completedTasksCount / tasksCount) * 100) : 0;
  const memberCount = project.members?.length || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <h3 className="text-lg font-bold mb-2 text-gray-800">{project.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{project.description}</p>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="bg-blue-50 p-2 rounded">
          <p className="text-gray-600">Tasks</p>
          <p className="font-bold text-lg text-blue-600">{tasksCount}</p>
        </div>
        <div className="bg-purple-50 p-2 rounded">
          <p className="text-gray-600">Members</p>
          <p className="font-bold text-lg text-purple-600">{memberCount}</p>
        </div>
      </div>

      {/* Member List */}
      {memberCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.members?.slice(0, 3).map((member) => (
            <span key={member._id} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
              {member.name.split(' ')[0]}
            </span>
          ))}
          {memberCount > 3 && <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">+{memberCount - 3}</span>}
        </div>
      )}
    </div>
  );
};

export default ProjectProgressCard;
