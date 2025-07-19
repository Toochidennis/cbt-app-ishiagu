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