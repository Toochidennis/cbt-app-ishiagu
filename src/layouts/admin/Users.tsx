import React, { useState } from "react";
import AddUserForm from "@/components/modules/admin/UserForm";

const Users: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'teachers' | 'students'>('teachers');
    const [showAddModal, setShowAddModal] = useState(false);
    // Mock data for admin dashboard

    const [teachers, setTeachers] = useState<any[]>([
        {
            id: 1,
            name: "John Smith",
            email: "john.smith@school.edu",
            subjects: ["Mathematics"],
            classes: ["Class 10A"],
        },
        {
            id: 2,
            name: "Mary Johnson",
            email: "mary.johnson@school.edu",
            subjects: ["Mathematics"],
            classes: ["Class 11B"],
        },
        {
            id: 3,
            name: "Sarah Williams",
            email: "sarah.williams@school.edu",
            subjects: ["Chemistry"],
            classes: ["Class 10B"],
        },
        {
            id: 4,
            name: "James Davis",
            email: "james.davis@school.edu",
            subjects: ["Chemistry"],
            classes: ["Class 12B"],
        },
        {
            id: 5,
            name: "Jennifer Wilson",
            email: "jennifer.wilson@school.edu",
            subjects: ["Biology"],
            classes: ["Class 11A"],
        },
        {
            id: 6,
            name: "Michael Taylor",
            email: "michael.taylor@school.edu",
            subjects: ["Computer Science"],
            classes: ["Class 12C"],
        },
        {
            id: 7,
            name: "Robert Brown",
            email: "robert.brown@school.edu",
            subjects: ["Physics"],
            classes: ["Class 10A", "Class 11B"],
        },
    ]);

    const [students, setStudents] = useState<any[]>([
        {
            id: 1,
            name: "Emma Thompson",
            email: "emma.t@student.edu",
            class: "Class 10A",
            regNumber: "STD10001",
        },
        {
            id: 2,
            name: "Noah Garcia",
            email: "noah.g@student.edu",
            class: "Class 10A",
            regNumber: "STD10002",
        },
        {
            id: 3,
            name: "Olivia Martinez",
            email: "olivia.m@student.edu",
            class: "Class 10B",
            regNumber: "STD10003",
        },
        {
            id: 4,
            name: "Liam Robinson",
            email: "liam.r@student.edu",
            class: "Class 11A",
            regNumber: "STD11001",
        },
        {
            id: 5,
            name: "Ava Clark",
            email: "ava.c@student.edu",
            class: "Class 11B",
            regNumber: "STD11002",
        },
        {
            id: 6,
            name: "William Rodriguez",
            email: "william.r@student.edu",
            class: "Class 12B",
            regNumber: "STD12001",
        },
        {
            id: 7,
            name: "Sophia Lee",
            email: "sophia.l@student.edu",
            class: "Class 12C",
            regNumber: "STD12002",
        },
        {
            id: 8,
            name: "James White",
            email: "james.w@student.edu",
            class: "Class 10A",
            regNumber: "STD10004",
        },
        {
            id: 9,
            name: "Charlotte King",
            email: "charlotte.k@student.edu",
            class: "Class 11A",
            regNumber: "STD11003",
        },
        {
            id: 10,
            name: "Benjamin Wright",
            email: "benjamin.w@student.edu",
            class: "Class 12C",
            regNumber: "STD12003",
        },
    ]);


    return (
        <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-1">
                        User Management
                    </h2>
                    <p className="text-sm text-gray-500">
                        Create and manage user accounts for teachers and students
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none !rounded-button whitespace-nowrap cursor-pointer">
                        <i className="fas fa-user-plus mr-2"></i>
                        Add New User
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex" aria-label="Tabs">
                        <button
                            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm cursor-pointer ${activeTab === 'teachers'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            onClick={() => setActiveTab('teachers')}
                        >
                            Teachers
                        </button>
                        <button
                            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm cursor-pointer ${activeTab === 'students'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            onClick={() => setActiveTab('students')}
                        >
                            Students
                        </button>
                    </nav>
                </div>

                {/* Conditional title */}
                <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                        {activeTab === 'teachers' ? 'All Teachers' : 'All Students'}
                    </h3>
                    {/* reuse same search/filter bar */}
                    <div className="mt-3 sm:mt-0 flex items-center">
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-search text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                className="focus:ring-blue-500 h-8 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                placeholder={`Search ${activeTab}...`}
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

                {/* Conditionally render either table */}
                {activeTab === 'teachers' ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Subjects
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Classes
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
                                {teachers.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <i className="fas fa-user text-gray-500"></i>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {teacher.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {teacher.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {teacher.subjects.join(", ")}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {teacher.classes.join(", ")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-yellow-600 hover:text-yellow-900 mr-3 cursor-pointer">
                                                <i className="fas fa-key"></i>
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
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg. Number</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <i className="fas fa-user text-gray-500"></i>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {student.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.class}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.regNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-yellow-600 hover:text-yellow-900 mr-3 cursor-pointer">
                                                <i className="fas fa-key"></i>
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
                )}

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
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to{" "}
                            <span className="font-medium">
                                {activeTab === 'teachers' ? teachers.length : students.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                                {activeTab === 'teachers' ? teachers.length : students.length}
                            </span>{" "}
                            results
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
                <AddUserForm
                    showAddModal={showAddModal}
                    setShowAddModal={setShowAddModal}
                />
            )}
        </>
    );
};

export default Users;
