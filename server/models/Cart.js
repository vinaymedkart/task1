import { DataTypes } from "sequelize";
import sequelize from "../postgres/sequelize.js";
import Customer from "./Customer.js";
import Product from "./Product.js";

const Cart = sequelize.define("Cart", {
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Customer,
            key: "id",
        },
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: "id",
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 1, // Minimum quantity is 1
        },
    },
});

export default Cart;
