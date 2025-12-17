
import React, { useState } from "react";
import { loginUser } from "../api/userApi";
import InputField from "./ReusableComponents/InputField";
import ButtonComponent from "./ReusableComponents/ButtonComponent";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { toast } from "react-toastify";
import "./Login.css";
import StaticMessages from "../Constants/StaticMessages";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = StaticMessages.ERROR_EMAIL_REQUIRED;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = StaticMessages.ERROR_EMAIL_INVALID;

    if (!formData.password)
      newErrors.password = StaticMessages.ERROR_PASSWORD_REQUIRED;
    else if (formData.password.length < 6)
      newErrors.password = StaticMessages.ERROR_PASSWORD_LENGTH;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await loginUser(formData);
      const { token, userName, id, role } = res.data;
      const userData = { userId: id, userName, role, token };

      localStorage.clear();
      dispatch(setUser(userData));
      localStorage.setItem("userId", id);
      localStorage.setItem("userName", userName);
      localStorage.setItem("role", role);
      localStorage.setItem("token", token);

      toast.success(StaticMessages.SUCCESS_LOGIN, {
        position: "top-right",
        autoClose: 1500,
      });

      setTimeout(() => {
        if (role === "Mentor") navigate("/mentor/home");
        else if (role === "Entrepreneur") navigate("/entrepreneur/home");
        else navigate("/home");
      }, 1600);
    } catch (error) {
      setIsLoading(false);
      const message =
        error.response?.data?.message ||
        StaticMessages.ERROR_INVALID_CREDENTIALS;
      setErrors({ general: message });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="auth-card shadow rounded overflow-hidden bg-white">
        <div className="auth-left bg-primary text-white d-flex flex-column justify-content-center align-items-center p-4">
          <h1 className="display-5 fw-bold">StartupNest</h1>
          <p className="text-center">
            Fuel your vision — connect with mentors ready to support your startup journey.
          </p>
        </div>
        <div className="auth-right p-4">
          <h2 className="form-title text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit} noValidate>
            {errors.general && (
              <div className="alert alert-danger text-center py-2 mb-3" role="alert">
                {errors.general}
              </div>
            )}
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isLoading}
            />
            <div className="password-field">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />

                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-100 mt-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>

            <p className="login-link-text text-center mt-3">
              Don't have an account? <Link to="/signup">Signup</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;