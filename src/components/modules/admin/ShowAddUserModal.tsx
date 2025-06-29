

const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    status: true,
});
const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
});

{/* Add User Modal */ }
{
    showAddModal && (
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
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const errors = {
                                name: !newUser.name ? "Name is required" : "",
                                email: !newUser.email
                                    ? "Email is required"
                                    : !/\S+@\S+\.\S+/.test(newUser.email)
                                        ? "Invalid email format"
                                        : "",
                                password: !newUser.password
                                    ? "Password is required"
                                    : newUser.password.length < 6
                                        ? "Password must be at least 6 characters"
                                        : "",
                            };
                            setFormErrors(errors);
                            if (!Object.values(errors).some((error) => error)) {
                                const userInitials = newUser.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase();
                                const newUserData = {
                                    ...newUser,
                                    id: users.length + 1,
                                    avatar: userInitials,
                                };
                                setUsers([...users, newUserData]);
                                setShowAddModal(false);
                                setNewUser({
                                    name: "",
                                    email: "",
                                    password: "",
                                    role: "Student",
                                    status: true,
                                });
                            }
                        }}
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                            <div className="mb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    Add New User
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={newUser.name}
                                            onChange={(e) =>
                                                setNewUser({ ...newUser, name: e.target.value })
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
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={newUser.email}
                                            onChange={(e) =>
                                                setNewUser({ ...newUser, email: e.target.value })
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {formErrors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formErrors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            value={newUser.password}
                                            onChange={(e) =>
                                                setNewUser({ ...newUser, password: e.target.value })
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {formErrors.password && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formErrors.password}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="role"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Role
                                        </label>
                                        <select
                                            id="role"
                                            value={newUser.role}
                                            onChange={(e) =>
                                                setNewUser({ ...newUser, role: e.target.value })
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="Student">Student</option>
                                            <option value="Teacher">Teacher</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <div className="flex items-center">
                                            <label
                                                htmlFor="status"
                                                className="block text-sm font-medium text-gray-700 mr-3"
                                            >
                                                Status
                                            </label>
                                            <button
                                                type="button"
                                                id="status"
                                                onClick={() =>
                                                    setNewUser({
                                                        ...newUser,
                                                        status: !newUser.status,
                                                    })
                                                }
                                                className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none transition-colors ${newUser.status ? "bg-green-500" : "bg-gray-300"} cursor-pointer !rounded-button whitespace-nowrap`}
                                            >
                                                <span
                                                    className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${newUser.status ? "translate-x-6" : "translate-x-1"}`}
                                                />
                                            </button>
                                            <span className="ml-2 text-sm text-gray-500">
                                                {newUser.status ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                id="saveUserBtn"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer !rounded-button whitespace-nowrap"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                id="cancelAddUserBtn"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewUser({
                                        name: "",
                                        email: "",
                                        password: "",
                                        role: "Student",
                                        status: true,
                                    });
                                    setFormErrors({
                                        name: "",
                                        email: "",
                                        password: "",
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