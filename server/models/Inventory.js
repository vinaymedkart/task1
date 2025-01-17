import { DataTypes,Model } from 'sequelize';

class Inventory extends Model {
    static initModel(sequelize) {
        Inventory.init({
            wsCode: {
                type: DataTypes.INTEGER,  
                allowNull: false,
                references: {
                    model: 'Products',
                    key: 'wsCode',
                }
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0,
                },
            },
        }, {
            sequelize,
            tableName: 'Inventory',
            timestamps: true,
        });
    }
}

export default Inventory;
