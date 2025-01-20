// Category.js
import { DataTypes, Model } from "sequelize";

class Category extends Model {
    static initModel(sequelize) {
        Category.init(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    primaryKey: true, 
                },
                isActive: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                },
            },
            {
                sequelize,
                modelName: "Category",
                 tableName: "Category",
                timestamps: false, // Optional: if you don't want createdAt/updatedAt columns
            }
        );
    }
}

export default Category;
