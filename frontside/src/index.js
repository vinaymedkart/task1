import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals.js';

import { BrowserRouter } from 'react-router-dom';

import { configureStore } from '@reduxjs/toolkit';
import { PersistGate } from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';

import { Provider } from 'react-redux'
import rootReducer from './redux/reducer';

import { Toaster } from 'react-hot-toast';

const store = configureStore({
  reducer: rootReducer
})
const root  = ReactDOM.createRoot(document.getElementById('root'));
// const root= createRoot(container)
// let persistor= persistStore(store)


root.render(
  <Provider store={store}>
    <BrowserRouter>
    
      <App />
      
      <Toaster/>
    </BrowserRouter>
  </Provider>
  
);

reportWebVitals();
