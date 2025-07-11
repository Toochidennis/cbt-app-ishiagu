import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/states/AuthStore";
import React from "react";

interface Props {
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
    const { isAuthenticated, role } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role && allowedRoles.includes(role)) {
        return <Outlet />
    }
    
    return <Navigate to="unauthorized" replace />
}

export default ProtectedRoute;