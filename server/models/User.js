import { DataTypes, Model } from "sequelize";

class User extends Model {
    static initModel(sequelize) {
        User.init(
            {
                firstName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: true,
                        is: /^[a-zA-Z\s]+$/, // Allows letters and spaces only
                    },
                },
                lastName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: true,
                        is: /^[a-zA-Z\s]+$/, // Allows letters and spaces only
                    },
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        isEmail: true, // Ensures valid email format
                    },
                },
                role: {
                    type: DataTypes.ENUM("ADMIN", "USER"), // Ensures role is either ADMIN or User
                    allowNull: false,
                    defaultValue:"USER",
                    validate: {
                        isIn: [["ADMIN", "USER"]], // Validates against defined values
                    },
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: true,
                        len: [8, 100], // Password length must be between 8 and 100 characters
                    },
                },
                phoneNumber: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    validate: {
                        is: /^[0-9]{10}$/, // Allows only 10-digit numbers
                    },
                },
                address: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                modelName: "User", // Updated model name to "User"
                timestamps: true, // Includes createdAt and updatedAt timestamps
            }
        );
    }
}

export default User;
