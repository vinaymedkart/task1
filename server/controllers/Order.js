import {Cart,Order,CartItem ,Product} from '../models/index.js';
import { Op } from 'sequelize';


export const placeOrder= async (req, res) => {
    try {

        const {email} = req.user;
        const userEmail=email

        
        const currentCart = await Cart.findOne({
            where: { UserMail: userEmail },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    attributes: ['salesPrice', 'name', 'wsCode']
                }]
            }]
        });

        if (!currentCart) {
            return res.status(404).json({
                success: false,
                message: "No active cart found"
            });
        }

        if (!currentCart.items || currentCart.items.length === 0) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        const totalAmount = currentCart.items.reduce((sum, item) => {
            return sum + (item.Product.salesPrice * item.quantity);
        }, 0);

        const order = await Order.create({
            UserMail: userEmail,
            cartId: currentCart.id,
            totalAmount: totalAmount,
            status: "Pending"
        });

        const newCart = await Cart.create({
            UserMail: userEmail
        });

        

        return res.status(200).json({
            success: true,
            message: "Order placed successfully",
            data: {
                order: {
                    id: order.id,
                    totalAmount: order.totalAmount,
                    status: order.status,
                    createdAt: order.createdAt
                }
            }
        });

    } catch (error) {
        
        console.error("Error in placeOrder:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message
        });
    }
}




export const getOrderHistory = async (req, res) => {
    try {
        const { email } = req.user;
        
        // Fetch pending orders
        const pendingOrders = await Order.findAll({
            where: {
                UserMail: email,
                status: "Pending"
            },
            include: [{
                model: Cart,
                include: [{
                    model: CartItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        attributes: ['name', 'salesPrice', 'wsCode']
                    }]
                }]
            }],
            order: [['createdAt', 'DESC']]
        });

        // Fetch all orders (including completed/cancelled)
        const allOrders = await Order.findAll({
            where: {
                UserMail: email,
                status: {
                    [Op.in]: ["Pending", "Confirmed", "Cancelled"]
                }
            },
            include: [{
                model: Cart,
                include: [{
                    model: CartItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        attributes: ['name', 'salesPrice', 'wsCode']
                    }]
                }]
            }],
            order: [['createdAt', 'DESC']]
        });

        // Format orders for response
        const formatOrder = (order) => ({
            orderId: order.id,
            status: order.status,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            items: order.Cart?.items?.map(item => ({
                productName: item.Product.name,
                productCode: item.Product.wsCode,
                quantity: item.quantity,
                price: item.Product.salesPrice,
                subtotal: item.quantity * item.Product.salesPrice
            })) || []
        });

        // If no orders found
        if (!allOrders.length) {
            return res.status(404).json({
                success: false,
                message: "No orders found for this user"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order history retrieved successfully",
            data: {
                pendingOrders: pendingOrders.map(formatOrder),
                allOrders: allOrders.map(formatOrder),
                summary: {
                    totalOrders: allOrders.length,
                    pendingOrders: pendingOrders.length,
                    totalSpent: allOrders.reduce((sum, order) => sum + order.totalAmount, 0)
                }
            }
        });

    } catch (error) {
        console.error("Error in getOrderHistory:", error);
        
        // Handle specific database errors
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({
                success: false,
                message: "Database connection error",
                error: "Service temporarily unavailable"
            });
        }

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: "Invalid data format",
                error: error.message
            });
        }

        // Generic error response
        return res.status(500).json({
            success: false,
            message: "Failed to fetch order history",
            error: error.message
        });
    }
};


export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.body;
        const { status } = req.body;

        // Validate status
        if (!['Confirmed', 'Cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be 'Confirmed' or 'Cancelled'"
            });
        }

        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Only allow updating Pending orders
        if (order.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Can only update pending orders"
            });
        }

        // Update the order status
        await order.update({ status });

        return res.status(200).json({
            success: true,
            message: `Order ${orderId} status updated to ${status}`,
            data: {
                orderId: order.id,
                status: order.status,
                updatedAt: order.updatedAt
            }
        });

    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message
        });
    }
};

export const getAllPendingOrders = async (req, res) => {
    try {
        const pendingOrders = await Order.findAll({
            where: {
                status: 'Pending'
            },
            include: [
                {
                    model: User,
                    attributes: ['email', 'firstName','lastName'] // Include any user details you need
                },
                {
                    model: Cart,
                    include: [{
                        model: CartItem,
                        as: 'items',
                        include: [{
                            model: Product,
                            attributes: ['name', 'wsCode', 'salesPrice', 'images']
                        }]
                    }]
                }
            ],
            order: [['createdAt', 'DESC']], // Latest orders first
        });

        // Transform the data to match your frontend structure
        const formattedOrders = pendingOrders.map(order => {
            const orderData = order.get({ plain: true });
            return {
                orderId: orderData.id,
                createdAt: orderData.createdAt,
                status: orderData.status,
                totalAmount: orderData.totalAmount,
                customerEmail: orderData.UserMail,
                customerName: orderData.User.name,
                items: orderData.Cart.items.map(item => ({
                    productName: item.Product.name,
                    productCode: item.Product.wsCode,
                    price: item.Product.salesPrice,
                    quantity: item.quantity,
                    subtotal: item.Product.salesPrice * item.quantity,
                    image: item.Product.images[0] // First image of the product
                }))
            };
        });

        return res.status(200).json({
            success: true,
            message: "Pending orders retrieved successfully",
            pendingOrders: formattedOrders,
            totalOrders: formattedOrders.length
        });

    } catch (error) {
        console.error("Error in getAllPendingOrders: ", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching pending orders",
            error: error.message
        });
    }
};