import { DataTypes, Model } from "sequelize";

class Product extends Model {
    static initModel(sequelize) {
        Product.init(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        is: /^[a-zA-Z\s]+$/, // Only contains strings
                        notEmpty: true,
                    },
                },
                wsCode: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true, // Primary key
                    autoIncrement: true, // auto-increment
                    validate: {
                        isInt: true,
                        min: 0,
                    },
                },
                salesPrice: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                    validate: {
                        isFloat: true,
                        min: 0.01, // Non-negative numbers greater than 0
                    },
                },
                mrp: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                    validate: {
                        isFloat: true,
                        min: 0.01,
                    },
                },
                packageSize: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                    validate: {
                        isFloat: true,
                        min: 0.01,
                    },
                },
                images: {
                    type: DataTypes.ARRAY(DataTypes.STRING),
                    allowNull: false,
                    validate: {
                        isImageFormat(value) {
                            value.forEach((img) => {
                                if (!/\.(png|jpeg|webp|jpg)$/i.test(img)) {
                                    throw new Error(
                                        "Images must be .png, .jpeg, or .webp"
                                    );
                                }
                            });
                        },
                    },
                },
                categoryId: {
                    type: DataTypes.INTEGER, // Foreign key
                    allowNull: false,
                },
                sell: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    validate: {
                        notEmpty: true,
                    },
                },
            },
            {
                sequelize,
                modelName: "Product",
            }
        );
    }
}

export default Product;
