import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgres', 'postgres', 'Shiv@00000', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // Disable query logging
});

export default sequelize;
