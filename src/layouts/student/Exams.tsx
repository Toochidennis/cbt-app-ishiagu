import React, { useState, useEffect } from "react";

const StudentExam: React.FC = () => {
    const [currentView, setCurrentView] = useState<"dashboard" | "exam">(
        "dashboard",
    );
    const [currentExam, setCurrentExam] = useState<any>(null);
    const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});

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
    // Mock questions for the exam
    const questions = [
        {
            id: 1,
            text: "What is the derivative of f(x) = x²?",
            options: [
                { id: "A", text: "f'(x) = x" },
                { id: "B", text: "f'(x) = 2x" },
                { id: "C", text: "f'(x) = 2" },
                { id: "D", text: "f'(x) = x²" },
            ],
            correctAnswer: "B",
        },
        {
            id: 2,
            text: "Solve the equation: 3x - 7 = 8",
            options: [
                { id: "A", text: "x = 5" },
                { id: "B", text: "x = 15/3" },
                { id: "C", text: "x = 1" },
                { id: "D", text: "x = 0" },
            ],
            correctAnswer: "A",
        },
        {
            id: 3,
            text: "If a triangle has sides of length 3, 4, and 5, what is its area?",
            options: [
                { id: "A", text: "6 square units" },
                { id: "B", text: "10 square units" },
                { id: "C", text: "12 square units" },
                { id: "D", text: "15 square units" },
            ],
            correctAnswer: "A",
        },
        {
            id: 4,
            text: "What is the value of sin(30°)?",
            options: [
                { id: "A", text: "1/4" },
                { id: "B", text: "1/3" },
                { id: "C", text: "1/2" },
                { id: "D", text: "√3/2" },
            ],
            correctAnswer: "C",
        },
        {
            id: 5,
            text: "What is the limit of (1+1/n)^n as n approaches infinity?",
            options: [
                { id: "A", text: "1" },
                { id: "B", text: "2" },
                { id: "C", text: "e" },
                { id: "D", text: "π" },
            ],
            correctAnswer: "C",
        },
    ];
    // Format time remaining

    // Timer effect for exam
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (currentView === "exam" && timeRemaining > 0) {
            timer = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [currentView, timeRemaining]);
    // Handle login

    // Start exam
    const startExam = (exam: any) => {
        setCurrentExam(exam);
        setCurrentView("exam");
        setCurrentQuestionIndex(0);
        setAnswers({});
        // Set time based on exam duration (assuming format like "60 minutes")
        const durationInMinutes = parseInt(exam.duration.split(" ")[0]);
        setTimeRemaining(durationInMinutes * 60);
    };

    // Format time remaining
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };
    // Handle answer selection
    const handleAnswerSelect = (questionId: number, optionId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };
    // Navigate to next question
    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };
    // Navigate to previous question
    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };
    // Navigate to specific question
    const goToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };
    // Submit exam
    const submitExam = () => {
        if (window.confirm("Are you sure you want to submit your exam?")) {
            // In a real application, you would send the answers to the server here
            setCurrentView("dashboard");
        }
    };

    if (!currentExam) return null;
    const currentQuestion = questions[currentQuestionIndex];
    const attemptedQuestionsCount = Object.keys(answers).length;
    const progressPercentage = (attemptedQuestionsCount / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            {currentExam.subject}
                        </h1>
                        <p className="text-sm text-gray-600">{currentExam.title}</p>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-6 text-center">
                            <p className="text-sm text-gray-500">Time Remaining</p>
                            <p
                                className={`text-xl font-bold ${timeRemaining < 300 ? "text-red-600" : "text-gray-800"}`}
                            >
                                {formatTime(timeRemaining)}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Question</p>
                            <p className="text-xl font-bold text-gray-800">
                                {currentQuestionIndex + 1} / {questions.length}
                            </p>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-grow flex">
                <div className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">
                            Question {currentQuestionIndex + 1}: {currentQuestion.text}
                        </h2>
                        <div className="space-y-4">
                            {currentQuestion.options.map((option) => (
                                <div
                                    key={option.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors
${answers[currentQuestion.id] === option.id
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-300 hover:bg-gray-50"
                                        }`}
                                    onClick={() =>
                                        handleAnswerSelect(currentQuestion.id, option.id)
                                    }
                                >
                                    <div className="flex items-center">
                                        <div
                                            className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3
${answers[currentQuestion.id] === option.id
                                                    ? "border-blue-500 bg-blue-500"
                                                    : "border-gray-400"
                                                }`}
                                        >
                                            {answers[currentQuestion.id] === option.id && (
                                                <div className="h-2 w-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                        <span className="text-gray-700">
                                            {option.id}. {option.text}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button
                            onClick={goToPreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium
${currentQuestionIndex === 0
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                                } !rounded-button whitespace-nowrap`}
                        >
                            <i className="fas fa-arrow-left mr-2"></i>
                            Previous
                        </button>
                        {currentQuestionIndex < questions.length - 1 ? (
                            <button
                                onClick={goToNextQuestion}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 !rounded-button whitespace-nowrap cursor-pointer"
                            >
                                Next
                                <i className="fas fa-arrow-right ml-2"></i>
                            </button>
                        ) : (
                            <button
                                onClick={submitExam}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 !rounded-button whitespace-nowrap cursor-pointer"
                            >
                                Submit Exam
                            </button>
                        )}
                    </div>
                </div>
                <div className="w-80 bg-white border-l border-gray-200 p-6 hidden lg:block">
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                            PROGRESS
                        </h3>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            {attemptedQuestionsCount} of {questions.length} questions
                            answered
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">
                            QUESTION NAVIGATOR
                        </h3>
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((question, index) => (
                                <button
                                    key={question.id}
                                    onClick={() => goToQuestion(index)}
                                    className={`h-10 w-10 rounded-md flex items-center justify-center text-sm font-medium
${currentQuestionIndex === index
                                            ? "bg-blue-600 text-white"
                                            : answers[question.id]
                                                ? "bg-green-100 text-green-800 border border-green-300"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        } cursor-pointer`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mt-8">
                        <button
                            onClick={submitExam}
                            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 !rounded-button whitespace-nowrap cursor-pointer"
                        >
                            Submit Exam
                        </button>
                        <button
                            onClick={() => setCurrentView("dashboard")}
                            className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 !rounded-button whitespace-nowrap cursor-pointer"
                        >
                            Save & Exit
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default StudentExam;
