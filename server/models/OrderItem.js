import { DataTypes } from "sequelize";
import sequelize from "../postgres/sequelize.js";
import Order from "./Order.js";
import Product from "./Product.js";

const OrderItem = sequelize.define("OrderItem", {
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
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
            min: 1, // At least 1 quantity
        },
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true,
        },
    }
});

export default OrderItem;
