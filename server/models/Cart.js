import { DataTypes, Model } from "sequelize";

class Cart extends Model {
    static initModel(sequelize) {
        Cart.init(
            {
                UserId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                productId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        isInt: true,
                        min: 1,
                    },
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
