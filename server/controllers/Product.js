import Tag from '../models/Tags.js';
import Product from '../models/Product.js';


export const createProduct = async (req, res) => {
    const {
        name,
        wsCode,
        salesPrice,
        mrp,
        packageSize,
        images,
        tags,
        category,
        outOfStock,
    } = req.body;

    try {
        // Check if the product already exists (based on wsCode or name)
        const existingProduct = await Product.findOne({ where: { wsCode } });
        if (existingProduct) {
            return res.status(400).json({ message: "Product with this wsCode already exists" });
        }

        // Validate images array
        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ message: "Images are required and cannot be empty" });
        }

        // Validate tags array
        if (!Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({ message: "Tags are required and cannot be empty" });
        }

        // Create the product
        const newProduct = await Product.create({
            name,
            wsCode,
            salesPrice,
            mrp,
            packageSize,
            images,
            tags,
            category,
            outOfStock
        });

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


export const addProductToTag = async (req, res) => {
    const { productId, tagName } = req.body;

    try {
        const tag = await Tag.findOne({ where: { name: tagName } });
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // If the tag exists, add the product ID to the tag's productIds array
        tag.productIds = [...new Set([...tag.productIds, productId])]; // Ensure unique product IDs
        await tag.save();


        product.tags = [...new Set([...product.tags, tagName])]; // Ensure unique tags
        await product.save();

        return res.status(200).json({
            message: 'Product and tag updated successfully',
            tag: tag,
            product: product,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
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
