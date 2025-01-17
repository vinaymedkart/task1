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
                    }
                   
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
