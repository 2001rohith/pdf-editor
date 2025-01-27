import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupValidation, SignupValidationErrors } from "../utils/signupValidation";
import { handleSignup } from "../services/UserService";

const SignUp: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<SignupValidationErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  console.log("signup rendered")

  const handleSubmit = async () => {
    setMessage(null);
    console.log("form submitted")

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const validationErrors = signupValidation(trimmedName, trimmedEmail, trimmedPassword);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await handleSignup({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });
      setMessage(response.message);
      navigate("/home", { state: { user: response.user } });
    } catch (error: any) {
      setMessage(error.response?.message || "Something went wrong during signup.");
    }
  };

  return (
    <div className="wrapper">
      <div className="container login-boxx">
        <div className="login-items">
          <h2 className="login-title">PDF Editor</h2>
          <h5 className="heading">Signup</h5>
          <div className="input">
            <h6 className="warning-text text-center">{message}</h6>
            <div className="form">
              {errors.name && <small className="text-danger">{errors.name}</small>}
              <input
                className="form-control text-start text-dark"
                onChange={(e) => setName(e.target.value)}
                type="text"
                name="name"
                placeholder="Enter Name"
                value={name}
                required
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
              <input
                className="form-control text-start text-dark"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                placeholder="Enter Email"
                value={email}
                required
              />
              {errors.password && <small className="text-danger">{errors.password}</small>}
              <input
                className="form-control text-dark"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                placeholder="Enter Password"
                value={password}
                required
              />
              <button
                className="btn sign-in-button my-1"
                type="button"  
                onClick={handleSubmit}
              >
                Sign Up
              </button>
            </div>
            <div className="mt-3 text-center other-options">
              <span>Already have an account?</span>
              <span className="sign-in-up-link">
                <Link to="/">Login</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
