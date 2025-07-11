import React, { useState } from "react";
import AddClassModal from "@/components/modules/admin/AddClassModal";
import AssignSubjectToClassModal from "@/components/modules/admin/AssignSubjectToClassModal";

const Classes: React.FC = () => {

    const [showAddModal, setShowAddModal] = useState(false);
    const [assignSubject, setAssignSubject] = useState(false);

    // Mock data for admin dashboard
    const [classes, setClasses] = useState<any[]>([
        {
            id: 1,
            name: "Class 10A",
            students: 32,
            subjects: ["Mathematics", "Physics", "Computer Science"],
            teacher: "John Smith",
        },
        {
            id: 2,
            name: "Class 10B",
            students: 30,
            subjects: ["Chemistry", "Biology"],
            teacher: "Sarah Williams",
        },
        {
            id: 3,
            name: "Class 11A",
            students: 28,
            subjects: ["Biology", "Physics"],
            teacher: "Jennifer Wilson",
        },
        {
            id: 4,
            name: "Class 11B",
            students: 31,
            subjects: ["Mathematics", "Physics"],
            teacher: "Mary Johnson",
        },
        {
            id: 5,
            name: "Class 12B",
            students: 27,
            subjects: ["Biology", "Chemistry"],
            teacher: "James Davis",
        },
        {
            id: 6,
            name: "Class 12C",
            students: 29,
            subjects: ["Mathematics", "Chemistry", "Computer Science"],
            teacher: "Michael Taylor",
        },
    ]);

    return (
        <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-1">
                        Class Management
                    </h2>
                    <p className="text-sm text-gray-500">
                        Create and manage classes for your institution
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 space-x-4">
                    <button
                        onClick={() => setAssignSubject(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-blue-700 focus:outline-none !rounded-button whitespace-nowrap cursor-pointer">
                        <i className="fas fa-tasks mr-2"></i>
                        Assign Subjects
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none !rounded-button whitespace-nowrap cursor-pointer">
                        <i className="fas fa-plus mr-2"></i>
                        Add New Class
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                        All Classes
                    </h3>
                    <div className="mt-3 sm:mt-0 flex items-center">
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-search text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                placeholder="Search classes..."
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
                                    Class Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Number of Students
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Assigned Subjects
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Class Teacher
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
                            {classes.map((classItem) => (
                                <tr key={classItem.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {classItem.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {classItem.students}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {classItem.subjects.join(", ")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {classItem.teacher}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="text-green-600 hover:text-green-900 mr-3 cursor-pointer">
                                            <i className="fas fa-users"></i>
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
                                <span className="font-medium">6</span> of{" "}
                                <span className="font-medium">6</span> results
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

            {/** show add class modal */}
            {showAddModal && (
                <AddClassModal
                    showAddModal={showAddModal}
                    setShowAddModal={setShowAddModal}
                />
            )}

            {assignSubject && (
                <AssignSubjectToClassModal
                    assignSubject={assignSubject}
                    setAssignSubject={setAssignSubject}
                />
            )}
        </>
    );
};

export default Classes;
