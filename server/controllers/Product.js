import { Tag, Product, Category, Inventory, ProductTag } from '../models/index.js';
import { uploadImageToCloudinary } from "../utils/imageUploader.js";
export const createProduct = async (req, res) => {
    try {
        const { name, salesPrice, mrp, packageSize, tags, categoryId, sell, stock } = req.body;
        const files = req.files?.images; // Access uploaded files

        if (!name || !salesPrice || !mrp || !packageSize || !tags || !categoryId || !files || stock === undefined || sell === undefined) {
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
            images: uploadedImages,
            tags: [],
            categoryId,
        });

        // Add tags to ProductTag
        const tagInstances = await Tag.findAll({
            where: { name: parsedTags },
        });

        await newProduct.addTags(tagInstances);

        // Add product to inventory
        await Inventory.create({
            wsCode: newProduct.wsCode,
            stock,
            isActive: sell,
        });

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
        const { rows: products, count: totalProducts } = await Product.findAndCountAll({
            include: [
                {
                    model: Inventory,
                    attributes: ["stock", "isActive"],
                    where: { isActive: true },
                },
                {
                    model: Category,
                    attributes: ["id", "name", "isActive"],
                },
                {
                    model: Tag,
                    attributes: ["name"],
                    through: { attributes: [] }, // Exclude junction table attributes
                },
            ],
        });

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: true,
                products: [],
                message: "No products found.",
            });
        }

        const formattedProducts = products.map((product) => ({
            wsCode: product.wsCode,
            name: product.name,
            salesPrice: product.salesPrice,
            mrp: product.mrp,
            packageSize: product.packageSize,
            images: product.images,
            categoryId: product.Category?.id || null,
            categoryName: product.Category?.name || null,
            sell: product.Inventory?.isActive || false,
            stock: product.Inventory?.stock || 0,
            tags: product.Tags?.map((tag) => tag.name) || [],
        }));

        return res.status(200).json({
            success: true,
            products: formattedProducts,
            totalProducts,
            totalPages: Math.ceil(totalProducts),
            currentPage: parseInt(req.query.page || 1, 10),
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




export const updateProduct = async (req, res) => {
    try {
        const { 
            name, 
            salesPrice, 
            mrp, 
            packageSize, 
            tags, 
            categoryId, 
            sell, 
            stock,
            wsCode 
        } = req.body;
        
        const files = req.files?.images;

        // Check if the product exists with all its associations
        const existingProduct = await Product.findByPk(wsCode, {
            include: [
                { model: Inventory },
                { model: Tag },
                { model: Category }
            ],
        });

        if (!existingProduct) {
            return res.status(404).json({ 
                success: false,
                message: `Product with wsCode ${wsCode} not found` 
            });
        }

        // Validate tags array
        const parsedTags = Array.isArray(tags) ? tags : [];
        if (tags && (!Array.isArray(parsedTags) || parsedTags.length === 0)) {
            return res.status(400).json({ 
                success: false,
                message: "Tags array must be valid and cannot be empty." 
            });
        }

        // Validate category
        if (categoryId) {
            const existingCategory = await Category.findByPk(categoryId);
            if (!existingCategory) {
                return res.status(404).json({ 
                    success: false,
                    message: `Category with id ${categoryId} not found` 
                });
            }
        }

        // Handle image uploads
        let uploadedImages = existingProduct.images || [];
        if (files) {
            const fileArray = Array.isArray(files) ? files : [files];
            const newUploadedImages = await Promise.all(
                fileArray.map(async (file) => {
                    const uploaded = await uploadImageToCloudinary(file, "task1");
                    return uploaded.secure_url;
                })
            );
            uploadedImages = [...uploadedImages, ...newUploadedImages];
        }

        // Update product
        await existingProduct.update({
            name: name || existingProduct.name,
            salesPrice: salesPrice || existingProduct.salesPrice,
            mrp: mrp || existingProduct.mrp,
            packageSize: packageSize || existingProduct.packageSize,
            images: uploadedImages,
            categoryId: categoryId || existingProduct.categoryId,
        });

        // Update tags
        if (tags) {
            const existingTagIds = await Tag.findAll({
                where: { name: parsedTags },
                attributes: ["tagId"],
            });
            const tagIds = existingTagIds.map((tag) => tag.tagId);
            await existingProduct.setTags(tagIds);
        }

        // Update inventory
        if (stock !== undefined || sell !== undefined) {
            await Inventory.update(
                {
                    stock: stock !== undefined ? stock : existingProduct.Inventory?.stock,
                    isActive: sell !== undefined ? sell : existingProduct.Inventory?.isActive,
                },
                { where: { wsCode } }
            );
        }

        // Fetch updated product with all associations
        const updatedProduct = await Product.findByPk(wsCode, {
            include: [
                { model: Inventory },
                { model: Tag },
                { model: Category }
            ],
        });

        // Format response to match frontend structure
        const formattedResponse = {
            categoryId: updatedProduct.categoryId,
            images: updatedProduct.images.map(imageUrl => ({
                name: imageUrl.split('/').pop(), // Extract filename from URL
                // Mock these values since they're not stored in backend
                lastModified: new Date().getTime(),
                lastModifiedDate: new Date().toISOString(),
                webkitRelativePath: '',
                size: 6991, // Default size
                type: 'image/jpeg' // Default type
            })),
            mrp: updatedProduct.mrp,
            name: updatedProduct.name,
            packageSize: updatedProduct.packageSize,
            salesPrice: updatedProduct.salesPrice,
            sell: updatedProduct.Inventory.isActive,
            stock: updatedProduct.Inventory.stock,
            tags: updatedProduct.Tags.map(tag => tag.name),
            wsCode: updatedProduct.wsCode
        };

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: formattedResponse
        });

    } catch (error) {
        console.error("UPDATE PRODUCT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        // Check if the product exists
        const product = await Product.findByPk(productId, {
            include: [{ model: Inventory }]
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Product with wsCode ${productId} not found`
            });
        }

        // Update the inventory status to false (deactivate it)
        await Inventory.update(
            { isActive: false },
            { where: { wsCode: product.wsCode } }
        );

        // Return a success response after updating inventory
        return res.status(200).json({
            success: true,
            message: "Product's inventory has been deactivated.",
            productId: productId
        });
    } catch (error) {
        console.error("DELETE PRODUCT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error.message
        });
    }
};