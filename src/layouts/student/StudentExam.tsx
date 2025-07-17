import type { CreateExamAttempt, CreateResults } from "@/types/ipc/ipcTypes";
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

interface Option {
    id: string;
    text: string;
}

interface ExamQuestionItem {
    id: string;
    text: string;
    image: string;
    passage: string;
    options: Option[];
    correctAnswer: number;
}

const StudentExam: React.FC = () => {
    const [timeRemaining, setTimeRemaining] = useState(3600);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [questions, setQuestions] = useState<ExamQuestionItem[]>([]);
    const [loading, setLoading] = useState(true);

    const { state } = useLocation();
    const navigate = useNavigate();

    const currentExam = state?.exam;

    function shuffleArray<T>(array: T[]): T[] {
        return array
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    }

    // Fetch exam questions
    async function fetchExamQuestions() {
        const { data: results } = await window.api.invoke("question:get", {
            examScheduleId: currentExam.id,
        });

        const quests: ExamQuestionItem[] = results.map((quest: any) => {
            const parsedQuestion = JSON.parse(quest.questionText);
            const parsedOptions = JSON.parse(quest.options);
            const options: Option[] = parsedOptions.map((opt: any) => ({
                id: opt.label,
                text: opt.value,
            }));

            return {
                id: quest.id,
                text: parsedQuestion.text,
                image: parsedQuestion.image,
                passage: parsedQuestion.passage,
                options,
                correctAnswer: quest.correctOption,
            };
        });

        const shuffled = shuffleArray(quests);
        return shuffled;
    }

    // Timer + Questions Setup
    useEffect(() => {
        if (!currentExam) return;

        let timer: NodeJS.Timeout;

        fetchExamQuestions().then((questions) => {
            setQuestions(questions);
            setCurrentQuestionIndex(0);
            setAnswers({});

            const durationInMinutes = parseInt(currentExam.duration.split(" ")[0]);
            const totalSeconds = durationInMinutes * 60;
            setTimeRemaining(totalSeconds);
            setLoading(false);

            timer = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        saveAndExit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        });

        return () => clearInterval(timer);
    }, [currentExam]);

    // Format remaining time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const goToNextQuestion = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1)
            setCurrentQuestionIndex((prev) => prev + 1);
    }, [currentQuestionIndex, questions.length]);

    const goToPreviousQuestion = useCallback(() => {
        if (currentQuestionIndex > 0)
            setCurrentQuestionIndex((prev) => prev - 1);
    }, [currentQuestionIndex]);

    const handleAnswerSelect = useCallback((questionId: string, optionId: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    }, []);

    const goToQuestion = (index: number) => setCurrentQuestionIndex(index);

    const submitExam = async () => {
        const result = await Swal.fire({
            title: 'Submit Exam?',
            text: 'Are you sure you want to submit your answers?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, submit',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        await saveAndExit();
    };

    const saveAndExit = async () => {
        let totalScore = 0;

        questions.forEach((question) => {
            const selectedOptionId = answers[question.id]; // e.g. "A"
            const correctIndex = Math.floor(question.correctAnswer - 1); // e.g. 1

            // Convert the correct answer index to the corresponding option ID
            const correctOptionId = question.options[correctIndex]?.id;

            // Use question.marks if available, otherwise default to 2
            const marks = question.marks ?? 2;

            if (selectedOptionId === correctOptionId) {
                totalScore += marks;
            }
        });

        const studentResult: CreateResults = {
            studentId: currentExam.studentId,
            subjectId: currentExam.subjectId,
            classId: currentExam.classId,
            term: currentExam.term,
            year: currentExam.year,
            exam: totalScore
        }

        const { id: resultId } = await window.api.invoke('result:create', studentResult)

        if (resultId) {
            const studentAttempt: CreateExamAttempt = {
                examScheduleId: currentExam.id,
                studentId: currentExam.studentId,
                status: 1
            }

            const { id: attemptId } = await window.api.invoke('exam-attempt:create', studentAttempt)

            if (attemptId) {
                await Swal.fire({
                    title: 'Submitted!',
                    text: 'Your exam has been submitted successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });

                navigate('/student');
            }
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    const attemptedQuestionsCount = Object.keys(answers).length;
    const progressPercentage = (attemptedQuestionsCount / questions.length) * 100;


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toUpperCase();

            // Arrow keys
            if (key === "ARROWLEFT") {
                goToPreviousQuestion();
            } else if (key === "ARROWRIGHT") {
                goToNextQuestion();
            }

            // Letter keys (A–Z for options)
            const currentOpts = currentQuestion?.options || [];
            const selected = currentOpts.find(opt => opt.id.toUpperCase() === key);
            if (selected) {
                handleAnswerSelect(currentQuestion.id, selected.id);
            }

            // Enter key for submit (only on last question)
            if (key === "ENTER" && currentQuestionIndex === questions.length - 1) {
                submitExam();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [currentQuestion, goToNextQuestion, goToPreviousQuestion, handleAnswerSelect]);

    if (!currentExam || loading) {
        return <div className="p-8 text-center text-gray-500">Loading exam...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{currentExam.subject}</h1>
                        <p className="text-sm text-gray-600">{currentExam.title}</p>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-6 text-center">
                            <p className="text-sm text-gray-500">Time Remaining</p>
                            <p className={`text-xl font-bold ${timeRemaining < 300 ? "text-red-600" : "text-gray-800"}`}>
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
                            Question {currentQuestionIndex + 1}:
                        </h2>

                        {currentQuestion.image && (
                            <img
                                src={currentQuestion.image}
                                alt={`Question ${currentQuestionIndex + 1}`}
                                className="mb-4 rounded shadow max-w-full h-auto"
                            />
                        )}

                        {currentQuestion.passage && currentQuestion.passage.length > 0 && (
                            <div className="mb-4 p-4 bg-gray-100 border-l-4 border-blue-500 text-gray-800 rounded">
                                <strong>Passage:</strong>
                                <p className="mt-2 whitespace-pre-line">{currentQuestion.passage}</p>
                            </div>
                        )}

                        <p className="text-lg font-medium text-gray-700 mb-4">
                            {currentQuestion.text}
                        </p>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option) => (
                                <div
                                    key={option.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${answers[currentQuestion.id] === option.id
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300 hover:bg-gray-50"
                                        }`}
                                    onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                                >
                                    <div className="flex items-center">
                                        <div
                                            className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${answers[currentQuestion.id] === option.id
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
                            className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${currentQuestionIndex === 0
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                                }`}
                        >
                            <i className="fas fa-arrow-left mr-2"></i> Previous
                        </button>

                        {currentQuestionIndex < questions.length - 1 ? (
                            <button
                                onClick={goToNextQuestion}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Next <i className="fas fa-arrow-right ml-2"></i>
                            </button>
                        ) : (
                            <button
                                onClick={submitExam}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                            >
                                Submit Exam
                            </button>
                        )}
                    </div>
                </div>

                <aside className="w-80 bg-white border-l border-gray-200 p-6 hidden lg:block">
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">PROGRESS</h3>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            {attemptedQuestionsCount} of {questions.length} questions answered
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">QUESTION NAVIGATOR</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((q, index) => (
                                <button
                                    key={q.id}
                                    onClick={() => goToQuestion(index)}
                                    className={`h-10 w-10 rounded-md flex items-center justify-center text-sm font-medium ${currentQuestionIndex === index
                                        ? "bg-blue-600 text-white"
                                        : answers[q.id]
                                            ? "bg-green-100 text-green-800 border border-green-300"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={submitExam}
                            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                            Submit Exam
                        </button>
                        <button
                            onClick={saveAndExit}
                            className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Save & Exit
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default StudentExam;
