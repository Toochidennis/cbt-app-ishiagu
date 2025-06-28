import React from 'react';

type Activity = {
    id: number;
    action: string;
    user: string;
    time: string;
};

const RecentActivities: React.FC<{ activities: Activity[] }> = ({
    activities,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Activities
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                                Activity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                                Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {activities.map((activity) => (
                            <tr key={activity.id}>
                                <td className="px-6 py-4 text-gray-900">{activity.action}</td>
                                <td className="px-6 py-4 text-gray-500">{activity.user}</td>
                                <td className="px-6 py-4 text-gray-500">{activity.time}</td>
                                <td className="px-6 py-4 text-gray-500">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button className="text-gray-600 hover:text-gray-900">
                                        <i className="fas fa-ellipsis-v"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentActivities;
