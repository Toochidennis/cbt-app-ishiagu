import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-5xl font-bold text-indigo-600 mb-4">404</h1>
            <p className="text-gray-600 mb-6">Oops! Page not found.</p>
            <Link
                to="/"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
                Go back home
            </Link>
        </div>
    );
};

export default PageNotFound;
