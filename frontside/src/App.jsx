import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navbar from './components/common/Navbar';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import Home from './pages/Home';
import Cart from './pages/Cart.jsx';
import HistoryOrders from './pages/HistoryOrders.jsx';
import Admin from './components/core/PrivateRoutes/Admin.jsx';
import CustomerDetails from './pages/CustomerDetails.jsx';


function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {!token ? (
          <>
            {/* Routes for unauthenticated users */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </>
        ) : (
          <>
            {/* Routes for authenticated users */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<HistoryOrders />} />
            <Route path="/customer-details" element={<Admin><CustomerDetails /></Admin>} />

          </>
        )}

        {/* Fallback Route */}  
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
