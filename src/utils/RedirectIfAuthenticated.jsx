import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../store';

const RedirectIfAuthenticated = () => {
    const user = useStore(state => state.user);
    if (user) {
        return <Navigate to="/profile" replace />;
    }

    return <Outlet />;
};

export default RedirectIfAuthenticated;