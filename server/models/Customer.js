import { DataTypes } from "sequelize";
import sequelize from "../postgres/sequelize.js";

const Customer = sequelize.define("Customer", {
    
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, // Ensures first name is not empty
            is: /^[a-zA-Z\s]+$/i, // Allows only alphabets and spaces
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
        unique: true,
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
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: /^[0-9]{10}$/, // Ensures valid 10-digit phone number
        },
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true, // Address is optional
    },
});


export default Customer;
