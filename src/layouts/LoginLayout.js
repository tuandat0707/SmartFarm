import React from 'react';
import { Outlet } from 'react-router-dom';
import "./LoginLayout.scss";

const LoginLayout = () => {
    return (
        <div className="login-layout">
            <Outlet />
        </div>
    );
};

export default LoginLayout;