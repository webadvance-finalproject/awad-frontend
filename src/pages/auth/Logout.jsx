import React, { useEffect } from 'react';
import { auth } from '../../config/firebase';
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                await signOut(auth); // Đăng xuất người dùng
                navigate("/login"); // Điều hướng đến trang login
            } catch (error) {
                console.error("Error during logout:", error);
            }
        };

        logout();
    }, [navigate]);

    return (
        <div>
            <p>Logging out...</p>
        </div>
    )
};

export default Logout;
