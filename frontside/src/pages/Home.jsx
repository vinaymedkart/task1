import React, { useEffect } from "react";
import { Search } from "lucide-react";
import Feature from "../components/core/Admin/Feature.jsx"
import { useSelector } from "react-redux";
import Admin from "../components/core/PrivateRoutes/Admin.jsx";
import {getAllTags} from "../services/middlewares/tag.jsx"
import { useDispatch } from 'react-redux';
import { getAllCategorys } from "../services/middlewares/category.jsx";
import ProductList from "../components/common/ProductList.jsx";

const Home = () => {
  const { data ,token} = useSelector((state) => state.auth);
  const {tag} = useSelector((state)=>state.appdata)
  const dispatch= useDispatch()

  

  return (
    <div className="w-full min-h-screen bg-sky-50">

      {/* Hero Section */}
      <div className="relative px-8 py-12">
        {/* Main Content */}
        <div className="max-w-md">
          <h1 className="text-4xl font-semibold text-sky-900 mb-2">
            Lenoget out Medicming
          </h1>
          <p className="text-sky-700 mb-4">
            Butthacknig fet lowkethi rendi runduntirhing
          </p>
          <button className="bg-white text-sky-900 px-6 py-2 rounded-full shadow-md">
            I SPOT WOR
          </button>
        </div>

        {/* Central Medical Icon */}
        {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 bg-sky-100 rounded-full"></div>
            <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="text-sky-600 text-6xl font-bold">+</div>
            </div>
          </div>
        </div> */}

        {/* Search Bar */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-xl">
          <div className="flex items-center bg-white rounded-full shadow-lg px-6 py-3">
            <Search className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Find Plan"
              className="ml-4 flex-1 outline-none"
            />
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </div> */}

        <div>
          { <Admin><Feature/></Admin>}
        </div>
        {
        <ProductList/>
}
      </div>
    </div>
  );
};

export default Home;