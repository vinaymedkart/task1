import Tag from '../models/Tags.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const createProduct = async (req, res) => {
    const {
        name,
        salesPrice,
        mrp,
        packageSize,
        images,
        tags,
        categoryId,
        sell,
    } = req.body;

    try {
        // Validate `images` array
        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ message: "Images array is required and cannot be empty" });
        }

        // Validate `tags` array
        if (!Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({ message: "Tags array is required and cannot be empty" });
        }

        // Check if the category exists
        const existingCategory = await Category.findByPk(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ message: `Category with id ${categoryId} not found` });
        }

        // Create the product
        const newProduct = await Product.create({
            name,
            salesPrice,
            mrp,
            packageSize,
            images,
            categoryId,
            sell,
        });

        // Link tags to the product
        const tagInstances = await Tag.findAll({
            where: { tagId: tags },
        });

        if (tagInstances.length !== tags.length) {
            return res.status(400).json({ message: "Some tags were not found" });
        }

        await newProduct.addTags(tagInstances);

        return res.status(201).json({
            message: "Product created successfully",
            product: newProduct,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to create product",
            error: error.message,
        });
    }
};
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll(); // Fetch all products from the database

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found.",
            });
        }

        return res.status(200).json({
            success: true,
            products,
            message: "Products retrieved successfully.",
        });
    } catch (error) {
        console.error("Error fetching products:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve products. Please try again later.",
        });
    }
};
