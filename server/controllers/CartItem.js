import { Cart, CartItem, User, Product } from "../models/index.js";

export const addCartItem = async (req, res) => {
    try {
        const { items } = req.body;
        const { email } = req.user;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({
                success: false,
                message: "Invalid cart items data",
            });
        }

        // Find or create cart for the user
        const [cart] = await Cart.findOrCreate({
            where: { UserMail: email },
            defaults: { UserMail: email },
            order: [['createdAt', 'DESC']]
        });
        console.log(cart.id);

        // Process each item in the batch
        const cartItemPromises = items.map(async ({ productId, quantity }) => {
            try {
                // Verify product exists
                const product = await Product.findByPk(productId);
                if (!product) {
                    throw new Error(`Product ${productId} not found`);
                }

                const [cartItem, created] = await CartItem.findOrCreate({
                    where: {
                        cartId: cart.id,
                        productId: product.wsCode
                    },
                    defaults: {
                        cartId: cart.id,
                        productId: product.wsCode,
                        quantity,
                        atPrice: product.salesPrice
                    }
                });

                if (!created) {
                    cartItem.quantity = quantity;
                    await cartItem.save();
                }

                return cartItem;
            } catch (error) {
                console.error(`Error processing item ${productId}:`, error);
                return null;
            }
        });

        const results = await Promise.all(cartItemPromises);
        const successfulItems = results.filter(item => item !== null);

        // Fetch the updated cart with product details
        const updatedCart = await Cart.findOne({
            where: { id: cart.id },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    attributes: ['wsCode', 'name', 'salesPrice', 'mrp', 'packageSize', 'images']
                }]
            }]
        });

        return res.status(200).json({
            success: true,
            cart: updatedCart,
            message: "Cart updated successfully",
        });

    } catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the cart",
        });
    }
};

export const getCartItems = async (req, res) => {
    try {
        const { email } = req.user;

        const cart = await Cart.findOne({
            where: { UserMail: email },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    attributes: ['wsCode', 'name', 'salesPrice', 'mrp', 'packageSize', 'images']
                }]
            }]
        });

        if (!cart) {
            return res.status(200).json({
                success: true,
                cartItems: [],
                message: "No cart found for user"
            });
        }

        return res.status(200).json({
            success: true,
            cart,
            message: "Cart items retrieved successfully"
        });

    } catch (error) {
        console.error("Error fetching cart items:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching cart items"
        });
    }
};
export const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const { email } = req.user;

        const cart = await Cart.findOne({
            where: { UserMail: email }
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const cartItem = await CartItem.findOne({
            where: {
                cartId: cart.id,
                productId
            }
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        // If quantity is 0 or negative, remove the item
        // console.log(
        //     "coming"
        // )
        // console.log(updatedCart)
        if (quantity <= 1) {
            await cartItem.destroy();

            // Fetch updated cart after removal
            const updatedCart = await Cart.findOne({
                where: { id: cart.id },
                include: [{
                    model: CartItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        attributes: ['wsCode', 'name', 'salesPrice', 'mrp', 'packageSize', 'images']
                    }]
                }]
            });
            return res.status(200).json({
                success: true,
                cart: updatedCart,
                message: "Cart item removed successfully"
            });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        // Fetch updated cart with product details
        const updatedCart = await Cart.findOne({
            where: { id: cart.id },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    attributes: ['wsCode', 'name', 'salesPrice', 'mrp', 'packageSize', 'images']
                }]
            }]
        });

        return res.status(200).json({
            success: true,
            cart: updatedCart,
            message: "Cart item updated successfully"
        });
    } catch (error) {
        console.error("Error updating cart item:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the cart item"
        });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { email } = req.user;

        const cart = await Cart.findOne({
            where: { UserMail: email }
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const result = await CartItem.destroy({
            where: {
                cartId: cart.id,
                productId // This should match the wsCode from Product
            }
        });

        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        // Fetch updated cart after removal
        const updatedCart = await Cart.findOne({
            where: { id: cart.id },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    attributes: ['wsCode', 'name', 'salesPrice', 'mrp', 'packageSize', 'images']
                }]
            }]
        });

        return res.status(200).json({
            success: true,
            cart: updatedCart,
            message: "Cart item removed successfully"
        });

    } catch (error) {
        console.error("Error removing cart item:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while removing the cart item"
        });
    }
};