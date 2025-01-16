import { Cart, CartItem, User } from "../models/index.js";

export const addCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Product ID and quantity are required.",
            });
        }

        const { email } = req.user;

        if (!email) {
            throw new Error("User not found");
        }

        // Find the latest cart for the user
        const cart = await Cart.findOne({
            where: { UserMail: email },
            order: [["createdAt", "DESC"]], // Get the most recently created cart
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "No cart found for the user.",
            });
        }

        // Check if the product already exists in the cart
        const existingCartItem = await CartItem.findOne({
            where: { CartId: cart.id, productId },
        });

        if (existingCartItem) {
            // Increment the quantity if the item already exists
            existingCartItem.quantity ++
            ;
            await existingCartItem.save();

            return res.status(200).json({
                success: true,
                cartItem: existingCartItem,
                message: "Item quantity updated successfully.",
            });
        } else {
            // If the item does not exist, create a new cart item
            const cartItem = await CartItem.create({
                CartId: cart.id,
                productId,
                quantity,
            });

            return res.status(201).json({
                success: true,
                cartItem,
                message: "Item added to the cart successfully.",
            });
        }
    } catch (error) {
        console.error("Error adding item to cart:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding the item to the cart.",
        });
    }
};
