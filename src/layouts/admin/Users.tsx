import React, { useState, useEffect } from "react";

const Users: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [showRoleFilter, setShowRoleFilter] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showItemsPerPage, setShowItemsPerPage] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    // Mock data for users
    const [users, setUsers] = useState<User[]>([
        {
            id: 1,
            name: "John Smith",
            email: "john.smith@example.com",
            role: "Admin",
            status: true,
            avatar: "JS",
        },
        {
            id: 2,
            name: "Emily Johnson",
            email: "emily.johnson@example.com",
            role: "Teacher",
            status: true,
            avatar: "EJ",
        },
        {
            id: 3,
            name: "Michael Williams",
            email: "michael.williams@example.com",
            role: "Student",
            status: false,
            avatar: "MW",
        },
        {
            id: 4,
            name: "Sarah Brown",
            email: "sarah.brown@example.com",
            role: "Teacher",
            status: true,
            avatar: "SB",
        },
        {
            id: 5,
            name: "David Jones",
            email: "david.jones@example.com",
            role: "Student",
            status: true,
            avatar: "DJ",
        },
        {
            id: 6,
            name: "Jessica Miller",
            email: "jessica.miller@example.com",
            role: "Student",
            status: true,
            avatar: "JM",
        },
        {
            id: 7,
            name: "Thomas Davis",
            email: "thomas.davis@example.com",
            role: "Teacher",
            status: false,
            avatar: "TD",
        },
        {
            id: 8,
            name: "Jennifer Garcia",
            email: "jennifer.garcia@example.com",
            role: "Student",
            status: true,
            avatar: "JG",
        },
        {
            id: 9,
            name: "Robert Martinez",
            email: "robert.martinez@example.com",
            role: "Admin",
            status: true,
            avatar: "RM",
        },
        {
            id: 10,
            name: "Lisa Robinson",
            email: "lisa.robinson@example.com",
            role: "Student",
            status: false,
            avatar: "LR",
        },
        {
            id: 11,
            name: "Daniel Clark",
            email: "daniel.clark@example.com",
            role: "Teacher",
            status: true,
            avatar: "DC",
        },
        {
            id: 12,
            name: "Michelle Lewis",
            email: "michelle.lewis@example.com",
            role: "Student",
            status: true,
            avatar: "ML",
        },
        {
            id: 13,
            name: "James Walker",
            email: "james.walker@example.com",
            role: "Student",
            status: true,
            avatar: "JW",
        },
        {
            id: 14,
            name: "Patricia Hall",
            email: "patricia.hall@example.com",
            role: "Teacher",
            status: false,
            avatar: "PH",
        },
        {
            id: 15,
            name: "Richard Allen",
            email: "richard.allen@example.com",
            role: "Admin",
            status: true,
            avatar: "RA",
        },
    ]);
    interface User {
        id: number;
        name: string;
        email: string;
        role: string;
        status: boolean;
        avatar: string;
    }
    // Toggle sidebar
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
    // Toggle role filter dropdown
    const toggleRoleFilter = () => {
        setShowRoleFilter(!showRoleFilter);
    };
    // Handle role filter change
    const handleRoleFilterChange = (role: string) => {
        setRoleFilter(role);
        setShowRoleFilter(false);
        setCurrentPage(1);
    };
    // Toggle items per page dropdown
    const toggleItemsPerPage = () => {
        setShowItemsPerPage(!showItemsPerPage);
    };
    // Handle items per page change
    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setShowItemsPerPage(false);
        setCurrentPage(1);
    };
    // Handle delete user
    const handleDeleteUser = (user: User) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    // Toggle user status
    const toggleUserStatus = (id: number) => {
        setUsers(
            users.map((user) =>
                user.id === id ? { ...user, status: !user.status } : user,
            ),
        );
    };
    // Handle select all users
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map((user) => user.id));
        }
        setSelectAll(!selectAll);
    };
    // Handle select user
    const handleSelectUser = (id: number) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };
    // Filter users based on search query and role filter
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "All" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });
    // Calculate pagination
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    // Check if all filtered users on current page are selected
    useEffect(() => {
        const currentPageUserIds = currentUsers.map((user) => user.id);
        const allSelected = currentPageUserIds.every((id) =>
            selectedUsers.includes(id),
        );
        setSelectAll(allSelected && currentPageUserIds.length > 0);
    }, [currentUsers, selectedUsers]);
    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".role-filter-container") && showRoleFilter) {
                setShowRoleFilter(false);
            }
            if (!target.closest(".items-per-page-container") && showItemsPerPage) {
                setShowItemsPerPage(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showRoleFilter, showItemsPerPage]);
    return (
        <div className="text-gray-800">
            {/* Main Content */}

            {/* Main Content Area */}
            <main className="p-6">
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
                            <span className="text-gray-700">User Management</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            User Management
                        </h1>
                        <p className="text-gray-600">{formatDate()}</p>
                    </div>
                    <button
                        id="addUserBtn"
                        onClick={() => setShowAddModal(true)}
                        className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center cursor-pointer !rounded-button whitespace-nowrap"
                    >
                        <i className="fas fa-user-plus mr-2"></i>
                        Add New User
                    </button>
                </div>
                {/* Filters and Actions */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                />
                                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            </div>
                            <div className="relative role-filter-container w-full sm:w-auto">
                                <button
                                    onClick={toggleRoleFilter}
                                    className="flex items-center justify-between w-full sm:w-40 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer !rounded-button whitespace-nowrap"
                                >
                                    <span>
                                        {roleFilter === "All" ? "All Roles" : roleFilter}
                                    </span>
                                    <i
                                        className={`fas fa-chevron-down ml-2 transition-transform ${showRoleFilter ? "rotate-180" : ""}`}
                                    ></i>
                                </button>
                                {showRoleFilter && (
                                    <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <ul className="py-1">
                                            <li
                                                onClick={() => handleRoleFilterChange("All")}
                                                className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer ${roleFilter === "All" ? "bg-indigo-50 text-indigo-700" : ""}`}
                                            >
                                                All Roles
                                            </li>
                                            <li
                                                onClick={() => handleRoleFilterChange("Admin")}
                                                className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer ${roleFilter === "Admin" ? "bg-indigo-50 text-indigo-700" : ""}`}
                                            >
                                                Admin
                                            </li>
                                            <li
                                                onClick={() => handleRoleFilterChange("Teacher")}
                                                className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer ${roleFilter === "Teacher" ? "bg-indigo-50 text-indigo-700" : ""}`}
                                            >
                                                Teacher
                                            </li>
                                            <li
                                                onClick={() => handleRoleFilterChange("Student")}
                                                className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer ${roleFilter === "Student" ? "bg-indigo-50 text-indigo-700" : ""}`}
                                            >
                                                Student
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                                <i className="fas fa-filter mr-2"></i>
                                More Filters
                            </button>
                            <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                                <i className="fas fa-download mr-2"></i>
                                Export
                            </button>
                        </div>
                    </div>
                </div>
                {/* User Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                            />
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center">
                                            Name
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
                                            Email
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
                                            Role
                                            <button className="ml-1 text-gray-400 hover:text-gray-600 cursor-pointer !rounded-button whitespace-nowrap">
                                                <i className="fas fa-sort"></i>
                                            </button>
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Status
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
                                {currentUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleSelectUser(user.id)}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
                                                    {user.avatar}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === "Admin"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : user.role === "Teacher"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-green-100 text-green-800"
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => toggleUserStatus(user.id)}
                                                    className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none transition-colors ${user.status ? "bg-green-500" : "bg-gray-300"} cursor-pointer !rounded-button whitespace-nowrap`}
                                                >
                                                    <span
                                                        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${user.status ? "translate-x-6" : "translate-x-1"}`}
                                                    />
                                                </button>
                                                <span className="ml-2 text-sm text-gray-500">
                                                    {user.status ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user)}
                                                className="text-red-600 hover:text-red-900 cursor-pointer !rounded-button whitespace-nowrap"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() =>
                                    paginate(currentPage > 1 ? currentPage - 1 : 1)
                                }
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                    } cursor-pointer !rounded-button whitespace-nowrap`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() =>
                                    paginate(
                                        currentPage < totalPages ? currentPage + 1 : totalPages,
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                    } cursor-pointer !rounded-button whitespace-nowrap`}
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing{" "}
                                    <span className="font-medium">{indexOfFirstUser + 1}</span>{" "}
                                    to{" "}
                                    <span className="font-medium">
                                        {indexOfLastUser > filteredUsers.length
                                            ? filteredUsers.length
                                            : indexOfLastUser}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium">{filteredUsers.length}</span>{" "}
                                    results
                                </p>
                            </div>
                            <div className="flex items-center">
                                <div className="relative items-per-page-container mr-4">
                                    <button
                                        onClick={toggleItemsPerPage}
                                        className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none cursor-pointer !rounded-button whitespace-nowrap"
                                    >
                                        <span>{itemsPerPage} per page</span>
                                        <i
                                            className={`fas fa-chevron-down ml-2 transition-transform ${showItemsPerPage ? "rotate-180" : ""}`}
                                        ></i>
                                    </button>
                                    {showItemsPerPage && (
                                        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            <ul className="py-1">
                                                {[10, 25, 50, 100].map((number) => (
                                                    <li
                                                        key={number}
                                                        onClick={() => handleItemsPerPageChange(number)}
                                                        className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer ${itemsPerPage === number ? "bg-indigo-50 text-indigo-700" : ""}`}
                                                    >
                                                        {number} per page
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <nav
                                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                    aria-label="Pagination"
                                >
                                    <button
                                        onClick={() =>
                                            paginate(currentPage > 1 ? currentPage - 1 : 1)
                                        }
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-white text-gray-500 hover:bg-gray-50"
                                            } cursor-pointer !rounded-button whitespace-nowrap`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <i className="fas fa-chevron-left text-xs"></i>
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                        (number) => (
                                            <button
                                                key={number}
                                                onClick={() => paginate(number)}
                                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === number
                                                    ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                                    : "bg-white text-gray-500 hover:bg-gray-50"
                                                    } cursor-pointer !rounded-button whitespace-nowrap`}
                                            >
                                                {number}
                                            </button>
                                        ),
                                    )}
                                    <button
                                        onClick={() =>
                                            paginate(
                                                currentPage < totalPages
                                                    ? currentPage + 1
                                                    : totalPages,
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-white text-gray-500 hover:bg-gray-50"
                                            } cursor-pointer !rounded-button whitespace-nowrap`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <i className="fas fa-chevron-right text-xs"></i>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default Users;