import { DataTypes, DATE, Model } from "sequelize";

class Cart extends Model {
    static initModel(sequelize) {
        Cart.init(
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
                createdAt: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                },
                
            },
            {
                sequelize,
                modelName: "Cart",
            }
        );
    }
}

export default Cart;
