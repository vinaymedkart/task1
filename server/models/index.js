import sequelize from "../postgres/sequelize.js";
import Category from "./Category.js";
import Product from "./Product.js";
import CartItem from "./CartItem.js";
import User from "./User.js";
import Order from "./Order.js";
import Tag from "./Tags.js";
import Cart from "./Cart.js"
// Initialize models
Category.initModel(sequelize);
Product.initModel(sequelize);
CartItem.initModel(sequelize);
Cart.initModel(sequelize)
User.initModel(sequelize);
Order.initModel(sequelize);
Tag.initModel(sequelize);
// Define relationships
// Category and Product
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

// Product and CartItem
CartItem.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(CartItem, { foreignKey: "productId" });

User.hasMany(Cart, { foreignKey: 'UserMail' }); // One user can have many carts
Cart.belongsTo(User, { foreignKey: 'UserMail' }); // Each cart belongs to one user


// Cart and CartItem
Cart.hasMany(CartItem, { foreignKey: "CartId", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "CartId" });

// User and Order
Order.belongsTo(User, { foreignKey: "UserMail" });
User.hasMany(Order, { foreignKey: "UserMail" });

// CartItem and Order
Order.belongsTo(Cart, { foreignKey: "CartId" });

// Product and Tag through ProductTag
const ProductTag = sequelize.define("ProductTag", {}, { timestamps: false });
Product.belongsToMany(Tag, { through: ProductTag, foreignKey: "wsCode" });
Tag.belongsToMany(Product, { through: ProductTag, foreignKey: "tagId" });
// Export everything
export {
    sequelize,
    Category,
    Product,
    CartItem,
    User,
    Order,
    Tag,
    ProductTag,
    Cart
};
