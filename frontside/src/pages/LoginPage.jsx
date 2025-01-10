import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/middlewares/auth'
import { useDispatch, useSelector } from 'react-redux';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const dispatch = useDispatch()
  const navigate= useNavigate()



  const {email,password}= formData
  const [showPassword, setShowPassword] = useState(false);

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate))
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
            <label className="block text-sm font-medium text-gray-700">
              <p>Email Address <sup className="text-pink-200">*</sup></p>
              <input
                required
                type="email"
                name="email"
                value={email}
                onChange={handleOnChange}
                placeholder="Enter email address"
                className="w-full px-3 py-2 mt-1 text-gray-900 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <p>Password <sup className="text-pink-200">*</sup></p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter password"
                className="w-full px-3 py-2 mt-1 text-gray-900 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-blue-500 mt-2"
              >
                {showPassword ? "Hide" : "Show"} Password
              </button>
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              Login
            </button>
          </div>
          <div className="text-center">
            <Link to="/signup" className="text-sm text-blue-500 hover:underline">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;