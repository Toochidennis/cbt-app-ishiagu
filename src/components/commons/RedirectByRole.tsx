// src/components/commons/RedirectByRole.js
import { useAuthStore } from "@/states/AuthStore";
import { Navigate } from "react-router-dom";


const RedirectByRole = () => {
    const { isAuthenticated, role } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role === "admin") {
        return <Navigate to="/admin" replace />;
    }

    if (role === "student") {
        return <Navigate to="/student" replace />;
    }

    return <Navigate to="/unauthorized" replace />;
};

export default RedirectByRole;
