import { DataTypes, Model } from "sequelize";

class Tag extends Model {
    static initModel(sequelize) {
        Tag.init(
            {
                tagId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    unique: true,
                    allowNull: false,
                },
                isActive: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: "Tag",
            }
        );
    }
}

export default Tag;
