// Confirm delete user
const confirmDeleteUser = () => {
    if (userToDelete) {
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        setShowDeleteModal(false);
        setUserToDelete(null);
    }
};
// Cancel delete user
const cancelDeleteUser = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
};
{/* Delete Confirmation Modal */ }
{
    showDeleteModal && (
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
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <i className="fas fa-exclamation-triangle text-red-600"></i>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Delete User
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to delete this user? This action
                                        cannot be undone.
                                    </p>
                                    {userToDelete && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
                                                    {userToDelete.avatar}
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {userToDelete.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {userToDelete.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={confirmDeleteUser}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer !rounded-button whitespace-nowrap"
                        >
                            Confirm Delete
                        </button>
                        <button
                            type="button"
                            onClick={cancelDeleteUser}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm cursor-pointer !rounded-button whitespace-nowrap"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}