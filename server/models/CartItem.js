import { DataTypes, DATE, Model } from "sequelize";

class CartItem extends Model {
    static initModel(sequelize) {
        CartItem.init(
            {
                cartId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                productId: {
                    type: DataTypes.INTEGER,
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: true,
                        min: 1,
                    },
                },
                createdAt:{
                    type: DataTypes.DATE,
                    defaultValue:Date.now()
                },
                atPrice: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                    validate: {
                        isFloat: true,
                        min: 0.01, // Non-negative numbers greater than 0
                    },
                },
            },
            {
                sequelize,
                modelName: "CartItem",
            }
        );
    }
}

export default CartItem;
