import React from "react";
import { Search, Heart, Shield, Clock, ArrowRight, Phone, Mail, MapPin, Pill, Star, ChevronRight } from "lucide-react";
import Feature from "../components/core/Admin/Feature.jsx";
import { useSelector } from "react-redux";
import Admin from "../components/core/PrivateRoutes/Admin.jsx";
import { useDispatch } from 'react-redux';
import ProductList from "../components/common/ProductList.jsx";
import { getAllTags } from "../services/middlewares/tag.jsx";
import { getAllCategorys } from "../services/middlewares/category.jsx";

const Home = () => {
  const { data, token } = useSelector((state) => state.auth);
  const { tag } = useSelector((state) => state.appdata);
  const dispatch = useDispatch();

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50">
      {/* Hero Section */}
      <div className="relative px-4 md:px-8 pt-24 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-sky-100 rounded-full">
                <Star className="w-4 h-4 text-sky-600 mr-2" />
                <span className="text-sm text-sky-700 font-medium">Trusted by 10,000+ customers</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-sky-900 leading-tight">
                Making Quality Healthcare
                <span className="bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent"> Accessible to All</span>
              </h1>
              <p className="text-sky-700 text-lg max-w-xl leading-relaxed">
                Access affordable generic medicines without compromising on quality. We're committed to making healthcare more accessible through certified generic alternatives.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-full font-medium hover:from-sky-700 hover:to-sky-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center">
                  Shop Now
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
                <button className="px-8 py-3 bg-white text-sky-600 rounded-full font-medium hover:bg-sky-50 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg border border-sky-100">
                  Learn More
                </button>
              </div>
            </div>

            {/* Hero Stats */}
            <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-sky-900">Why Choose Generic Medicines?</h3>
                <Pill className="w-8 h-8 text-sky-600" />
              </div>
              <div className="grid gap-6">
                {[
                  {
                    icon: Heart,
                    title: "Same Quality Assurance",
                    description: "FDA approved with identical active ingredients",
                    bgColor: "bg-rose-50",
                    iconColor: "text-rose-600"
                  },
                  {
                    icon: Shield,
                    title: "30-60% More Affordable",
                    description: "Significant savings without compromising quality",
                    bgColor: "bg-sky-50",
                    iconColor: "text-sky-600"
                  },
                  {
                    icon: Clock,
                    title: "Quick Availability",
                    description: "Extensive stock of essential medicines",
                    bgColor: "bg-emerald-50",
                    iconColor: "text-emerald-600"
                  }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 p-4 rounded-2xl hover:shadow-md transition-all duration-300 group hover:scale-105 cursor-pointer"
                    style={{ background: `${item.bgColor}` }}
                  >
                    <div className={`p-3 rounded-xl ${item.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sky-900 text-lg">{item.title}</h4>
                      <p className="text-sky-600/80">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Features */}
          <div className="mb-20">
            <Admin>
              <Feature />
            </Admin>
          </div>

          {/* Product Listing */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <ProductList />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-sky-900 to-sky-800 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-sky-600 text-2xl font-bold">+</span>
                </div>
                <h4 className="text-2xl font-bold">medisphere</h4>
              </div>
              <p className="text-sky-200 leading-relaxed">
                Making quality healthcare accessible through affordable generic medicines.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "instagram"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="p-2 bg-sky-800/50 rounded-full hover:bg-sky-700/50 transition-colors duration-300"
                  >
                    <img src={`/assets/${social}.svg`} alt={social} className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {["About Us", "Products", "Generic vs Brand", "FAQs"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sky-200 hover:text-white transition-colors duration-300 flex items-center group">
                      <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-semibold mb-6">Contact Us</h4>
              <ul className="space-y-4">
                {[
                  { icon: Phone, text: "+1 (555) 123-4567" },
                  { icon: Mail, text: "support@medisphere.com" },
                  { icon: MapPin, text: "123 Healthcare Street, City" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3 group">
                    <div className="p-2 bg-sky-800/50 rounded-lg group-hover:bg-sky-700/50 transition-colors duration-300">
                      <item.icon className="w-5 h-5 text-sky-300" />
                    </div>
                    <span className="text-sky-200">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-xl font-semibold mb-6">Newsletter</h4>
              <p className="text-sky-200 text-sm mb-6 leading-relaxed">
                Stay updated with our latest products and healthcare news.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-sky-800/50 text-white placeholder-sky-400 border border-sky-700/50 focus:outline-none focus:border-sky-500 transition-colors duration-300"
                />
                <button className="w-full px-4 py-3 bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-600 hover:to-sky-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 font-medium">
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-sky-800/50 mt-16 pt-8 text-center text-sky-300">
            <p>&copy; {new Date().getFullYear()} medisphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;