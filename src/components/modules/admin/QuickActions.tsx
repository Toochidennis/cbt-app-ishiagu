import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions: React.FC = () => {
    const actions = [
        { label: 'Create New User', icon: 'fa-user-plus', color: 'bg-indigo-600', to: '/users' },
        { label: 'Add Subject', icon: 'fa-book-medical', color: 'bg-blue-600', to: '/subjects' },
        { label: 'Manage Classes', icon: 'fa-chalkboard', color: 'bg-purple-600', to: '/classes' },
        { label: 'View Reports', icon: 'fa-file-export', color: 'bg-green-600', to: '/results' },
        { label: 'Schedule Exam', icon: 'fa-calendar-plus', color: 'bg-amber-600', to: '/exams' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
            </h3>
            <div className="space-y-3">
                {actions.map((action) => (
                    <Link
                        key={action.label}
                        to={action.to}
                        className={`w-full ${action.color} hover:opacity-90 text-white px-4 py-3 rounded-lg shadow-sm flex items-center justify-between`}
                    >
                        <span className="flex items-center">
                            <i className={`fas ${action.icon} mr-3`}></i>
                            {action.label}
                        </span>
                        <i className="fas fa-chevron-right"></i>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
