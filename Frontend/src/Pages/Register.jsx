import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaAddressCard,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RegisterA from "../assets/Register.png"; // Fixed import statement

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = "Username is required";
    else if (formData.username.length < 4)
      newErrors.username = "Username must be at least 4 characters";
    else if (formData.username.length > 20)
      newErrors.username = "Username must be less than 20 characters";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(formData.password))
      newErrors.password = "Password must contain an uppercase letter";
    else if (!/[0-9]/.test(formData.password))
      newErrors.password = "Password must contain a number";
    else if (!/[^A-Za-z0-9]/.test(formData.password))
      newErrors.password = "Password must contain a special character";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.fullName) newErrors.fullName = "Full name is required";

    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10,15}$/.test(formData.phone))
      newErrors.phone = "Please enter a valid phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Redirect to login with success message
      navigate("/login", {
        state: { success: "Registration successful! Please login." },
      });
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 transition-opacity duration-1000 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Left side with image */}
        <div className=" md:block md:w-1/2 bg-gradient-to-br  p-8 flex items-center justify-center">
          <img
            src={RegisterA}
            alt="Register"
            className="w-full h-auto rounded-lg  transform hover:scale-105 transition-transform duration-500 pt-36"
          />
        </div>

        {/* Right side with form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
              Create Account
            </h1>
            <p className="text-gray-600">Join us today</p>
          </div>

          {errors.general && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded animate-fade-in">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-red-500 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-700 font-medium">
                  {errors.general}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1 ml-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className={`block w-full px-4 py-3 pl-11 rounded-lg border ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md`}
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-5">
                    <FaUser
                      className={`h-5 w-5 ${
                        errors.fullName ? "text-red-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="relative group">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1 ml-1"
                >
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className={`block w-full px-4 py-3 pl-11 rounded-lg border ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md`}
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-5">
                    <FaUser
                      className={`h-5 w-5 ${
                        errors.username ? "text-red-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">
                    {errors.username}
                  </p>
                )}
              </div>
            </div>

            <div className="relative group">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1 ml-1"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`block w-full px-4 py-3 pl-11 rounded-lg border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md`}
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-5">
                  <FaEnvelope
                    className={`h-5 w-5 ${
                      errors.email ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                </div>
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="relative group">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1 ml-1"
              >
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`block w-full px-4 py-3 pl-11 rounded-lg border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md`}
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-5">
                  <FaPhone
                    className={`h-5 w-5 ${
                      errors.phone ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                </div>
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1 ml-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={`block w-full px-4 py-3 pl-11 rounded-lg border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md`}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-5">
                    <FaLock
                      className={`h-5 w-5 ${
                        errors.password ? "text-red-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="relative group">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1 ml-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className={`block w-full px-4 py-3 pl-11 rounded-lg border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md`}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-5">
                    <FaLock
                      className={`h-5 w-5 ${
                        errors.confirmPassword
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg shadow-md text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
