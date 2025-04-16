import React from 'react';
import { useGlobalContext } from '../../context';
import "./BodyLogin.scss";

export default function BodyLogin() {
    const { setUser } = useGlobalContext();

    const handleSubmit = () => {
        setUser(true);
    };

    return (
        <div className="body-login">
            <div className="body-login-header">
                <span className="leaf-icon">🍃</span>
                <h1>Smart Farm</h1>
            </div>
            <div className="body-login-form">
                <h2>Welcome back</h2>
                <p>Please enter your credentials to login</p>
                <input placeholder="Enter your email" type="email" />
                <input placeholder="Enter your password" type="password" />
                <div className="form-options">
                    <label>
                        <input type="checkbox" /> Remember me
                    </label>
                    <a href="#" className="forgot-password">Forgot password?</a>
                </div>
                <button className="btn-login" onClick={handleSubmit}>Login</button>
                <p className="signup-link">
                    Don’t have an account? <a href="#">Sign up</a>
                </p>
            </div>
        </div>
    );
}