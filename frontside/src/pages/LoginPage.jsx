import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/middlewares/auth';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';



const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {token} = useSelector((state)=>state.auth)
 
  const { email, password } = formData;
  const [showPassword, setShowPassword] = useState(false);

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-sky-900">Welcome Back</h2>
            <p className="text-sky-600 mt-2">Please enter your details to sign in</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-sky-900">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
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
            </div>

            {/* Password Field */}
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
                  placeholder="Enter your password"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              {/* <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-sky-200 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-sky-700">
                  Remember me
                </label>
              </div> */}
              {/* <Link to="/forgot-password" className="text-sm text-sky-600 hover:text-sky-800 transition-colors">
                Forgot password?
              </Link> */}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Sign in
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sky-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-sky-800 hover:text-sky-900 transition-colors">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;