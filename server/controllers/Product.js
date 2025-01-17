import Tag from '../models/Tags.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { uploadImageToCloudinary } from "../utils/imageUploader.js";


export const createProduct = async (req, res) => {
    try {
        const { name, salesPrice, mrp, packageSize, tags, categoryId, sell } = req.body;
        const files = req.files?.images; // Access uploaded files

        if (!name || !salesPrice || !mrp || !packageSize || !tags || !categoryId || !files || !sell) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate `tags` array
        const parsedTags = JSON.parse(tags); // Parse tags if they are sent as a string
        if (!Array.isArray(parsedTags) || parsedTags.length === 0) {
            return res.status(400).json({ message: "Tags array is required and cannot be empty" });
        }

        // Check if the category exists
        const existingCategory = await Category.findByPk(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ message: `Category with id ${categoryId} not found` });
        }

        // Handle single or multiple file uploads
        const fileArray = Array.isArray(files) ? files : [files];

        const uploadedImages = await Promise.all(
            fileArray.map(async (file) => {
                const uploaded = await uploadImageToCloudinary(file, "task1");
                return uploaded.secure_url; // Collect secure URLs
            })
        );

        // Create the product
        const newProduct = await Product.create({
            name,
            salesPrice,
            mrp,
            packageSize,
            images: uploadedImages, // Save Cloudinary URLs
            tags: parsedTags,
            categoryId,
            sell: true,
        });

        console.log(newProduct);

        return res.status(201).json({
            message: "Product created successfully",
            success: true,
            product: newProduct,
        });
    } catch (error) {
        console.error("CREATE PRODUCT ERROR: ", error);
        return res.status(500).json({
            message: "Failed to create product",
            error: error.message,
        });
    }
};


export const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10

        // Calculate offset
        const offset = (page - 1) * limit;

        // Fetch products with pagination
        const { rows: products, count: totalProducts } = await Product.findAndCountAll({
            offset: parseInt(offset),
            limit: parseInt(limit),
        });

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: true,
                products:[],
                message: "No products found.",
            });
        }

        return res.status(200).json({
            success: true,
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: parseInt(page),
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
