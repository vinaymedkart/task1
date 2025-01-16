import { DataTypes, Model } from "sequelize";

class Order extends Model {
    static initModel(sequelize) {
        Order.init(
            {
                UserMail: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    references: {
                        model: 'Users', // Name of the Users table
                        key: 'email', // Column to reference
                    },
                    onDelete: 'CASCADE', // Cascade delete carts when a user is deleted
                    onUpdate: 'CASCADE', //  Cascade updates to the email
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
