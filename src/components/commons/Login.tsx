import React, { useState } from "react";
import { useAuthStore } from "@/states/AuthStore";
import { useNavigate } from "react-router-dom";


const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    // Handle login
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // In a real app, replace this with API or Supabase call.
        if (username && password) {
            // For demo, simulate roles:
            let userRole: "admin" | "staff" | "student" = "student";

            // Dummy logic:
            if (username.startsWith("admin")) userRole = "admin";
            else if (username.startsWith("staff")) userRole = "staff";

            login(userRole);
            console.log(userRole);
            // Redirect based on role:
            switch (userRole) {
                case "admin":
                    navigate("/", { replace: true });
                    break;
                case "staff":
                    navigate("/staff", { replace: true });
                    break;
                case "student":
                    navigate("/student", { replace: true });
                    console.log(userRole);
                    break;
                default:
                    navigate("/unauthorized");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <i className="fas fa-graduation-cap text-5xl text-blue-600 mb-4"></i>
                    <h1 className="text-3xl font-bold text-gray-800">
                        CBT Examination System
                    </h1>
                    <p className="text-gray-600 mt-2">Computer-Based Testing Platform</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex text-3xl font-bold text-gray-700 justify-center mb-6">Login
                    
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-user text-gray-400"></i>
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-lock text-gray-400"></i>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 !rounded-button whitespace-nowrap cursor-pointer"
                        >
                            Login
                        </button>
                    </form>
                    <div className="text-center mt-4">
                        <a
                            href="#"
                            className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                            Forgot Password?
                        </a>
                    </div>
                </div>
                <div className="text-center mt-6 text-sm text-gray-600">
                    &copy; {new Date().getFullYear()} CBT Examination System Kings and Queens. All rights
                    reserved.
                </div>
            </div>
        </div>
    );
};

export default Login;
