import { DataTypes } from 'sequelize';
import sequelize from '../postgres/sequelize.js'; 

const Admin = sequelize.define('Admin', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, 
            is: /^[a-zA-Z\s]+$/i,
        },
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, // Ensures last name is not empty
            is: /^[a-zA-Z\s]+$/i, // Allows only alphabets and spaces
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensures email is unique
        validate: {
            isEmail: true, // Ensures valid email format
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, // Ensures password is not empty
            len: [8, 100], // Ensures password length is between 8 and 100 characters
        },
    },
});

export default Admin;
