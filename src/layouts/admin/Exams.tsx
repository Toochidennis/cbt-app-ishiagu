import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreateExamModal from '@/components/modules/admin/CreateExamModal'
import DeleteExamModal from "@/components/modules/admin/DeleteExamModal";
import ExamDetailsModal from "@/components/modules/admin/ViewExamModel";
import FormattedDate from "@/components/commons/FormattedDate";

interface Exam {
  id: number;
  name: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  classes: string[];
  status: "Upcoming" | "In Progress" | "Completed";
  students?: Student[];
}

interface Student {
  id: number;
  name: string;
  class: string;
  score?: number;
  status?: "Present" | "Absent" | "Pending";
}

const Exams: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [examToView, setExamToView] = useState<Exam | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showItemsPerPage, setShowItemsPerPage] = useState(false);
  const [selectedExams, setSelectedExams] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [showSubjectFilter, setShowSubjectFilter] = useState(false);
  const [classFilter, setClassFilter] = useState("All");
  const [showClassFilter, setShowClassFilter] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [newExam, setNewExam] = useState<Omit<Exam, "id" | "status">>({
    name: "",
    subject: "",
    date: "",
    time: "",
    duration: "",
    classes: [],
  });

  // Mock data for exams
  const [exams, setExams] = useState<Exam[]>([
    {
      id: 1,
      name: "Midterm Examination",
      subject: "Mathematics",
      date: "2025-07-10",
      time: "09:00",
      duration: "2 hours",
      classes: ["Class 10A", "Class 10B"],
      status: "Upcoming",
    },
    {
      id: 2,
      name: "Final Examination",
      subject: "Physics",
      date: "2025-07-15",
      time: "10:30",
      duration: "3 hours",
      classes: ["Class 11A"],
      status: "Upcoming",
    },
    {
      id: 3,
      name: "Chapter Test",
      subject: "Chemistry",
      date: "2025-06-28",
      time: "13:00",
      duration: "1 hour",
      classes: ["Class 9A", "Class 9B", "Class 9C"],
      status: "Upcoming",
    },
    {
      id: 4,
      name: "Practical Examination",
      subject: "Biology",
      date: "2025-06-25",
      time: "14:00",
      duration: "2 hours",
      classes: ["Class 12A", "Class 12B"],
      status: "In Progress",
    },
    {
      id: 5,
      name: "Quiz",
      subject: "English",
      date: "2025-06-24",
      time: "11:00",
      duration: "30 minutes",
      classes: ["Class 8A"],
      status: "In Progress",
    },
    {
      id: 6,
      name: "Unit Test",
      subject: "History",
      date: "2025-06-20",
      time: "09:30",
      duration: "1 hour",
      classes: ["Class 7A", "Class 7B"],
      status: "Completed",
      students: [
        {
          id: 1,
          name: "Alice Johnson",
          class: "Class 7A",
          score: 85,
          status: "Present",
        },
        {
          id: 2,
          name: "Bob Smith",
          class: "Class 7A",
          score: 72,
          status: "Present",
        },
        {
          id: 3,
          name: "Charlie Brown",
          class: "Class 7B",
          score: 90,
          status: "Present",
        },
        { id: 4, name: "Diana Prince", class: "Class 7B", status: "Absent" },
      ],
    },
    {
      id: 7,
      name: "Term Examination",
      subject: "Geography",
      date: "2025-06-15",
      time: "10:00",
      duration: "2 hours",
      classes: ["Class 6A"],
      status: "Completed",
      students: [
        {
          id: 5,
          name: "Edward Norton",
          class: "Class 6A",
          score: 78,
          status: "Present",
        },
        {
          id: 6,
          name: "Fiona Apple",
          class: "Class 6A",
          score: 92,
          status: "Present",
        },
        {
          id: 7,
          name: "George Wilson",
          class: "Class 6A",
          score: 65,
          status: "Present",
        },
      ],
    },
    {
      id: 8,
      name: "Monthly Test",
      subject: "Computer Science",
      date: "2025-06-10",
      time: "13:30",
      duration: "1 hour",
      classes: ["Class 11B"],
      status: "Completed",
      students: [
        {
          id: 8,
          name: "Harry Potter",
          class: "Class 11B",
          score: 88,
          status: "Present",
        },
        {
          id: 9,
          name: "Iris West",
          class: "Class 11B",
          score: 76,
          status: "Present",
        },
        { id: 10, name: "Jack Ryan", class: "Class 11B", status: "Absent" },
      ],
    },
  ]);


  // Toggle subject filter dropdown
  const toggleSubjectFilter = () => {
    setShowSubjectFilter(!showSubjectFilter);
    if (showClassFilter) setShowClassFilter(false);
  };
  // Handle subject filter change
  const handleSubjectFilterChange = (subject: string) => {
    setSubjectFilter(subject);
    setShowSubjectFilter(false);
    setCurrentPage(1);
  };
  // Toggle class filter dropdown
  const toggleClassFilter = () => {
    setShowClassFilter(!showClassFilter);
    if (showSubjectFilter) setShowSubjectFilter(false);
  };
  // Handle class filter change
  const handleClassFilterChange = (className: string) => {
    setClassFilter(className);
    setShowClassFilter(false);
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
  // Handle delete exam
  const handleDeleteExam = (exam: Exam) => {
    setExamToDelete(exam);
    setShowDeleteModal(true);
  };

  // Handle view exam
  const handleViewExam = (exam: Exam) => {
    setExamToView(exam);
    setShowViewModal(true);
  };
  // Handle select all exams
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedExams([]);
    } else {
      setSelectedExams(filteredExams.map((exam) => exam.id));
    }
    setSelectAll(!selectAll);
  };
  // Handle select exam
  const handleSelectExam = (id: number) => {
    if (selectedExams.includes(id)) {
      setSelectedExams(selectedExams.filter((examId) => examId !== id));
    } else {
      setSelectedExams([...selectedExams, id]);
    }
  };
  // Handle date range change
  const handleDateRangeChange = (type: "start" | "end", value: string) => {
    setDateRange({
      ...dateRange,
      [type]: value,
    });
    setCurrentPage(1);
  };
  // Filter exams based on search query, subject filter, class filter, and date range
  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      subjectFilter === "All" || exam.subject === subjectFilter;
    const matchesClass =
      classFilter === "All" || exam.classes.includes(classFilter);
    const examDate = new Date(exam.date);
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    const matchesDateRange =
      (!startDate || examDate >= startDate) &&
      (!endDate || examDate <= endDate);
    return matchesSearch && matchesSubject && matchesClass && matchesDateRange;
  });

  // Calculate pagination
  const indexOfLastExam = currentPage * itemsPerPage;
  const indexOfFirstExam = indexOfLastExam - itemsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Check if all filtered exams on current page are selected
  useEffect(() => {
    const currentPageExamIds = currentExams.map((exam) => exam.id);
    const allSelected = currentPageExamIds.every((id) =>
      selectedExams.includes(id),
    );
    setSelectAll(allSelected && currentPageExamIds.length > 0);
  }, [currentExams, selectedExams]);
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
      if (!target.closest(".items-per-page-container") && showItemsPerPage) {
        setShowItemsPerPage(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSubjectFilter, showClassFilter, showItemsPerPage]);
  // Get unique subjects
  const subjects = [
    "All",
    ...Array.from(new Set(exams.map((exam) => exam.subject))),
  ];
  // Get unique classes
  const classes = [
    "All",
    ...Array.from(new Set(exams.flatMap((exam) => exam.classes))),
  ];
  // Handle create exam

  // Handle class selection for new exam
  const handleClassSelection = (className: string) => {
    if (newExam.classes.includes(className)) {
      setNewExam({
        ...newExam,
        classes: newExam.classes.filter((c) => c !== className),
      });
    } else {
      setNewExam({
        ...newExam,
        classes: [...newExam.classes, className],
      });
    }
  };
  return (
    <>
      {/* Breadcrumb and Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Exam Management
          </h1>
          <p className="text-gray-600">
          Create and manage exams
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center cursor-pointer !rounded-button whitespace-nowrap"
        >
          <i className="fas fa-plus mr-2"></i>
          Create New Exam
        </button>
      </div>
      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex w-full flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 space-x-4 ">
          <div className="relative w-full">
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
              className="flex items-center justify-between w-full sm:w-44 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer !rounded-button whitespace-nowrap"
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
              className="flex items-center justify-between w-full sm:w-44 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer !rounded-button whitespace-nowrap"
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
      {/* Exam Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8 "
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
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center">
                  Date & Time
                  <button className="ml-1 text-gray-400 hover:text-gray-600 cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-sort"></i>
                  </button>
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Assigned Class
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentExams.map((exam) => (
              <tr key={exam.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedExams.includes(exam.id)}
                      onChange={() => handleSelectExam(exam.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {exam.name}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {exam.subject}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(exam.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    <span className="ml-2">at {exam.time}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {exam.classes.length > 2
                      ? `${exam.classes[0]}, ${exam.classes[1]} +${exam.classes.length - 2}`
                      : exam.classes.join(", ")}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${exam.status === "Upcoming"
                      ? "bg-blue-100 text-blue-800"
                      : exam.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                      }`}
                  >
                    {exam.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewExam(exam)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteExam(exam)}
                    className="text-red-600 hover:text-red-900 cursor-pointer !rounded-button whitespace-nowrap"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                <span className="font-medium">{indexOfFirstExam + 1}</span>{" "}
                to{" "}
                <span className="font-medium">
                  {indexOfLastExam > filteredExams.length
                    ? filteredExams.length
                    : indexOfLastExam}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredExams.length}</span>{" "}
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

      {/* Create Exam Modal */}
      {showCreateModal && (
        <CreateExamModal
          showCreateModal={showCreateModal}
          setShowCreateModal={setShowCreateModal}
        />
      )}

      {/* View Exam Modal */}
      {showViewModal && (
        <ExamDetailsModal
          showViewModal={showViewModal}
          setShowViewModal={setShowViewModal}
          examToView={examToView}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteExamModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          examToDelete={examToDelete}
          setExamToDelete={setExamToDelete}
          exams={exams}
          setExams={setExams}
        />
      )}
    </>
  );
};
export default Exams;