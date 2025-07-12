import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/states/AuthStore';

type HeaderProps = {
  sidebarCollapsed: boolean;
  appBarTitle: string;
  onToggleNotifications: () => void;
  onToggleProfileMenu: () => void;
  notificationsOpen: boolean;
  profileMenuOpen: boolean;
};

const Header: React.FC<HeaderProps> = ({
  sidebarCollapsed,
  appBarTitle,
  onToggleNotifications,
  onToggleProfileMenu,
  notificationsOpen,
  profileMenuOpen,
}) => {

  const logout  = useAuthStore(state => state.logout);
  
  return (
    <header
      className={`bg-white fixed top-0 left-0 right-0 z-10 shadow-sm transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}
    >
      <div className="flex items-center justify-between w-full p-4 max-w-screen-2xl mx-auto">
        {/* Search bar */}
        <div className="relative flex-shrink">
          <h1 className="text-2xl font-bold text-gray-800">
            {appBarTitle}
          </h1>
        </div>

        {/* Buttons area */}
        <div className="flex items-center space-x-4">
          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={onToggleNotifications}
              className="relative p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
            >
              <i className="fas fa-bell text-xl"></i>
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                3
              </span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-700">Notifications</h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">
                      New exam scheduled
                    </p>
                    <p className="text-xs text-gray-500">
                      Physics - Grade 10 - June 25, 2025
                    </p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">
                      Results uploaded
                    </p>
                    <p className="text-xs text-gray-500">
                      Mathematics - Grade 11 - 48 students
                    </p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-800">
                      System maintenance
                    </p>
                    <p className="text-xs text-gray-500">
                      Scheduled for June 26, 2025 at 10:00 PM
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={onToggleProfileMenu}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                JD
              </div>
              <span className="hidden md:block text-gray-700">John Doe</span>
              <i className="fas fa-chevron-down text-gray-500 text-sm"></i>
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                <a
                  href="#profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <i className="fas fa-user mr-2"></i> Profile
                </a>
                <a
                  href="#settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <i className="fas fa-cog mr-2"></i> Settings
                </a>
                <div className="border-t border-gray-100 my-1"></div>
                <a
                  onClick={logout}
                  className="block px-4 cursor-pointer py-2 text-gray-700 hover:bg-red-50 hover:text-red-700"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
