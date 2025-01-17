import sequelize from "../postgres/sequelize.js";
import Category from "./Category.js";
import Product from "./Product.js";
import CartItem from "./CartItem.js";
import User from "./User.js";
import Order from "./Order.js";
import Tag from "./Tags.js";
import Cart from "./Cart.js"
import Inventory from "./Inventory.js";
// Initialize models
Category.initModel(sequelize);
Product.initModel(sequelize);
CartItem.initModel(sequelize);
Cart.initModel(sequelize)
User.initModel(sequelize);
Order.initModel(sequelize);
Tag.initModel(sequelize);
Inventory.initModel(sequelize);

// Category and Product
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

// Product and CartItem
CartItem.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(CartItem, { foreignKey: "productId" });

User.hasMany(Cart, { foreignKey: 'UserMail' }); // One user can have many carts
Cart.belongsTo(User, { foreignKey: 'UserMail' }); // Each cart belongs to one user


// Cart and CartItem
Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

// User and Order
Order.belongsTo(User, { foreignKey: 'UserMail', targetKey: 'email' });
User.hasMany(Order, { foreignKey: 'UserMail', sourceKey: 'email' });

// CartItem and Order
Order.belongsTo(Cart, { foreignKey: "cartId" });

// Product and Tag through ProductTag
const ProductTag = sequelize.define("ProductTag", {}, { timestamps: false });
Product.belongsToMany(Tag, { through: ProductTag, foreignKey: "wsCode" });
Tag.belongsToMany(Product, { through: ProductTag, foreignKey: "tagId" });

// Product and Inventory relationship
Product.hasOne(Inventory, { foreignKey: 'wsCode' }); // One Product has one Inventory
Inventory.belongsTo(Product, { foreignKey: 'wsCode' }); // Each Inventory belongs to one Product


export {
    sequelize,
    Category,
    Product,
    CartItem,
    User,
    Order,
    Tag,
    ProductTag,
    Cart,
    Inventory
};
