import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin } from '../services/UserService';

const Login: React.FC = () => {
    console.log("hello from login");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate();

    const handlesubmit = async () => {
        try {
            const trimmedEmail = email.trim();
            const trimmedPassword = password.trim();

            if (!trimmedEmail || !trimmedPassword) {
                setMessage('Enter the details');
                return;
            }
            if (trimmedEmail.length < 2) {
                setMessage('Email is too short');
                return;
            }
            if (trimmedPassword.length < 6) {
                setMessage('Password is too short');
                return;
            }

            const response = await handleLogin(trimmedEmail, trimmedPassword);

            navigate("/home", { state: { user: response.user } });
            setMessage(response.message || "Login successful!");
        } catch (error: any) {
            console.error('Error during login:', error);
            setMessage(error.response?.data?.message || 'Something went wrong during login.');
        }
    };

    return (
        <div className="wrapper">
            <div className="container login-boxx">
                <div className="login-items">
                    <h2 className="login-title">PDF Editor</h2>
                    <h5 className="heading">Login</h5>
                    <div className="input">
                        {message && (
                            <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`} role="alert">
                                {message}
                            </div>
                        )}
                        <div className="form">
                            <input
                                className="form-control text-dark"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                                placeholder="Enter Email"
                                value={email}
                            />
                            <input
                                className="form-control text-dark"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                name="password"
                                placeholder="Enter Password"
                                value={password}
                            />
                            <button
                                className="btn btn-primary sign-in-button my-1"
                                onClick={handlesubmit}
                            >
                                Sign In
                            </button>
                        </div>
                        <div className="mt-3 text-center other-options">
                            <div className="d-flex">
                                <span className="signup-link">New User?</span>
                                <span className="sign-in-up-link ms-1">
                                    <Link to="/signup">Sign Up</Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
