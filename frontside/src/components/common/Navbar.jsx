import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSignupData, setToken } from "../../redux/slices/auth";
import ProfileImage from "../../assets/profile.png";
import { IoMdCart } from "react-icons/io";
import OrderIcon from "../../assets/order.png";
import Checklist from "../../assets/checklist.png";
import NotAdmin from "../core/PrivateRoutes/NotAdmin";
import Admin from "../core/PrivateRoutes/Admin";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(setSignupData(null));
    dispatch(setToken(null));
    localStorage.removeItem("token");
    localStorage.removeItem("data");
    localStorage.removeItem("email");
    navigate("/");
    window.location.reload();
  };

  // Custom style for active NavLink
  const getNavLinkClass = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium transition-colors duration-200 ${isActive
      ? "text-sky-900 bg-white/10 rounded-full"
      : "text-sky-700 hover:text-sky-900"
    }`;

  return (
    <div className="w-full bg-sky-50">
      <div className="mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">+</span>
            </div>
            <span className="text-sky-900 text-xl font-medium">medisphere</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <NavLink to="/" className={getNavLinkClass} title="Go to Home">
              Home
            </NavLink>
            <NotAdmin>
              <NavLink to="/orders" className={getNavLinkClass} title="View Orders">
                <img src={OrderIcon} className="h-6 w-6" alt="Order Icon" />
              </NavLink>
              <NavLink to="/cart" className={getNavLinkClass} title="View Cart">
                <IoMdCart className="h-7 w-7" />
              </NavLink>
            </NotAdmin>
            <Admin>
              <NavLink to="/customer-details" className={getNavLinkClass} title="Checklist">
                <img src={Checklist} className="h-8 w-8" alt="checklist" />
              </NavLink>
            </Admin>


            {/* Auth Buttons */}
            <div className="ml-4 flex space-x-2">
              {token ? (
                <button
                  onClick={logout}
                  className="px-6 py-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors duration-200"
                  title="Logout from your account"
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="px-6 py-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors duration-200"
                    title="Login to your account"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="px-6 py-2 bg-white text-sky-600 rounded-full hover:bg-sky-50 transition-colors duration-200 shadow-sm"
                    title="Create a new account"
                  >
                    Signup
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
