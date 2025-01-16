import { DataTypes, DATE, Model } from "sequelize";

class CartItem extends Model {
    static initModel(sequelize) {
        CartItem.init(
            {
                CartId: {
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
                }
            },
            {
                sequelize,
                modelName: "CartItem",
            }
        );
    }
}

export default CartItem;
