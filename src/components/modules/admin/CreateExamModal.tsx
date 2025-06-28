const [formErrors, setFormErrors] = useState({
    name: "",
    subject: "",
    date: "",
    time: "",
    duration: "",
    classes: "",
});

const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    const errors = {
        name: !newExam.name ? "Exam name is required" : "",
        subject: !newExam.subject ? "Subject is required" : "",
        date: !newExam.date ? "Date is required" : "",
        time: !newExam.time ? "Time is required" : "",
        duration: !newExam.duration ? "Duration is required" : "",
        classes:
            newExam.classes.length === 0
                ? "At least one class must be selected"
                : "",
    };
    setFormErrors(errors);
    // If no errors, create exam
    if (!Object.values(errors).some((error) => error)) {
        const newExamData: Exam = {
            ...newExam,
            id: exams.length + 1,
            status: "Upcoming",
        };
        setExams([...exams, newExamData]);
        setShowCreateModal(false);
        setNewExam({
            name: "",
            subject: "",
            date: "",
            time: "",
            duration: "",
            classes: [],
        });
    }
};

{
    showCreateModal && (
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
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleCreateExam}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                            <div className="mb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    Create New Exam
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Exam Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={newExam.name}
                                            onChange={(e) =>
                                                setNewExam({ ...newExam, name: e.target.value })
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {formErrors.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formErrors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Subject
                                        </label>
                                        <select
                                            id="subject"
                                            value={newExam.subject}
                                            onChange={(e) =>
                                                setNewExam({ ...newExam, subject: e.target.value })
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects
                                                .filter((subject) => subject !== "All")
                                                .map((subject, index) => (
                                                    <option key={index} value={subject}>
                                                        {subject}
                                                    </option>
                                                ))}
                                        </select>
                                        {formErrors.subject && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formErrors.subject}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="date"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                id="date"
                                                value={newExam.date}
                                                onChange={(e) =>
                                                    setNewExam({ ...newExam, date: e.target.value })
                                                }
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                            {formErrors.date && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {formErrors.date}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="time"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Time
                                            </label>
                                            <input
                                                type="time"
                                                id="time"
                                                value={newExam.time}
                                                onChange={(e) =>
                                                    setNewExam({ ...newExam, time: e.target.value })
                                                }
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                            {formErrors.time && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {formErrors.time}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="duration"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Duration
                                        </label>
                                        <input
                                            type="text"
                                            id="duration"
                                            placeholder="e.g. 2 hours, 30 minutes"
                                            value={newExam.duration}
                                            onChange={(e) =>
                                                setNewExam({ ...newExam, duration: e.target.value })
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {formErrors.duration && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formErrors.duration}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Assigned Classes
                                        </label>
                                        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                                            {classes
                                                .filter((className) => className !== "All")
                                                .map((className, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center mb-2 last:mb-0"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            id={`class-${index}`}
                                                            checked={newExam.classes.includes(className)}
                                                            onChange={() =>
                                                                handleClassSelection(className)
                                                            }
                                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                                        />
                                                        <label
                                                            htmlFor={`class-${index}`}
                                                            className="ml-2 text-sm text-gray-700 cursor-pointer"
                                                        >
                                                            {className}
                                                        </label>
                                                    </div>
                                                ))}
                                        </div>
                                        {formErrors.classes && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formErrors.classes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer !rounded-button whitespace-nowrap"
                            >
                                Create Exam
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setNewExam({
                                        name: "",
                                        subject: "",
                                        date: "",
                                        time: "",
                                        duration: "",
                                        classes: [],
                                    });
                                    setFormErrors({
                                        name: "",
                                        subject: "",
                                        date: "",
                                        time: "",
                                        duration: "",
                                        classes: "",
                                    });
                                }}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm cursor-pointer !rounded-button whitespace-nowrap"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}