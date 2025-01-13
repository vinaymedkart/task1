import { DataTypes } from "sequelize";
import sequelize from "../postgres/sequelize.js";
import Customer from "./Customer.js";

const Order = sequelize.define("Order", {
   
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Customer,
            key: "id",
        },
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true,
            min: 0.01,
        },
    },
    status: {
        type: DataTypes.ENUM("Pending", "Confirmed"),
        defaultValue: "Pending",
    },
});

export default Order;
