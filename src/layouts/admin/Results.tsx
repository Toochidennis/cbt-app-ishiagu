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
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Results Management
                    </h1>
                    <p className="text-gray-600">View and manage exam results</p>
                </div>
                <div className="relative flex gap-4 export-options-container mt-4 md:mt-0">
                    <button
                        onClick={(e) => console.log(e.target)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center cursor-pointer !rounded-button whitespace-nowrap"
                    >
                        <i className="fas fa-upload mr-2"></i>
                        Insert Result
                    </button>
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


            {/* Exam Detail Modal */}

        </div>
    );
};

export default Results;
