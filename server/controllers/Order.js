import {Cart,Order,CartItem ,Product, User} from '../models/index.js';
import { Op,Sequelize } from 'sequelize';


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
        console.log(currentCart.id)
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

        // Calculate confirmed orders count and total spend
        const confirmedOrders = allOrders.filter(order => order.status === "Confirmed");
        const totalSpent = confirmedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        return res.status(200).json({
            success: true,
            message: "Order history retrieved successfully",
            data: {
                pendingOrders: pendingOrders.map(formatOrder),
                allOrders: allOrders.map(formatOrder),
                summary: {
                    totalOrders: allOrders.length,
                    pendingOrders: pendingOrders.length,
                    confirmedOrders: confirmedOrders.length,
                    totalSpent: totalSpent
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
}

export const getAllPendingOrders = async (req, res) => {
    try {
        const pendingOrders = await Order.findAll({
            where: { 
                status: "Pending" 
            },
            include: [
                {
                    model: Cart,
                    required: true, 
                    include: [{
                        model: CartItem,
                        as: 'items',
                        required: true, 
                        include: [{
                            model: Product,
                            required: true, // This ensures Product exists
                            attributes: ['name', 'wsCode', 'salesPrice']
                        }]
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formattedOrders = pendingOrders.map(order => {
            const orderData = order.get({ plain: true });
            return {
                orderId: orderData.id,
                status: orderData.status,
                totalAmount: orderData.totalAmount || 0,
                createdAt: orderData.createdAt,
                items: orderData.Cart?.items?.map(item => ({
                    productName: item?.Product?.name || 'Unknown Product',
                    productCode: item?.Product?.wsCode || 'N/A',
                    price: item?.Product?.salesPrice || 0,
                    quantity: item?.quantity || 0,
                    subtotal: (item?.Product?.salesPrice || 0) * (item?.quantity || 0)
                })) || []
            };
        });

        return res.status(200).json({
            success: true,
            data: {
                pendingOrders: formattedOrders
            }
        });

    } catch (error) {
        console.error('Error in getAllPendingOrders:', error);
        return res.status(500).json({
            success: false,
            message: 'Error while fetching pending orders',
            error: error.message
        });
    }
};