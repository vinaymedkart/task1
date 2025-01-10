import './App.css';
import React from 'react';
import { Route, Routes} from 'react-router-dom';
import { useSelector } from 'react-redux';

import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

function App() {
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
      
  }, []);


  return (
      <>
        <Routes>
          {token ? (
              <Route path="/dashboard" element={<>Welcome to HOME PAGE</>}>
                  
              </Route>
          ) : (
              <>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </>
          )}
        </Routes>  
      </>
  );
}

export default App;