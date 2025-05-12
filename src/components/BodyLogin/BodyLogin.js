import React from 'react';
import "./BodyLogin.scss";

const BodyLogin = ({ email, setEmail, password, setPassword, login, error, isLoading, navigate }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
        navigate("/"); // Redirect to home on successful login
    };

    const handleSignupRedirect = () => {
        navigate("/signup");
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
                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Enter your email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <input
                        placeholder="Enter your password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <div className="form-options">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>
                    <button disabled={isLoading} className="btn-login">Login</button>
                    {error && <div className="error">{error}</div>}
                    <p className="signup-link">
                        Don’t have an account? <a href="#" onClick={handleSignupRedirect}>Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default BodyLogin;