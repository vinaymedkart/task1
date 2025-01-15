import sequelize from "../postgres/sequelize.js";
import Category from "./Category.js";
import Product from "./Product.js";
import Cart from "./Cart.js";
import User from "./User.js";
import Order from "./Order.js";
import Tag from "./Tags.js";

// Initialize models
Category.initModel(sequelize);
Product.initModel(sequelize);
Cart.initModel(sequelize);
User.initModel(sequelize);
Order.initModel(sequelize);
Tag.initModel(sequelize);

// Define relationships
// Category and Product
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

// Product and Cart
Cart.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Cart, { foreignKey: "productId" });

// User and Cart
Cart.belongsTo(User, { foreignKey: "UserId" });
User.hasMany(Cart, { foreignKey: "UserId" });

// User and Order
Order.belongsTo(User, { foreignKey: "UserId" });
User.hasMany(Order, { foreignKey: "UserId" });

// Cart and Order
Order.belongsTo(Cart, { foreignKey: "cartId" });

// Product and Tag through ProductTag
const ProductTag = sequelize.define("ProductTag", {}, { timestamps: false }); // Pivot table for Product-Tag relation
Product.belongsToMany(Tag, { through: ProductTag, foreignKey: "wsCode" });
Tag.belongsToMany(Product, { through: ProductTag, foreignKey: "tagId" });

// Export everything
export {
    sequelize,
    Category,
    Product,
    Cart,
    User,
    Order,
    Tag,
    ProductTag,
};
