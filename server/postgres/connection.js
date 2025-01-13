
// import { createCustomerModel } from '../model/Customer.js';
import sequelize from './sequelize.js';


// let Customer = null;
const connection = async()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        // Customer = await createCustomerModel(sequelize)
        await sequelize.sync()
        console.log("Database Synced")
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

export {connection}