import { DataTypes } from "sequelize";
import sequelize from "../postgres/sequelize.js";

const Product = sequelize.define("Product", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[a-zA-Z\s]+$/, // Only contains strings
            notEmpty: true,
        },
    },
    wsCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 0, // Non-negative numbers
        },
    },
    salesPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true,
            min: 0.01, // Non-negative numbers greater than 0
        },
    },
    mrp: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true,
            min: 0.01,
        },
    },
    packageSize: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true,
            min: 0.01,
        },
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING), 
        allowNull: false,
        validate: {
            isImageFormat(value) {
                value.forEach((img) => {
                    if (!/\.(png|jpeg|webp)$/i.test(img)) {
                        throw new Error("Images must be .png, .jpeg, or .webp");
                    }
                });
            },
        },
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING), 
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    category: {
        type:DataTypes.STRING, 
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    sell: {
        type:DataTypes.BOOLEAN, 
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    }
});

export default Product;
