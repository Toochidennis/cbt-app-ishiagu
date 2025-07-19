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
                                href=""
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
                            <div
                                className={`text-sm font-medium ${exam.averageScore >= 70 ? "text-green-600" : exam.averageScore >= 50 ? "text-yellow-600" : "text-red-600"}`}
                            >
                                {exam.averageScore}
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