import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSignupData, setToken } from "../../redux/slices/auth";
import { ShoppingCart, Package, ClipboardList, Menu, X } from "lucide-react";
import NotAdmin from "../core/PrivateRoutes/NotAdmin";
import Admin from "../core/PrivateRoutes/Admin";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    dispatch(setSignupData(null));
    dispatch(setToken(null));
    localStorage.removeItem("token");
    localStorage.removeItem("data");
    localStorage.removeItem("email");
    navigate("/login");
    window.location.reload();
  };

  const getNavLinkClass = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full
    ${isActive
      ? "text-sky-900 bg-white shadow-sm"
      : "text-sky-700 hover:text-sky-900 hover:bg-white/50"
    }`;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 
      ${isScrolled 
        ? "bg-white/80 backdrop-blur-md shadow-md" 
        : "bg-sky-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-white text-xl font-bold">+</span>
            </div>
            <span className="text-sky-900 text-xl font-semibold tracking-tight">
              medisphere
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {token && (
              <NavLink to="/" className={getNavLinkClass}>
                Home
              </NavLink>
            )}
            
            <NotAdmin>
              <NavLink to="/orders" className={getNavLinkClass} title="View Orders">
                <div className="flex items-center space-x-1">
                  <Package className="w-5 h-5" />
                  <span>Orders</span>
                </div>
              </NavLink>
              
              <NavLink to="/cart" className={getNavLinkClass} title="View Cart">
                <div className="flex items-center space-x-1">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                </div>
              </NavLink>
            </NotAdmin>

            <Admin>
              <NavLink to="/customer-details" className={getNavLinkClass} title="Customer Details">
                <div className="flex items-center space-x-1">
                  <ClipboardList className="w-5 h-5" />
                  <span>Customers</span>
                </div>
              </NavLink>
            </Admin>

            {/* Auth Buttons */}
            <div className="ml-4 flex items-center space-x-3">
              {token ? (
                <button
                  onClick={logout}
                  className="px-6 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-full hover:from-sky-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="px-6 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-full hover:from-sky-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="px-6 py-2 bg-white text-sky-600 rounded-full hover:bg-sky-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-sky-100"
                  >
                    Signup
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden rounded-full p-2 hover:bg-sky-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-sky-900" />
            ) : (
              <Menu className="h-6 w-6 text-sky-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-white/80 backdrop-blur-md">
          {token && (
            <NavLink
              to="/"
              className="block px-4 py-2 text-sky-700 hover:bg-sky-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </NavLink>
          )}
          
          <NotAdmin>
            <NavLink
              to="/orders"
              className="block px-4 py-2 text-sky-700 hover:bg-sky-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Orders</span>
              </div>
            </NavLink>
            
            <NavLink
              to="/cart"
              className="block px-4 py-2 text-sky-700 hover:bg-sky-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
              </div>
            </NavLink>
          </NotAdmin>

          <Admin>
            <NavLink
              to="/customer-details"
              className="block px-4 py-2 text-sky-700 hover:bg-sky-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <ClipboardList className="w-5 h-5" />
                <span>Customers</span>
              </div>
            </NavLink>
          </Admin>

          <div className="pt-2 space-y-2">
            {token ? (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-6 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg"
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="block w-full px-6 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="block w-full px-6 py-2 bg-white text-sky-600 rounded-lg text-center border border-sky-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar