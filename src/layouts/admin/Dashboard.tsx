import StatsCards from '@/components/modules/admin/StatsCards';
import ExamChart from '@/components/modules/admin/ExamChart';
import QuickActions from '@/components/modules/admin/QuickActions';
import RecentActivities from '@/components/modules/admin/RecentActivities';

const Dashboard: React.FC = () => {
    const stats = {
        totalStudents: 1258,
        totalTeachers: 87,
        activeExams: 12,
        completedExams: 48,
    };

    const recentActivities = [
        { id: 1, action: 'New student accounts created', user: 'Admin', time: '2 hrs ago' },
        { id: 2, action: 'Math midterm scheduled', user: 'Mr. Johnson', time: '5 hrs ago' },
        { id: 3, action: 'Physics results uploaded', user: 'Mrs. Smith', time: '1 day ago' },
        { id: 4, action: 'System backup complete', user: 'System', time: '2 days ago' },
    ];

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
                    <p className="text-gray-600">
                        Welcome to the CBT Examination System Admin Dashboard
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                        <i className="fas fa-sync-alt mr-2"></i>
                        Refresh Data
                    </button>
                    <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                        <i className="fas fa-download mr-2"></i>
                        Export
                    </button>
                </div>
            </div>
            <StatsCards stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ExamChart />
                </div>
                <QuickActions />
            </div>
            <RecentActivities activities={recentActivities} />
        </>
    );
};

export default Dashboard;
