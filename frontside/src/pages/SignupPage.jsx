import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setSignupData } from '../redux/slices/auth';
import { signUp } from '../services/middlewares/auth';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords Do Not Match");
      return;
    }
    
    dispatch(setSignupData(formData));
    dispatch(signUp(formData, navigate));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">+</span>
            </div>
            <span className="text-sky-900 text-2xl font-medium">medisphere</span>
          </div>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-sky-900">Create Account</h2>
            <p className="text-sky-600 mt-2">Please fill in your details to sign up</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-sky-900">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={handleOnChange}
                  placeholder="First name"
                  className="w-full px-4 py-3 rounded-xl border border-sky-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all text-sky-900 placeholder:text-sky-300"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-sky-900">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={handleOnChange}
                  placeholder="Last name"
                  className="w-full px-4 py-3 rounded-xl border border-sky-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all text-sky-900 placeholder:text-sky-300"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-sky-900">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="email"
                name="email"
                value={email}
                onChange={handleOnChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-sky-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all text-sky-900 placeholder:text-sky-300"
              />
            </div>

            {/* Password Fields */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-sky-900">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                  placeholder="Create password"
                  className="w-full px-4 py-3 rounded-xl border border-sky-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all text-sky-900 placeholder:text-sky-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-sky-900">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleOnChange}
                  placeholder="Confirm password"
                  className="w-full px-4 py-3 rounded-xl border border-sky-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all text-sky-900 placeholder:text-sky-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 rounded border-sky-200 text-sky-600 focus:ring-sky-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-sky-700">
                I agree to the{' '}
                <Link to="/terms" className="text-sky-600 hover:text-sky-800">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-sky-600 hover:text-sky-800">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Create Account
            </button>

            {/* Login Link */}
            <p className="text-center text-sky-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-sky-800 hover:text-sky-900 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;