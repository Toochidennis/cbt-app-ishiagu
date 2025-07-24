import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { useAuthStore } from "@/states/AuthStore";
import { useNavigate } from "react-router-dom";
import type { CreateExamScheduleWithSubject, CreateSetting, CreateUser } from "@/types/ipc/ipcTypes";
import utc from 'dayjs/plugin/utc'
import FormattedDate from "@/components/commons/FormattedDate";
import { toast } from 'react-toastify';
dayjs.extend(utc);

interface ExamHistoryItem {
    id: string;
    studentId: string;
    subjectId: string;
    classId: string;
    term: number;
    year: number;
    subject: string;
    title: string;
    date: string;
    time: string;
    duration: string;
    status: "Completed" | "Missed" | "In Progress" | "Upcoming";
}
interface ExamWithStatus extends CreateExamScheduleWithSubject {
    status: "Completed" | "Missed" | "In Progress" | "Upcoming";
}
interface ExamStats {
    total: number;
    completed: number;
    missed: number;
    upcoming: number;
    inProgress: number;
}

const StudentDashboard: React.FC = () => {
    const [examHistory, setExamHistory] = useState<ExamHistoryItem[]>([]);
    const [examStats, setExamStats] = useState<ExamStats>({
        total: 0,
        completed: 0,
        missed: 0,
        upcoming: 0,
        inProgress: 0,
    });
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const user = useAuthStore((state) => state.user);
    const settings = useAuthStore((state) => state.settings);
    const logout = useAuthStore((state) => state.logout);

    // Student Details
    const studentName = `${user?.surname} ${user?.middleName} ${user?.firstName}`;
    const studentId = user?.username

    // Fetch stats
    async function getExamSchedulesAndStats(user: CreateUser, settings: CreateSetting): Promise<ExamStats> {
        const { data: examSchedules } = await window.api.invoke("exam-schedule:by-student", {
            classId: user.classId!,
            studentId: user.id!,
            term: settings.term,
            year: settings.year,
        });

        if (!examSchedules) return {
            total: 0, completed: 0, missed: 0, upcoming: 0, inProgress: 0
        };

        const exams: ExamWithStatus[] = [];

        for (const schedule of examSchedules) {
            const { data: attempt } = await window.api.invoke("exam-attempt:get", {
                studentId: user.id!,
                examScheduleId: schedule.id, 
            });

            const start = dayjs(`${schedule.examDate} ${schedule.time}`, "YYYY-MM-DD HH:mm");
            const end = start.add(30, 'day');

            let status: ExamWithStatus["status"];
            const now = dayjs.utc();

            if (attempt?.status === 1 || attempt?.status === "completed") {
                status = "Completed";
            } else if (now.isBefore(start)) {
                status = "Upcoming";
            } else if (now.isAfter(end)) {
                status = "Missed";
            } else {
                status = "In Progress";
            }

            exams.push({ ...schedule, status });
        }

        return {
            total: exams.length,
            completed: exams.filter((e) => e.status === "Completed").length,
            missed: exams.filter((e) => e.status === "Missed").length,
            upcoming: exams.filter((e) => e.status === "Upcoming").length,
            inProgress: exams.filter((e) => e.status === "In Progress").length,
        };
    }

    // Fetch exam history
    async function getExamHistory(user: CreateUser, settings: CreateSetting): Promise<ExamHistoryItem[]> {
        const { data: examSchedules } = await window.api.invoke("exam-schedule:by-student", {
            classId: user.classId!,
            studentId: user.id!,
            term: settings.term,
            year: settings.year,
        });

        if (!examSchedules) return [];

        const history: ExamHistoryItem[] = [];

        for (const schedule of examSchedules) {
            const { data: attempt } = await window.api.invoke("exam-attempt:get", {
                studentId: user.id!,
                examScheduleId: schedule.id,
            });

            console.log("user id ", user.id);
            console.log("schedule id ", schedule.id);

            console.log('Attempted ', attempt.status);

            const start = dayjs(`${schedule.examDate} ${schedule.time}`, "YYYY-MM-DD HH:mm");
            const end = start.add(30, 'day');

            let status: ExamHistoryItem["status"];
            const now = dayjs.utc(); // compare in same timezone

            if (attempt?.status === 1 || attempt?.status === "completed") {
                status = "Completed";
            } else if (now.isBefore(start)) {
                status = "Upcoming";
            } else if (now.isAfter(end)) {
                status = "Missed";
            } else {
                status = "In Progress";
            }

            history.push({
                id: schedule.id,
                studentId: user.id!,
                subjectId: schedule.subjectId,
                classId: schedule.classId,
                term: schedule.term,
                year: schedule.year,
                subject: schedule.subjectName,
                title: schedule.description,
                date: start.local().format("YYYY-MM-DD"),
                time: start.local().format("h:mm A"),
                duration: `${schedule.durationMinutes} minutes`,
                status,
            });
        }

        return history.sort((a, b) => {
            const statusOrder: Record<ExamHistoryItem["status"], number> = {
                "Upcoming": 0,
                "In Progress": 1,
                "Completed": 2,
                "Missed": 3,
            };

            const statusDiff = statusOrder[a.status] - statusOrder[b.status];
            if (statusDiff !== 0) return statusDiff;

            return dayjs(`${a.date} ${a.time}`).isAfter(dayjs(`${b.date} ${b.time}`)) ? 1 : -1;
        });
    }

    // On load
    useEffect(() => {
        if (user && settings) {
            getExamSchedulesAndStats(user, settings).then(setExamStats);
            getExamHistory(user, settings).then(setExamHistory);
        }
    }, [user, settings]);

    const navigate = useNavigate();

    // Placeholder for launching an exam
    const startExam = (exam: ExamHistoryItem) => {
        navigate('/exam', { state: { exam } });
    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!menuRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);
        return () => {
            document.removeEventListener('mousedown', handler);
        };
    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
            refreshData();
        }, 5 * 60 * 1000); // Refresh every 5 minutes

        return () => clearInterval(interval);
    }, [user, settings]);


    const refreshData = () => {
        if (user && settings) {
            Promise.all([
                getExamSchedulesAndStats(user, settings).then(setExamStats),
                getExamHistory(user, settings).then(setExamHistory),
            ])
                .then(() => {
                    toast.success("Exam data refreshed!");
                })
                .catch(() => {
                    toast.error("Failed to refresh exam data.");
                });
        }
    };


    // Render student dashboard
    return (
        <div className="min-h-screen bg-gray-50">
            <header className=" fixed top-0 left-0 right-0 z-50 bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <i className="fas fa-graduation-cap text-3xl text-blue-600 mr-3"></i>
                        <h1 className="text-xl font-bold text-gray-800">
                            CBT Examination System
                        </h1>
                    </div>
                    <div className="relative flex items-center" ref={menuRef}>
                        <div className="mr-4 text-right">
                            <p className="text-sm font-medium text-gray-900">{studentName}</p>
                            <p className="text-xs text-gray-500">Student ID: {studentId}</p>
                        </div>
                        <button
                            onClick={() => setOpen((prev) => !prev)}
                            className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white focus:outline-none"
                        >
                            <span className="text-sm font-medium">
                                {studentName[0]}
                            </span>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setOpen(false);
                                            logout();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 bg-blue- hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Welcome, {studentName}
                    </h2>
                    <p className="text-gray-600">{<FormattedDate />}</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
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
                    <div className="bg-white shadow rounded-lg p-6 flex items-center">
                        <div className="rounded-full bg-red-100 p-3 mr-4">
                            <i className="fas fa-times-circle text-red-500 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Missed</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {examStats.missed}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-800">
                            Available Exams
                        </h3>
                        <button
                            onClick={refreshData}
                            className="text-sm text-black-600 hover:bg-gray-200 rounded p-2 focus:outline-none flex items-center cursor-pointer"
                            title="Refresh"
                        >
                            <i className="fas fa-sync-alt mr-2"></i> Refresh
                        </button>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {examHistory.map((exam) => (
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
                                                href=""
                                                data-readdy="true"
                                            >
                                                <button disabled className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 !rounded-button whitespace-nowrap cursor-pointer">
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
