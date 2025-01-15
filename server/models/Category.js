// Category.js
import { DataTypes, Model } from "sequelize";

class Category extends Model {
    static initModel(sequelize) {
        Category.init(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                isActive: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                },
            },
            {
                sequelize,
                modelName: "Category",
            }
        );
    }
}

export default Category;
