import { DataTypes } from "sequelize";
import sequelize from "../postgres/sequelize.js";

const Tag = sequelize.define("Tag", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
    },
    productIds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), 
        allowNull: true, 
    }
});

export default Tag;
