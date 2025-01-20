import { Tag, Product, Category, Inventory, ProductTag,sequelize } from '../models/index.js';
import { Op } from 'sequelize';

export const initialCall = async (req, res) => {


    //keep empty for now
}





export const createProduct = async (req, res) => {
    try {
        const { name, salesPrice, mrp, packageSize, tags, categoryName, sell=false, stock, images } = req.body;
        
        // if(sell)sell=false
        if (!name || !salesPrice || !mrp || !packageSize || !tags || !categoryName || !stock || !sell || !images) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Parse and validate tags
        const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
        if (!Array.isArray(parsedTags) || parsedTags.length === 0) {
            return res.status(400).json({ message: "Tags array is required and cannot be empty" });
        }

        // Check if the category exists
        const existingCategory = await Category.findByPk(categoryName);
        if (!existingCategory) {
            return res.status(404).json({ message: `Category with name ${categoryName} not found` });
        }

        // Parse and validate images
        const parsedImages = Array.isArray(images) ? images : JSON.parse(images);
        if (!Array.isArray(parsedImages) || parsedImages.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }

        // Create the product
        const newProduct = await Product.create({
            name,
            salesPrice,
            mrp,
            packageSize,
            images: parsedImages,
            categoryName,
        });

        // Add tags to Product
        const tagInstances = await Tag.findAll({
            where: { name: parsedTags }, // Match tags by name
        });

        if (tagInstances.length !== parsedTags.length) {
            return res.status(400).json({ message: "Some tags are invalid or do not exist in the database" });
        }

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
        const page = parseInt(req.query.page || 1, 10);
        const limit = 6;
        const offset = (page - 1) * limit;
        const { searchbar = "", tags = [], categorys = [] } = req.body;

// console.log(searchbar)
// console.log(tags)
// console.log(categorys)


        // Initialize the base whereClause
        const whereClause = {
            [Op.and]: [],
        };

        // Adding searchbar condition (search by name or wsCode)
        if (searchbar) {
            // Check if searchbar contains only numbers
            const isNumeric = /^\d+$/.test(searchbar);
            
            if (isNumeric) {
                whereClause[Op.and].push({
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${searchbar}%` } },
                        { wsCode: parseInt(searchbar, 10) },
                    ],
                });
            } else {
                whereClause[Op.and].push({
                    name: { [Op.iLike]: `%${searchbar}%` },
                });
            }
        }

        // Adding category filter - Exact match
        if (categorys?.length > 0) {
            whereClause[Op.and].push({
                categoryName: {
                    [Op.in]: categorys,
                },
            });
        }

        // Base query configuration
        const queryConfig = {
            distinct: true,
            include: [
                {
                    model: Inventory,
                    attributes: ["stock", "isActive"],
                    where: { isActive: true },
                },
                {
                    model: Category,
                    attributes: ["name", "isActive"],
                    where: { isActive: true },
                },
                {
                    model: Tag,
                    attributes: ["name"],
                    through: { attributes: [] },
                },
            ],
            where: whereClause,
            order: [["createdAt", "DESC"]],
            limit,
            offset,
        };

        // Add tag filtering if tags are provided
        if (tags?.length > 0) {
            // Find products that have ALL specified tags
            const tagWhereClause = {
                name: {
                    [Op.in]: tags,
                },
            };

            // Add to the includes
            const tagInclude = queryConfig.include.find(inc => inc.model === Tag);
            tagInclude.where = tagWhereClause;

            // Add subquery to ensure ALL tags are present
            const subQuery = `
                SELECT "ProductTags"."wsCode"
                FROM "ProductTags"
                JOIN "Tags" ON "ProductTags"."tagId" = "Tags"."tagId"
                WHERE "Tags"."name" IN (${tags.map(tag => `'${tag}'`).join(',')})
                GROUP BY "ProductTags"."wsCode"
                HAVING COUNT(DISTINCT "Tags"."name") = ${tags.length}
            `;

            whereClause[Op.and].push({
                wsCode: {
                    [Op.in]: sequelize.literal(`(${subQuery})`),
                },
            });
        }

        // Query the database
        const { rows: products, count: totalProducts } = await Product.findAndCountAll(queryConfig);

        // Format the response
        const formattedProducts = products.map((product) => ({
            wsCode: product.wsCode,
            name: product.name,
            salesPrice: product.salesPrice,
            mrp: product.mrp,
            packageSize: product.packageSize,
            images: product.images,
            categoryName: product.Category?.name || null,
            sell: product.Inventory?.isActive || false,
            stock: product.Inventory?.stock || 0,
            tags: product.Tags?.map((tag) => tag.name) || [],
        }));

        return res.status(200).json({
            success: true,
            products: formattedProducts,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            message: "Products retrieved successfully.",
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve products. Please try again later.",
            error: error.message,
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
            categoryName,
            sell,
            stock,
            wsCode,
            images
        } = req.body;

       

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
        if (categoryName) {
            const existingCategory = await Category.findByPk(categoryName);
            if (!existingCategory) {
                return res.status(404).json({
                    success: false,
                    message: `Category with id ${categoryName} not found`
                });
            }
        }

        // Handle image uploads
        const parsedImages = Array.isArray(images) ? images : [];
        if (parsedImages && (!Array.isArray(parsedImages) || parsedImages.length === 0)) {
            return res.status(400).json({
                success: false,
                message: "Images array must be valid and cannot be empty."
            });
        }

        // Update product
        await existingProduct.update({
            name: name || existingProduct.name,
            salesPrice: salesPrice || existingProduct.salesPrice,
            mrp: mrp || existingProduct.mrp,
            packageSize: packageSize || existingProduct.packageSize,
            images: parsedImages,
            categoryName: categoryName || existingProduct.categoryName,
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
            categoryName: updatedProduct.categoryName,
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

        console.log(req.header("Authorization"))
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
            error: error.message,
            
        });
    }
};