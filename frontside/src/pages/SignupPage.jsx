import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setSignupData } from '../redux/slices/auth';
import { sendOtp } from '../services/middlewares/auth';
import toast from 'react-hot-toast';

const SignupPage = () => {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName:"",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate= useNavigate();
  const dispatch= useDispatch();

  const { firstName,lastName, email, password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords Do Not Match")
      return
    }
    
    dispatch(setSignupData(formData))
    console.log(formData.email);
    dispatch(sendOtp(formData.email, navigate))

    // setFormData({
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   password: "",
    //   confirmPassword: "",
    // })

  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <p>Firstname <sup className="text-pink-200">*</sup></p>
              <input
                required
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleOnChange}
                placeholder="Enter firstname"
                className="w-full px-3 py-2 mt-1 text-gray-900 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <p>Lastname <sup className="text-pink-200">*</sup></p>
              <input
                required
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleOnChange}
                placeholder="Enter lastname"
                className="w-full px-3 py-2 mt-1 text-gray-900 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </label>
          </div>
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
            <label className="block text-sm font-medium text-gray-700">
              <p>Confirm Password <sup className="text-pink-200">*</sup></p>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm password"
                className="w-full px-3 py-2 mt-1 text-gray-900 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-blue-500 mt-2"
              >
                {showConfirmPassword ? "Hide" : "Show"} Confirm Password
              </button>
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              Sign Up
            </button>
          </div>
          <div className="text-center">
            <Link to="/login" className="text-sm text-blue-500 hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;