import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../store';

const ProtectedRoute = () => {
    const user = useStore(state => state.user);
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    else if (!user.emailVerified) {
        return <Navigate to="/login?email_verified=false" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;