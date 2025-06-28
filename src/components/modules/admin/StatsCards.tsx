import React from 'react';

type Stats = {
  totalStudents: number;
  totalTeachers: number;
  activeExams: number;
  completedExams: number;
};

const StatsCards: React.FC<{ stats: Stats }> = ({ stats }) => {
  const cards = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      color: 'border-blue-500',
      icon: 'fa-user-graduate',
      growth: '12% from last month',
    },
    {
      label: 'Total Teachers',
      value: stats.totalTeachers,
      color: 'border-purple-500',
      icon: 'fa-chalkboard-teacher',
      growth: '5% from last month',
    },
    {
      label: 'Active Exams',
      value: stats.activeExams,
      color: 'border-amber-500',
      icon: 'fa-file-alt',
      growth: '3 scheduled today',
    },
    {
      label: 'Completed Exams',
      value: stats.completedExams,
      color: 'border-green-500',
      icon: 'fa-clipboard-check',
      growth: '15 this week',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${card.color}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {card.value}
              </h2>
              <p className="text-sm mt-2 text-gray-600">{card.growth}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <i className={`fas ${card.icon} text-xl text-gray-700`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
