// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from "react";
import * as echarts from "echarts";

interface ExamResult {
    id: number;
    name: string;
    subject: string;
    date: string;
    class: string;
    studentsAppeared: number;
    passPercentage: number;
    averageScore: number;
    scoreDistribution: {
        range: string;
        count: number;
    }[];
}

interface Student {
    id: number;
    name: string;
    class: string;
    score: number;
    status: "Pass" | "Fail";
}

interface ExamDetail {
    id: number;
    name: string;
    subject: string;
    date: string;
    class: string;
    studentsAppeared: number;
    passPercentage: number;
    averageScore: number;
    students: Student[];
    scoreDistribution: {
        range: string;
        count: number;
    }[];
}

const Results: React.FC = () => {
    const [notifications, setNotifications] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("All");
    const [showSubjectFilter, setShowSubjectFilter] = useState(false);
    const [classFilter, setClassFilter] = useState("All");
    const [showClassFilter, setShowClassFilter] = useState(false);
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [selectedExam, setSelectedExam] = useState<ExamDetail | null>(null);
    const [showExamDetailModal, setShowExamDetailModal] = useState(false);

    // Mock data for exam results
    const [examResults, setExamResults] = useState<ExamResult[]>([
        {
            id: 1,
            name: "Midterm Examination",
            subject: "Mathematics",
            date: "2025-06-10",
            class: "Class 10A",
            studentsAppeared: 42,
            passPercentage: 85,
            averageScore: 72.5,
            scoreDistribution: [
                { range: "0-20", count: 2 },
                { range: "21-40", count: 5 },
                { range: "41-60", count: 10 },
                { range: "61-80", count: 15 },
                { range: "81-100", count: 10 },
            ],
        },
        {
            id: 2,
            name: "Final Examination",
            subject: "Physics",
            date: "2025-06-15",
            class: "Class 11A",
            studentsAppeared: 38,
            passPercentage: 78,
            averageScore: 68.3,
            scoreDistribution: [
                { range: "0-20", count: 3 },
                { range: "21-40", count: 6 },
                { range: "41-60", count: 12 },
                { range: "61-80", count: 10 },
                { range: "81-100", count: 7 },
            ],
        },
        {
            id: 3,
            name: "Chapter Test",
            subject: "Chemistry",
            date: "2025-06-05",
            class: "Class 9A",
            studentsAppeared: 45,
            passPercentage: 82,
            averageScore: 70.8,
            scoreDistribution: [
                { range: "0-20", count: 2 },
                { range: "21-40", count: 4 },
                { range: "41-60", count: 11 },
                { range: "61-80", count: 18 },
                { range: "81-100", count: 10 },
            ],
        },
        {
            id: 4,
            name: "Practical Examination",
            subject: "Biology",
            date: "2025-06-12",
            class: "Class 12A",
            studentsAppeared: 36,
            passPercentage: 92,
            averageScore: 78.4,
            scoreDistribution: [
                { range: "0-20", count: 0 },
                { range: "21-40", count: 2 },
                { range: "41-60", count: 8 },
                { range: "61-80", count: 16 },
                { range: "81-100", count: 10 },
            ],
        },
        {
            id: 5,
            name: "Quiz",
            subject: "English",
            date: "2025-06-08",
            class: "Class 8A",
            studentsAppeared: 40,
            passPercentage: 88,
            averageScore: 75.2,
            scoreDistribution: [
                { range: "0-20", count: 1 },
                { range: "21-40", count: 3 },
                { range: "41-60", count: 9 },
                { range: "61-80", count: 15 },
                { range: "81-100", count: 12 },
            ],
        },
        {
            id: 6,
            name: "Unit Test",
            subject: "History",
            date: "2025-06-03",
            class: "Class 7A",
            studentsAppeared: 44,
            passPercentage: 80,
            averageScore: 69.5,
            scoreDistribution: [
                { range: "0-20", count: 2 },
                { range: "21-40", count: 5 },
                { range: "41-60", count: 12 },
                { range: "61-80", count: 17 },
                { range: "81-100", count: 8 },
            ],
        },
        {
            id: 7,
            name: "Term Examination",
            subject: "Geography",
            date: "2025-06-18",
            class: "Class 6A",
            studentsAppeared: 42,
            passPercentage: 83,
            averageScore: 71.6,
            scoreDistribution: [
                { range: "0-20", count: 1 },
                { range: "21-40", count: 4 },
                { range: "41-60", count: 10 },
                { range: "61-80", count: 18 },
                { range: "81-100", count: 9 },
            ],
        },
        {
            id: 8,
            name: "Monthly Test",
            subject: "Computer Science",
            date: "2025-06-20",
            class: "Class 11B",
            studentsAppeared: 39,
            passPercentage: 87,
            averageScore: 74.8,
            scoreDistribution: [
                { range: "0-20", count: 1 },
                { range: "21-40", count: 3 },
                { range: "41-60", count: 8 },
                { range: "61-80", count: 16 },
                { range: "81-100", count: 11 },
            ],
        },
    ]);

    // Mock data for exam details
    const examDetails: ExamDetail[] = [
        {
            id: 1,
            name: "Midterm Examination",
            subject: "Mathematics",
            date: "2025-06-10",
            class: "Class 10A",
            studentsAppeared: 42,
            passPercentage: 85,
            averageScore: 72.5,
            scoreDistribution: [
                { range: "0-20", count: 2 },
                { range: "21-40", count: 5 },
                { range: "41-60", count: 10 },
                { range: "61-80", count: 15 },
                { range: "81-100", count: 10 },
            ],
            students: [
                {
                    id: 1,
                    name: "Alice Johnson",
                    class: "Class 10A",
                    score: 85,
                    status: "Pass",
                },
                {
                    id: 2,
                    name: "Bob Smith",
                    class: "Class 10A",
                    score: 72,
                    status: "Pass",
                },
                {
                    id: 3,
                    name: "Charlie Brown",
                    class: "Class 10A",
                    score: 90,
                    status: "Pass",
                },
                {
                    id: 4,
                    name: "Diana Prince",
                    class: "Class 10A",
                    score: 45,
                    status: "Fail",
                },
                {
                    id: 5,
                    name: "Edward Norton",
                    class: "Class 10A",
                    score: 78,
                    status: "Pass",
                },
                {
                    id: 6,
                    name: "Fiona Apple",
                    class: "Class 10A",
                    score: 92,
                    status: "Pass",
                },
                {
                    id: 7,
                    name: "George Wilson",
                    class: "Class 10A",
                    score: 65,
                    status: "Pass",
                },
                {
                    id: 8,
                    name: "Harry Potter",
                    class: "Class 10A",
                    score: 88,
                    status: "Pass",
                },
                {
                    id: 9,
                    name: "Iris West",
                    class: "Class 10A",
                    score: 76,
                    status: "Pass",
                },
                {
                    id: 10,
                    name: "Jack Ryan",
                    class: "Class 10A",
                    score: 35,
                    status: "Fail",
                },
            ],
        },
        {
            id: 2,
            name: "Final Examination",
            subject: "Physics",
            date: "2025-06-15",
            class: "Class 11A",
            studentsAppeared: 38,
            passPercentage: 78,
            averageScore: 68.3,
            scoreDistribution: [
                { range: "0-20", count: 3 },
                { range: "21-40", count: 6 },
                { range: "41-60", count: 12 },
                { range: "61-80", count: 10 },
                { range: "81-100", count: 7 },
            ],
            students: [
                {
                    id: 11,
                    name: "Kevin Hart",
                    class: "Class 11A",
                    score: 82,
                    status: "Pass",
                },
                {
                    id: 12,
                    name: "Laura Palmer",
                    class: "Class 11A",
                    score: 68,
                    status: "Pass",
                },
                {
                    id: 13,
                    name: "Mike Ross",
                    class: "Class 11A",
                    score: 75,
                    status: "Pass",
                },
                {
                    id: 14,
                    name: "Nancy Wheeler",
                    class: "Class 11A",
                    score: 38,
                    status: "Fail",
                },
                {
                    id: 15,
                    name: "Oscar Martinez",
                    class: "Class 11A",
                    score: 55,
                    status: "Pass",
                },
                {
                    id: 16,
                    name: "Pam Beesly",
                    class: "Class 11A",
                    score: 72,
                    status: "Pass",
                },
                {
                    id: 17,
                    name: "Quinn Fabray",
                    class: "Class 11A",
                    score: 64,
                    status: "Pass",
                },
                {
                    id: 18,
                    name: "Rachel Green",
                    class: "Class 11A",
                    score: 88,
                    status: "Pass",
                },
                {
                    id: 19,
                    name: "Steve Rogers",
                    class: "Class 11A",
                    score: 76,
                    status: "Pass",
                },
                {
                    id: 20,
                    name: "Tony Stark",
                    class: "Class 11A",
                    score: 32,
                    status: "Fail",
                },
            ],
        },
    ];

    // Format date
    const formatDate = () => {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return date.toLocaleDateString("en-US", options);
    };

    // Toggle subject filter dropdown
    const toggleSubjectFilter = () => {
        setShowSubjectFilter(!showSubjectFilter);
        if (showClassFilter) setShowClassFilter(false);
        if (showExportOptions) setShowExportOptions(false);
    };

    // Handle subject filter change
    const handleSubjectFilterChange = (subject: string) => {
        setSubjectFilter(subject);
        setShowSubjectFilter(false);
    };

    // Toggle class filter dropdown
    const toggleClassFilter = () => {
        setShowClassFilter(!showClassFilter);
        if (showSubjectFilter) setShowSubjectFilter(false);
        if (showExportOptions) setShowExportOptions(false);
    };

    // Handle class filter change
    const handleClassFilterChange = (className: string) => {
        setClassFilter(className);
        setShowClassFilter(false);
    };

    // Toggle export options dropdown
    const toggleExportOptions = () => {
        setShowExportOptions(!showExportOptions);
        if (showSubjectFilter) setShowSubjectFilter(false);
        if (showClassFilter) setShowClassFilter(false);
    };

    // Handle date range change
    const handleDateRangeChange = (type: "start" | "end", value: string) => {
        setDateRange({
            ...dateRange,
            [type]: value,
        });
    };

    // Filter exam results based on search query, subject filter, class filter, and date range
    const filteredExamResults = examResults.filter((exam) => {
        const matchesSearch =
            exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject =
            subjectFilter === "All" || exam.subject === subjectFilter;
        const matchesClass = classFilter === "All" || exam.class === classFilter;
        const examDate = new Date(exam.date);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        const matchesDateRange =
            (!startDate || examDate >= startDate) &&
            (!endDate || examDate <= endDate);
        return matchesSearch && matchesSubject && matchesClass && matchesDateRange;
    });

    // Get unique subjects
    const subjects = [
        "All",
        ...Array.from(new Set(examResults.map((exam) => exam.subject))),
    ];

    // Get unique classes
    const classes = [
        "All",
        ...Array.from(new Set(examResults.map((exam) => exam.class))),
    ];

    // Calculate total exams
    const totalExams = filteredExamResults.length;

    // Calculate average score across all exams
    const averageScore =
        filteredExamResults.length > 0
            ? Math.round(
                (filteredExamResults.reduce(
                    (sum, exam) => sum + exam.averageScore,
                    0,
                ) /
                    filteredExamResults.length) *
                10,
            ) / 10
            : 0;

    // Calculate average pass rate
    const averagePassRate =
        filteredExamResults.length > 0
            ? Math.round(
                filteredExamResults.reduce(
                    (sum, exam) => sum + exam.passPercentage,
                    0,
                ) / filteredExamResults.length,
            )
            : 0;

    // Calculate total students assessed
    const totalStudents = filteredExamResults.reduce(
        (sum, exam) => sum + exam.studentsAppeared,
        0,
    );

    // Handle view exam details
    const handleViewExamDetails = (examId: number) => {
        const exam = examDetails.find((e) => e.id === examId);
        if (exam) {
            setSelectedExam(exam);
            setShowExamDetailModal(true);
        }
    };

    // Initialize charts
    useEffect(() => {
        // Score Distribution Chart
        const scoreDistributionChart = echarts.init(
            document.getElementById("scoreDistributionChart"),
        );
        const scoreDistributionOption = {
            animation: false,
            title: {
                text: "Score Distribution",
                left: "center",
                textStyle: {
                    fontSize: 16,
                    fontWeight: "normal",
                },
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: {
                type: "category",
                data: ["0-20", "21-40", "41-60", "61-80", "81-100"],
                axisTick: {
                    alignWithLabel: true,
                },
            },
            yAxis: {
                type: "value",
                name: "Number of Students",
            },
            series: [
                {
                    name: "Students",
                    type: "bar",
                    barWidth: "60%",
                    data: [
                        { value: 11, itemStyle: { color: "#f87171" } },
                        { value: 28, itemStyle: { color: "#fbbf24" } },
                        { value: 72, itemStyle: { color: "#60a5fa" } },
                        { value: 109, itemStyle: { color: "#34d399" } },
                        { value: 67, itemStyle: { color: "#818cf8" } },
                    ],
                },
            ],
        };
        scoreDistributionChart.setOption(scoreDistributionOption);

        // Performance Trends Chart
        const performanceTrendsChart = echarts.init(
            document.getElementById("performanceTrendsChart"),
        );
        const performanceTrendsOption = {
            animation: false,
            title: {
                text: "Performance Trends",
                left: "center",
                textStyle: {
                    fontSize: 16,
                    fontWeight: "normal",
                },
            },
            tooltip: {
                trigger: "axis",
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            },
            yAxis: {
                type: "value",
                name: "Average Score",
                min: 0,
                max: 100,
            },
            series: [
                {
                    name: "Average Score",
                    type: "line",
                    smooth: true,
                    data: [65.2, 68.7, 70.1, 72.5, 71.8, 74.3],
                    itemStyle: {
                        color: "#6366f1",
                    },
                    areaStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: "rgba(99, 102, 241, 0.5)" },
                                { offset: 1, color: "rgba(99, 102, 241, 0.05)" },
                            ],
                        },
                    },
                },
            ],
        };
        performanceTrendsChart.setOption(performanceTrendsOption);

        // Subject Comparison Chart
        const subjectComparisonChart = echarts.init(
            document.getElementById("subjectComparisonChart"),
        );
        const subjectComparisonOption = {
            animation: false,
            title: {
                text: "Subject Comparison",
                left: "center",
                textStyle: {
                    fontSize: 16,
                    fontWeight: "normal",
                },
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: {
                type: "value",
                name: "Average Score",
                min: 0,
                max: 100,
            },
            yAxis: {
                type: "category",
                data: [
                    "Mathematics",
                    "Physics",
                    "Chemistry",
                    "Biology",
                    "English",
                    "History",
                    "Geography",
                    "Computer Science",
                ],
            },
            series: [
                {
                    name: "Average Score",
                    type: "bar",
                    data: [
                        { value: 72.5, itemStyle: { color: "#6366f1" } },
                        { value: 68.3, itemStyle: { color: "#8b5cf6" } },
                        { value: 70.8, itemStyle: { color: "#ec4899" } },
                        { value: 78.4, itemStyle: { color: "#14b8a6" } },
                        { value: 75.2, itemStyle: { color: "#f59e0b" } },
                        { value: 69.5, itemStyle: { color: "#ef4444" } },
                        { value: 71.6, itemStyle: { color: "#10b981" } },
                        { value: 74.8, itemStyle: { color: "#3b82f6" } },
                    ],
                },
            ],
        };
        subjectComparisonChart.setOption(subjectComparisonOption);

        // Resize charts on window resize
        const handleResize = () => {
            scoreDistributionChart.resize();
            performanceTrendsChart.resize();
            subjectComparisonChart.resize();
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            scoreDistributionChart.dispose();
            performanceTrendsChart.dispose();
            subjectComparisonChart.dispose();
        };
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".subject-filter-container") && showSubjectFilter) {
                setShowSubjectFilter(false);
            }
            if (!target.closest(".class-filter-container") && showClassFilter) {
                setShowClassFilter(false);
            }
            if (!target.closest(".export-options-container") && showExportOptions) {
                setShowExportOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSubjectFilter, showClassFilter, showExportOptions]);

    return (
        <div className="text-gray-800">
            {/* Main Content */}

            {/* Breadcrumb and Page Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                        <a
                            href="https://readdy.ai/home/f0687006-93b6-45d6-87ab-dd4a0c4ebbea/8d774796-6766-426f-a8bc-397a2a179d15"
                            data-readdy="true"
                            className="hover:text-indigo-600"
                        >
                            Dashboard
                        </a>
                        <i className="fas fa-chevron-right mx-2 text-xs text-gray-400"></i>
                        <span className="text-gray-700">Results Analysis</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Results Analysis
                    </h1>
                    <p className="text-gray-600">{formatDate()}</p>
                </div>
                <div className="relative export-options-container mt-4 md:mt-0">
                    <button
                        onClick={toggleExportOptions}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center cursor-pointer !rounded-button whitespace-nowrap"
                    >
                        <i className="fas fa-download mr-2"></i>
                        Export Report
                        <i
                            className={`fas fa-chevron-down ml-2 text-xs transition-transform ${showExportOptions ? "rotate-180" : ""}`}
                        ></i>
                    </button>
                    {showExportOptions && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer !rounded-button whitespace-nowrap">
                                <i className="fas fa-file-pdf mr-2 text-red-500"></i>Export
                                as PDF
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer !rounded-button whitespace-nowrap">
                                <i className="fas fa-file-excel mr-2 text-green-600"></i>
                                Export as Excel
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer !rounded-button whitespace-nowrap">
                                <i className="fas fa-file-csv mr-2 text-blue-500"></i>Export
                                as CSV
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer !rounded-button whitespace-nowrap">
                                <i className="fas fa-print mr-2 text-gray-600"></i>Print
                                Report
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search exams..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            />
                            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                        </div>
                        <div className="relative subject-filter-container w-full sm:w-auto">
                            <button
                                onClick={toggleSubjectFilter}
                                className="flex items-center justify-between w-full sm:w-40 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer !rounded-button whitespace-nowrap"
                            >
                                <span>
                                    {subjectFilter === "All" ? "All Subjects" : subjectFilter}
                                </span>
                                <i
                                    className={`fas fa-chevron-down ml-2 transition-transform ${showSubjectFilter ? "rotate-180" : ""}`}
                                ></i>
                            </button>
                            {showSubjectFilter && (
                                <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <ul className="py-1 max-h-60 overflow-y-auto">
                                        {subjects.map((subject, index) => (
                                            <li
                                                key={index}
                                                onClick={() => handleSubjectFilterChange(subject)}
                                                className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer ${subjectFilter === subject ? "bg-indigo-50 text-indigo-700" : ""}`}
                                            >
                                                {subject === "All" ? "All Subjects" : subject}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="relative class-filter-container w-full sm:w-auto">
                            <button
                                onClick={toggleClassFilter}
                                className="flex items-center justify-between w-full sm:w-40 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer !rounded-button whitespace-nowrap"
                            >
                                <span>
                                    {classFilter === "All" ? "All Classes" : classFilter}
                                </span>
                                <i
                                    className={`fas fa-chevron-down ml-2 transition-transform ${showClassFilter ? "rotate-180" : ""}`}
                                ></i>
                            </button>
                            {showClassFilter && (
                                <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <ul className="py-1 max-h-60 overflow-y-auto">
                                        {classes.map((className, index) => (
                                            <li
                                                key={index}
                                                onClick={() => handleClassFilterChange(className)}
                                                className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer ${classFilter === className ? "bg-indigo-50 text-indigo-700" : ""}`}
                                            >
                                                {className === "All" ? "All Classes" : className}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-3">
                        <div className="flex items-center space-x-3 w-full sm:w-auto">
                            <div className="flex-1 sm:flex-initial">
                                <label className="block text-xs text-gray-500 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) =>
                                        handleDateRangeChange("start", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex-1 sm:flex-initial">
                                <label className="block text-xs text-gray-500 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) =>
                                        handleDateRangeChange("end", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Exams
                            </p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                {totalExams}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <i className="fas fa-file-alt text-indigo-600 text-xl"></i>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center text-sm">
                            <span className="text-green-500 flex items-center">
                                <i className="fas fa-arrow-up mr-1"></i>
                                12%
                            </span>
                            <span className="text-gray-500 ml-2">from last month</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Average Score
                            </p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                {averageScore}%
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <i className="fas fa-chart-line text-blue-600 text-xl"></i>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center text-sm">
                            <span className="text-green-500 flex items-center">
                                <i className="fas fa-arrow-up mr-1"></i>
                                5.2%
                            </span>
                            <span className="text-gray-500 ml-2">from last month</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pass Rate</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                {averagePassRate}%
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <i className="fas fa-check-circle text-green-600 text-xl"></i>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center text-sm">
                            <span className="text-green-500 flex items-center">
                                <i className="fas fa-arrow-up mr-1"></i>
                                3.1%
                            </span>
                            <span className="text-gray-500 ml-2">from last month</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Students Assessed
                            </p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                {totalStudents}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <i className="fas fa-users text-purple-600 text-xl"></i>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center text-sm">
                            <span className="text-green-500 flex items-center">
                                <i className="fas fa-arrow-up mr-1"></i>
                                8.4%
                            </span>
                            <span className="text-gray-500 ml-2">from last month</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div
                        id="scoreDistributionChart"
                        style={{ height: "400px" }}
                    ></div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div
                        id="performanceTrendsChart"
                        style={{ height: "400px" }}
                    ></div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div id="subjectComparisonChart" style={{ height: "400px" }}></div>
            </div>

            {/* Detailed Results Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800">
                        Detailed Exam Results
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Click on any exam to view detailed student performance
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    <div className="flex items-center">
                                        Exam Name
                                        <button className="ml-1 text-gray-400 hover:text-gray-600 cursor-pointer !rounded-button whitespace-nowrap">
                                            <i className="fas fa-sort"></i>
                                        </button>
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    <div className="flex items-center">
                                        Subject
                                        <button className="ml-1 text-gray-400 hover:text-gray-600 cursor-pointer !rounded-button whitespace-nowrap">
                                            <i className="fas fa-sort"></i>
                                        </button>
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    <div className="flex items-center">
                                        Date
                                        <button className="ml-1 text-gray-400 hover:text-gray-600 cursor-pointer !rounded-button whitespace-nowrap">
                                            <i className="fas fa-sort"></i>
                                        </button>
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Class
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    <div className="flex items-center">
                                        Students
                                        <button className="ml-1 text-gray-400 hover:text-gray-600 cursor-pointer !rounded-button whitespace-nowrap">
                                            <i className="fas fa-sort"></i>
                                        </button>
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    <div className="flex items-center">
                                        Pass %
                                        <button className="ml-1 text-gray-400 hover:text-gray-600 cursor-pointer !rounded-button whitespace-nowrap">
                                            <i className="fas fa-sort"></i>
                                        </button>
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    <div className="flex items-center">
                                        Avg Score
                                        <button className="ml-1 text-gray-400 hover:text-gray-600 cursor-pointer !rounded-button whitespace-nowrap">
                                            <i className="fas fa-sort"></i>
                                        </button>
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredExamResults.map((exam) => (
                                <tr
                                    key={exam.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleViewExamDetails(exam.id)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a
                                            href="https://readdy.ai/home/f0687006-93b6-45d6-87ab-dd4a0c4ebbea/a76e9b4b-b711-4b92-861b-5a8be26465fc"
                                            data-readdy="true"
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                        >
                                            {exam.name}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {exam.subject}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {new Date(exam.date).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {exam.class}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {exam.studentsAppeared}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-16 bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-indigo-600 h-2.5 rounded-full"
                                                    style={{ width: `${exam.passPercentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-500 ml-2">
                                                {exam.passPercentage}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div
                                            className={`text-sm font-medium ${exam.averageScore >= 70 ? "text-green-600" : exam.averageScore >= 50 ? "text-yellow-600" : "text-red-600"}`}
                                        >
                                            {exam.averageScore}/100
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap">
                                            <i className="fas fa-chart-pie"></i>
                                        </button>
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap">
                                            <i className="fas fa-download"></i>
                                        </button>
                                        <button className="text-indigo-600 hover:text-indigo-900 cursor-pointer !rounded-button whitespace-nowrap">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
                            Previous
                        </button>
                        <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span> to{" "}
                                <span className="font-medium">
                                    {filteredExamResults.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium">
                                    {filteredExamResults.length}
                                </span>{" "}
                                results
                            </p>
                        </div>
                        <div>
                            <nav
                                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                aria-label="Pagination"
                            >
                                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
                                    <span className="sr-only">Previous</span>
                                    <i className="fas fa-chevron-left text-xs"></i>
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
                                    1
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
                                    2
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
                                    3
                                </button>
                                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
                                    <span className="sr-only">Next</span>
                                    <i className="fas fa-chevron-right text-xs"></i>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exam Detail Modal */}
            {showExamDetailModal && selectedExam && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Exam Performance Details
                                    </h3>
                                    <button
                                        onClick={() => setShowExamDetailModal(false)}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer !rounded-button whitespace-nowrap"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Exam Name</p>
                                            <p className="text-base font-medium">
                                                {selectedExam.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Subject</p>
                                            <p className="text-base font-medium">
                                                {selectedExam.subject}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Date</p>
                                            <p className="text-base font-medium">
                                                {new Date(selectedExam.date).toLocaleDateString(
                                                    "en-US",
                                                    { year: "numeric", month: "long", day: "numeric" },
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Class</p>
                                            <p className="text-base font-medium">
                                                {selectedExam.class}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Students Appeared</p>
                                            <p className="text-base font-medium">
                                                {selectedExam.studentsAppeared}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Average Score</p>
                                            <p className="text-base font-medium">
                                                {selectedExam.averageScore}/100
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-md font-medium text-gray-800 mb-3">
                                        Score Distribution
                                    </h4>
                                    <div className="flex items-center space-x-1">
                                        {selectedExam.scoreDistribution.map((item, index) => (
                                            <div key={index} className="flex-1">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-full bg-gray-200 rounded-t-lg">
                                                        <div
                                                            className={`bg-indigo-600 rounded-t-lg text-xs text-white text-center py-1`}
                                                            style={{ height: `${item.count * 3}px` }}
                                                        >
                                                            {item.count}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {item.range}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-md font-medium text-gray-800 mb-3">
                                        Student Results
                                    </h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Student Name
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Class
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Score
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Status
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Performance
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {selectedExam.students.map((student) => (
                                                    <tr key={student.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {student.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500">
                                                                {student.class}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium">
                                                                {student.score}/100
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === "Pass"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                                    }`}
                                                            >
                                                                {student.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="w-32 bg-gray-200 rounded-full h-2.5">
                                                                <div
                                                                    className={`h-2.5 rounded-full ${student.score >= 80
                                                                        ? "bg-green-600"
                                                                        : student.score >= 60
                                                                            ? "bg-blue-600"
                                                                            : student.score >= 40
                                                                                ? "bg-yellow-500"
                                                                                : "bg-red-600"
                                                                        }`}
                                                                    style={{ width: `${student.score}%` }}
                                                                ></div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <a
                                    href="https://readdy.ai/home/f0687006-93b6-45d6-87ab-dd4a0c4ebbea/a76e9b4b-b711-4b92-861b-5a8be26465fc"
                                    data-readdy="true"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer !rounded-button whitespace-nowrap"
                                >
                                    Go to Exam Schedule
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setShowExamDetailModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm cursor-pointer !rounded-button whitespace-nowrap"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Results;
