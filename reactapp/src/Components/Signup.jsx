import React, { useState, useEffect } from "react";
import { signupUser } from "../api/userApi";
import InputField from "./ReusableComponents/InputField";
import SelectField from "./ReusableComponents/Select";
import ButtonComponent from "./ReusableComponents/ButtonComponent";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Signup.css";
import StaticMessages from "../Constants/StaticMessages";

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Prevent scroll when modal is open
  useEffect(() => {
    if (showModal) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [showModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.userName.trim())
      newErrors.userName = StaticMessages.ERROR_USERNAME_REQUIRED;

    if (!formData.email)
      newErrors.email = StaticMessages.ERROR_EMAIL_REQUIRED_SIGNUP;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = StaticMessages.ERROR_EMAIL_INVALID_SIGNUP;

    if (!formData.mobile)
      newErrors.mobile = StaticMessages.ERROR_MOBILE_REQUIRED;
    else if (!/^[0-9]{10}$/.test(formData.mobile))
      newErrors.mobile = StaticMessages.ERROR_MOBILE_INVALID;

    if (!formData.password)
      newErrors.password = StaticMessages.ERROR_PASSWORD_REQUIRED_SIGNUP;
    else if (formData.password.length < 6)
      newErrors.password = StaticMessages.ERROR_PASSWORD_LENGTH_SIGNUP;

    if (!formData.confirmPassword)
      newErrors.confirmPassword = StaticMessages.ERROR_CONFIRM_PASSWORD_REQUIRED;
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = StaticMessages.ERROR_PASSWORD_MISMATCH;

    if (!formData.role) newErrors.role = StaticMessages.ERROR_ROLE_REQUIRED;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await signupUser(submitData);
      setShowModal(true);
    } catch (error) {
      console.error("Signup error:", error);

      const message =
        error.response?.data?.message ||
        (error.message?.includes("Network")
          ? StaticMessages.ERROR_SIGNUP_NETWORK
          : StaticMessages.ERROR_SIGNUP_FAILED);

      toast.error(message, {
        position: "top-right",
        autoClose: 2500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card shadow rounded overflow-hidden">
        <div className="auth-left bg-primary text-white d-flex flex-column justify-content-center align-items-center p-4">
          <h1 className="display-5 fw-bold">StartupNest</h1>
          <p className="text-center">
            Fuel your vision — connect with mentors ready to support your startup journey.
          </p>
        </div>

        <div className="auth-right bg-white p-4">
          <h2 className="mb-4 text-dark text-center">Signup</h2>
          <form onSubmit={handleSubmit}>
            <InputField
              label="User Name"
              name="userName"
              type="text"
              value={formData.userName}
              onChange={handleChange}
              error={errors.userName}
              disabled={isLoading}
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isLoading}
            />

            <InputField
              label="Mobile Number"
              name="mobile"
              type="text"
              value={formData.mobile}
              onChange={handleChange}
              error={errors.mobile}
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
                <i
                  className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide Password" : "Show Password"}
                ></i>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
            </div>

            <div className="password-field">
              <label>Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <i
                  className={`fa ${showConfirm ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                  onClick={() => setShowConfirm(!showConfirm)}
                  title={showConfirm ? "Hide Password" : "Show Password"}
                ></i>
                {errors.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword}</div>
                )}
              </div>
            </div>

            <SelectField
              label="Select Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: "Entrepreneur", label: "Entrepreneur" },
                { value: "Mentor", label: "Mentor" },
              ]}
              error={errors.role}
              disabled={isLoading}
            />

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
                  Submitting...
                </div>
              ) : (
                "Submit"
              )}
            </button>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/login" className="login-link-text">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {showModal && (
        <>
          <div
            className="modal fade show"
            tabIndex="-1"
            style={{ display: "block" }}
            aria-modal="true"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered modal-sm">
              <div className="modal-content text-center p-4">
                <p className="fs-6 mb-3">
                  {StaticMessages.SUCCESS_USER_REGISTRATION_MODAL}
                </p>
                <button
                  className="btn btn-sm btn-primary btn-auto-width"
                  onClick={handleModalClose}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default Signup;