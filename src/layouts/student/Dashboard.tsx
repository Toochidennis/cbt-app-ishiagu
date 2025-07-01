import React from "react";

const StudentDashboard: React.FC = () => {
    // Mock exam data
    const exams = [
        {
            id: 1,
            subject: "Mathematics",
            title: "Calculus Mid-term Examination",
            date: "2025-07-02",
            time: "10:00 AM",
            duration: "60 minutes",
            status: "In Progress",
        },
        {
            id: 2,
            subject: "Physics",
            title: "Mechanics Final Examination",
            date: "2025-07-05",
            time: "2:00 PM",
            duration: "90 minutes",
            status: "Upcoming",
        },
        {
            id: 3,
            subject: "Computer Science",
            title: "Data Structures Quiz",
            date: "2025-06-25",
            time: "9:00 AM",
            duration: "45 minutes",
            status: "Completed",
        },
        {
            id: 4,
            subject: "English Literature",
            title: "Poetry Analysis Test",
            date: "2025-07-10",
            time: "11:30 AM",
            duration: "60 minutes",
            status: "Upcoming",
        },
    ];

    // Start exam
    const startExam = (exam: any) => {

    };

    const studentName = 'Toochi Dennis';

    // Calculate exam stats
    const examStats = {
        total: exams.length,
        completed: exams.filter((exam) => exam.status === "Completed").length,
        upcoming: exams.filter((exam) => exam.status === "Upcoming").length,
        inProgress: exams.filter((exam) => exam.status === "In Progress").length,
    };

    // Render student dashboard
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <i className="fas fa-graduation-cap text-3xl text-blue-600 mr-3"></i>
                        <h1 className="text-xl font-bold text-gray-800">
                            CBT Examination System
                        </h1>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-4 text-right">
                            <p className="text-sm font-medium text-gray-900">{studentName}</p>
                            <p className="text-xs text-gray-500">Student ID: STD12345</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                            <span className="text-sm font-medium">
                                {studentName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </span>
                        </div>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Welcome, {studentName}
                    </h2>
                    <p className="text-gray-600">Sunday, June 29, 2025</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white shadow rounded-lg p-6 flex items-center">
                        <div className="rounded-full bg-blue-100 p-3 mr-4">
                            <i className="fas fa-clipboard-list text-blue-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Exams</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {examStats.total}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6 flex items-center">
                        <div className="rounded-full bg-green-100 p-3 mr-4">
                            <i className="fas fa-check-circle text-green-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Completed</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {examStats.completed}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6 flex items-center">
                        <div className="rounded-full bg-orange-100 p-3 mr-4">
                            <i className="fas fa-clock text-orange-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Upcoming</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {examStats.upcoming}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6 flex items-center">
                        <div className="rounded-full bg-purple-100 p-3 mr-4">
                            <i className="fas fa-spinner text-purple-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">In Progress</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {examStats.inProgress}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800">
                            Available Exams
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {exams.map((exam) => (
                            <div key={exam.id} className="p-6">
                                <div className="flex items-center justify-between flex-wrap">
                                    <div className="w-full sm:w-auto mb-4 sm:mb-0">
                                        <h4 className="text-lg font-medium text-gray-800">
                                            {exam.subject}
                                        </h4>
                                        <p className="text-gray-600">{exam.title}</p>
                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                            <i className="fas fa-calendar-alt mr-2"></i>
                                            <span>
                                                {exam.date} at {exam.time}
                                            </span>
                                            <span className="mx-2">•</span>
                                            <i className="fas fa-clock mr-2"></i>
                                            <span>{exam.duration}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mr-4
${exam.status === "In Progress"
                                                    ? "bg-green-100 text-green-800"
                                                    : exam.status === "Upcoming"
                                                        ? "bg-orange-100 text-orange-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {exam.status}
                                        </span>
                                        {exam.status === "In Progress" && (
                                            <button
                                                onClick={() => startExam(exam)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 !rounded-button whitespace-nowrap cursor-pointer"
                                            >
                                                Start Exam
                                            </button>
                                        )}
                                        {exam.status === "Upcoming" && (
                                            <button
                                                disabled
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed !rounded-button whitespace-nowrap"
                                            >
                                                Not Available
                                            </button>
                                        )}
                                        {exam.status === "Completed" && (
                                            <a
                                                href="https://readdy.ai/home/dd072350-6984-48f2-ae7c-be10a0324a73/d7d9ae1b-ecd4-4c98-87f1-e8ae4cc447ab"
                                                data-readdy="true"
                                            >
                                                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 !rounded-button whitespace-nowrap cursor-pointer">
                                                    View Results
                                                </button>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
export default StudentDashboard;
