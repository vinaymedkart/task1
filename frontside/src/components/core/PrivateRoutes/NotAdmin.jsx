import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import bcrypt from 'bcryptjs';
import { jwtDecode } from 'jwt-decode';

const NotAdmin = ({ children }) => {
    const token = useSelector((state) => state.auth.token);
    const verifyData = useSelector((state) => state.auth.data);

    if (token && verifyData) {
       
    

    try {
        const decodedToken = jwtDecode(token);
        
        const { email } = decodedToken;
        const data = JSON.stringify({ email, role: "ADMIN" }); // Expected original data
        const isValid = bcrypt.compareSync(data, verifyData);
        
        if (!isValid) {
            return children; 
        } 
    } catch (error) {
        console.error("Authentication error:", error);
        
    }
}
};

export default NotAdmin;
