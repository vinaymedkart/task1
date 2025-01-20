import React, { useEffect } from "react";
import { Search, Heart, Shield, Clock, ArrowRight } from "lucide-react";
import Feature from "../components/core/Admin/Feature.jsx";
import { useSelector } from "react-redux";
import Admin from "../components/core/PrivateRoutes/Admin.jsx";
import { useDispatch } from 'react-redux';
import ProductList from "../components/common/ProductList.jsx";

const Home = () => {
  const { data, token } = useSelector((state) => state.auth);
  const { tag } = useSelector((state) => state.appdata);
  const dispatch = useDispatch();

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Hero Section */}
      <div className="relative px-4 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-semibold text-sky-900 leading-tight">
                Making Quality Healthcare 
                <span className="text-sky-600"> Accessible to All</span>
              </h1>
              <p className="text-sky-700 text-lg max-w-xl">
                Access affordable generic medicines without compromising on quality. We're committed to making healthcare more accessible through certified generic alternatives.
              </p>
              
            </div>

            {/* Hero Image/Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <h3 className="text-xl font-semibold text-sky-900 mb-4">Why Choose Generic Medicines?</h3>
              <div className="grid gap-4">
                {[
                  {
                    icon: Heart,
                    title: "Same Quality Assurance",
                    description: "FDA approved with identical active ingredients"
                  },
                  {
                    icon: Shield,
                    title: "30-60% More Affordable",
                    description: "Significant savings without compromising quality"
                  },
                  {
                    icon: Clock,
                    title: "Quick Availability",
                    description: "Extensive stock of essential medicines"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-sky-50 rounded-xl">
                    <div className="p-2 bg-sky-100 rounded-lg">
                      <item.icon className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sky-900">{item.title}</h4>
                      <p className="text-sm text-sky-600/70">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          

          {/* Admin Features */}
          <div className="mb-16">
            <Admin>
              <Feature />
            </Admin>
          </div>

          {/* Product Listing */}
          <ProductList />
        </div>
      </div>
    </div>
  );
};

export default Home;