import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type SidebarProps = {
    collapsed: boolean;
    onToggle: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
    collapsed,
    onToggle,
}) => {
    const location = useLocation();

    const routes = [
        { path: '/', key: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
        { path: '/subjects', key: 'subjects', label: 'Subject Management', icon: 'fa-book' },
        { path: '/classes', key: 'classes', label: 'Class Management', icon: 'fa-chalkboard' },
        { path: '/users', key: 'users', label: 'User Management', icon: 'fa-users' },
        { path: '/exams', key: 'exams', label: 'Exam Schedules', icon: 'fa-calendar-alt' },
        { path: '/results', key: 'results', label: 'Results Analysis', icon: 'fa-chart-bar' },
        { path: '/settings', key: 'settings', label: 'System Settings', icon: 'fa-cog' },
    ];

    return (
        <div
            className={`bg-indigo-800 text-white transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'
                } fixed h-full z-10`}
        >
            <div className="flex items-center justify-between p-4 border-b border-indigo-700">
                <div
                    className={`flex items-center ${collapsed ? 'justify-center w-full' : ''
                        }`}
                >
                    <i className="fas fa-laptop-code text-2xl"></i>
                    {!collapsed && (
                        <span className="ml-3 font-bold text-xl">CBT Admin</span>
                    )}
                </div>
                <button onClick={onToggle} className="text-white focus:outline-none">
                    <i
                        className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'
                            }`}
                    ></i>
                </button>
            </div>
            <nav className="mt-5">
                <ul>
                    {routes.map((item) => {
                        const isActive =
                            item.path === '/'
                                ? location.pathname === '/'
                                : location.pathname.startsWith(item.path);

                        return (
                            <li key={item.key}>
                                <Link
                                    to={item.path}
                                    className={`
                    flex items-center w-full p-4
                    ${collapsed ? 'justify-center' : 'pl-6'}
                    ${isActive
                                            ? 'bg-indigo-700'
                                            : 'hover:bg-indigo-700'}
                    transition-colors duration-200
                    cursor-pointer rounded
                    whitespace-nowrap
                `}
                                >
                                    <i className={`fas ${item.icon} text-lg`}></i>
                                    {!collapsed && <span className="ml-3">{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
