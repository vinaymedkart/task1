import './App.css';
import React,{useEffect} from 'react';
import { Route, Routes} from 'react-router-dom';
import { useSelector } from 'react-redux';

import Auth from './components/core/PrivateRoutes/Auth.jsx';

import Navbar from './components/common/Navbar';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import Home from './pages/Home';
import { getAllTags } from './services/middlewares/tag.jsx';
import { getAllCategorys } from './services/middlewares/category.jsx';

function App() {
  const { token } = useSelector((state) => state.auth);

  


  return (
      <>
       <Navbar />
        <Routes>
        <Route path="/" element={<Home />} />
          {token ? (
              <Route path="/" element={<>Welcome to HOME PAGE</>}>
                  
              </Route>
          ) : (
              <>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </>
          )}
          {/* <Route path="*" element={<div>Page Not Found</div>} /> */}
        </Routes>  
      </>
  );
}

export default App;