import { DataTypes } from "sequelize";
import sequelize from "../postgres/sequelize.js";

const Category = sequelize.define("Category", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  
    },
    productIds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of product IDs
        allowNull: true
    }
});

export default Category;
