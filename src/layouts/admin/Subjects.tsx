import React, { useState } from "react";
import AddSubjectModal from "@/components/modules/admin/AddSubjectModal";

const Subjects: React.FC = () => {
    // Mock data for admin dashboard
    const [showAddModal, setShowAddModal] = useState(false);

    const [subjects, setSubjects] = useState<any[]>([
        {
            id: 1,
            code: "MATH101",
            name: "Mathematics",
            teachers: ["John Smith", "Mary Johnson"],
            classes: ["Class 10A", "Class 11B", "Class 12C"],
        },
        {
            id: 2,
            code: "PHY102",
            name: "Physics",
            teachers: ["Robert Brown"],
            classes: ["Class 10A", "Class 11B"],
        },
        {
            id: 3,
            code: "CHEM103",
            name: "Chemistry",
            teachers: ["Sarah Williams", "James Davis"],
            classes: ["Class 10B", "Class 12C"],
        },
        {
            id: 4,
            code: "BIO104",
            name: "Biology",
            teachers: ["Jennifer Wilson"],
            classes: ["Class 11A", "Class 12B"],
        },
        {
            id: 5,
            code: "CS105",
            name: "Computer Science",
            teachers: ["Michael Taylor"],
            classes: ["Class 10A", "Class 12C"],
        },
    ]);

    return (
        <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-1">
                        Subject Management
                    </h2>
                    <p className="text-sm text-gray-500">
                        Create and manage subjects for your institution
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button 
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none !rounded-button whitespace-nowrap cursor-pointer">
                        <i className="fas fa-plus mr-2"></i>
                        Add New Subject
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                        All Subjects
                    </h3>
                    <div className="mt-3 sm:mt-0 flex items-center">
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-search text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                className="focus:ring-blue-500 min-h-[5vh] focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                placeholder="Search subjects..."
                            />
                        </div>
                        <div className="ml-3">
                            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none !rounded-button whitespace-nowrap cursor-pointer">
                                <i className="fas fa-filter mr-2"></i>
                                Filter
                            </button>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Subject Code
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Subject Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Assigned Teachers
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Associated Classes
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
                            {subjects.map((subject) => (
                                <tr key={subject.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {subject.code}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {subject.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {subject.teachers.join(", ")}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {subject.classes.join(", ")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 cursor-pointer">
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 !rounded-button whitespace-nowrap cursor-pointer">
                            Previous
                        </button>
                        <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 !rounded-button whitespace-nowrap cursor-pointer">
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span> to{" "}
                                <span className="font-medium">5</span> of{" "}
                                <span className="font-medium">5</span> results
                            </p>
                        </div>
                        <div>
                            <nav
                                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                aria-label="Pagination"
                            >
                                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
                                    <span className="sr-only">Previous</span>
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                                    1
                                </button>
                                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
                                    <span className="sr-only">Next</span>
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {showAddModal && (
                <AddSubjectModal
                    showAddModal={showAddModal}
                    setShowAddModal={setShowAddModal} />
            )}
        </>
    );
};

export default Subjects;
