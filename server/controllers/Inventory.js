import { Inventory, Product,Category,Tag } from '../models/index.js';
import { Op } from 'sequelize';

export const addProduct = async (req, res) => {
    try {
        const { wsCode, stock, isActive = true } = req.body;

        // Check if product exists
        const productExists = await Product.findByPk(wsCode);
        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check if inventory already exists for this product
        const existingInventory = await Inventory.findOne({
            where: { wsCode }
        });

        if (existingInventory) {
            return res.status(400).json({
                success: false,
                message: "Inventory already exists for this product"
            });
        }

        // Create new inventory record
        const inventory = await Inventory.create({
            wsCode,
            stock,
            isActive
        });

        return res.status(201).json({
            success: true,
            message: "Product added to inventory successfully",
            data: {
                wsCode: inventory.wsCode,
                stock: inventory.stock,
                isActive: inventory.isActive,
                createdAt: inventory.createdAt
            }
        });

    } catch (error) {
        console.error("Error in addProduct:", error);
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided",
                error: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to add product to inventory",
            error: error.message
        });
    }
};

export const editProduct = async (req, res) => {
    try {
        const { wsCode, stock, isActive } = req.body;

        // Check if inventory exists
        const inventory = await Inventory.findOne({
            where: { wsCode },
            include: [{
                model: Product,
                attributes: ['name']
            }]
        });

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: "Inventory not found for this product"
            });
        }

        // Validate stock if provided
        if (stock !== undefined && stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock cannot be negative"
            });
        }

        // Update inventory
        const updateData = {};
        if (stock !== undefined) updateData.stock = stock;
        if (isActive !== undefined) updateData.isActive = isActive;

        await inventory.update(updateData);

        return res.status(200).json({
            success: true,
            message: "Inventory updated successfully",
            data: {
                wsCode: inventory.wsCode,
                productName: inventory.Product?.name,
                stock: inventory.stock,
                isActive: inventory.isActive,
                updatedAt: inventory.updatedAt
            }
        });

    } catch (error) {
        console.error("Error in editProduct:", error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided",
                error: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update inventory",
            error: error.message
        });
    }
};



export async function getAllProducts() {
    try {
        const inventoryWithProducts = await Inventory.findAll({
            include: {
                model: Product,
                key: 'wsCode',  
                where: { isActive: true },  
            },
        });

        return inventoryWithProducts;
    } catch (error) {
        console.error('Error fetching products from inventory:', error);
        throw error;
    }
}


