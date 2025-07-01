import { Link } from "react-router-dom";
import React from "react";

const Unauthorized: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 p-4">
            <i className="fas fa-ban text-red-500 text-6xl mb-4"></i>
            <h1 className="text-3xl font-bold text-red-600 mb-2">
                403 - Unauthorized
            </h1>
            <p className="text-gray-600 mb-6">
                You do not have permission to access this page.
            </p>
            <Link
                to="/"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default Unauthorized;
