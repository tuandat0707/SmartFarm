import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCog, faChartBar, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../hooks/useAuthContext';
import "./WebsiteLayout.scss";

const WebsiteLayout = () => {
    const navigate = useNavigate();
    const { dispatch } = useAuthContext();

    const handleLogout = () => {
        console.log('WebsiteLayout.jsx: Logging out');
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
        navigate('/login', { replace: true });
    };

    return (
        <div className="website-layout">
            <div className="sidebar">
                <div className="sidebar-title-container">
                    <span className="sidebar-title">Smart Farm</span>
                </div>
                <nav className="nav">
                    <div className="nav-list">
                        <div className="nav-item">
                            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                                <FontAwesomeIcon icon={faHome} className="nav-icon" />
                                <span className="nav-label">Dashboard</span>
                            </NavLink>
                        </div>
                        <div className="nav-item">
                            <NavLink to="/control" className={({ isActive }) => (isActive ? "active" : "")}>
                                <FontAwesomeIcon icon={faCog} className="nav-icon" />
                                <span className="nav-label">Controls</span>
                            </NavLink>
                        </div>
                        <div className="nav-item">
                            <NavLink to="/datalog" className={({ isActive }) => (isActive ? "active" : "")}>
                                <FontAwesomeIcon icon={faChartBar} className="nav-icon" />
                                <span className="nav-label">Data</span>
                            </NavLink>
                        </div>
                        <div className="nav-item">
                            <NavLink to="/logs" className={({ isActive }) => (isActive ? "active" : "")}>
                                <FontAwesomeIcon icon={faBell} className="nav-icon" />
                                <span className="nav-label">Logs</span>
                            </NavLink>
                        </div>
                        <div className="nav-item">
                            <button className="nav-button" onClick={handleLogout}>
                                <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
                                <span className="nav-label">Log Out</span>
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
            <div className="website-layout-content">
                <Outlet />
            </div>
        </div>
    );
};

export default WebsiteLayout;