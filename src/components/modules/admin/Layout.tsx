import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/modules/admin/Sidebar';
import Header from '@/components/modules/admin/Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [appBarTitle, setAppBarTitle] = useState('');
    const [notifications, setNotifications] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);

    const toggleNotifications = () => {
        setNotifications((prev) => !prev);
        if (profileMenu) setProfileMenu(false);
    };

    const toggleProfileMenu = () => {
        setProfileMenu((prev) => !prev);
        if (notifications) setNotifications(false);
    };

    const routeTitles: { [key: string]: string } = {
        '/': 'Dashboard',
        '/subjects': 'Subject Management',
        '/classes': 'Class Management',
        '/users': 'User Management',
        '/results': 'Results Management',
        '/settings': 'Settings',
    };

    const location = useLocation();

    useEffect(() => {
        const title = routeTitles[location.pathname] || 'Dashboard';
        setAppBarTitle(title);
    });

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <div
                className={`flex flex-col flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                <Header
                    sidebarCollapsed={sidebarCollapsed}
                    appBarTitle={appBarTitle}
                    onToggleNotifications={toggleNotifications}
                    onToggleProfileMenu={toggleProfileMenu}
                    notificationsOpen={notifications}
                    profileMenuOpen={profileMenu}
                />
                <main className='pt-20 p-6'>{children}</main>
            </div>
        </div>
    );
};

export default Layout;
