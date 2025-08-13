import React, { useState, useEffect } from "react";
import { FaRegEyeSlash, FaRegEye, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoginLogo from "../assets/download.png";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.email !== "manjay.verma.coder@gmail.com") {
      newErrors.email = "Only the specified email is allowed";
    }
    if (formData.username !== "manjaycoder") {
      newErrors.username = "Only the specified username is allowed";
    }
    if (formData.password !== "Manjay.verma") {
      newErrors.password = "Incorrect password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);

    try {
      // fake login logic - just redirect
      localStorage.setItem("token", "demo-token");
      navigate("/public");
    } catch (error) {
      setErrors({ general: "Login failed" });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Left side with image */}
        <div className="md:block md:w-1/2 bg-gradient-to-br p-8 flex items-center justify-center">
          <img 
            src={LoginLogo} 
            alt="Login" 
            className="w-full h-auto rounded-lg transform hover:scale-105 transition-transform duration-500 pt-26"
          />
        </div>

        {/* Right side with form */}
        <div className={`w-full md:w-1/2 p-8 transition-all duration-300 ${shake ? 'animate-shake' : ''}`}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold  mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {errors.general && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded animate-fade-in">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 font-medium">{errors.general}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="relative group">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  className={`block w-full px-4 py-3 pl-11 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md`}
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-5">
                  <FaUser className={`h-5 w-5 ${errors.username ? 'text-red-500' : 'text-gray-400'} transition-colors duration-200`} />
                </div>
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="relative group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`block w-full px-4 py-3 pl-11 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md`}
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-5">
                  <FaEnvelope className={`h-5 w-5 ${errors.email ? 'text-red-500' : 'text-gray-400'} transition-colors duration-200`} />
                </div>
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`block w-full px-4 py-3 pl-11 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md`}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-5">
                  <FaLock className={`h-5 w-5 ${errors.password ? 'text-red-500' : 'text-gray-400'} transition-colors duration-200`} />
                </div>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center mt-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaRegEye className="h-5 w-5 text-gray-500 hover:text-blue-600 transition-colors duration-200" />
                  ) : (
                    <FaRegEyeSlash className="h-5 w-5 text-gray-500 hover:text-blue-600 transition-colors duration-200" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.password}</p>}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg shadow-md text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
