import { DataTypes, Model } from "sequelize";

class Order extends Model {
    static initModel(sequelize) {
        Order.init(
            {
                UserId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                cartId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
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
                    type: DataTypes.ENUM("Pending", "Confirmed", "Cancelled"),
                    defaultValue: "Pending",
                },
            },
            {
                sequelize,
                modelName: "Order",
            }
        );
    }
}

export default Order;
