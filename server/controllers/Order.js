import {Cart,Order,CartItem ,Product, User,sequelize,Inventory} from '../models/index.js';
import { Op,Sequelize } from 'sequelize';

export const placeOrder = async (req, res) => {
    try {
        const { email } = req.user;
        const userEmail = email;

        // Fetch the latest cart for the user
        const currentCart = await Cart.findOne({
            where: { UserMail: userEmail },
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            attributes: ['salesPrice', 'name', 'wsCode']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']] // Order by createdAt to get the most recent cart
        });

        if (!currentCart) {
            return res.status(404).json({
                success: false,
                message: "No active cart found"
            });
        }

        if (!currentCart.items || currentCart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Calculate the total amount for the order
        const totalAmount = currentCart.items.reduce((sum, item) => {
            return sum + (item.Product.salesPrice * item.quantity);
        }, 0);

        // Create an order from the cart
        const order = await Order.create({
            UserMail: userEmail,
            cartId: currentCart.id,
            totalAmount: totalAmount,
            status: "Pending"
        });

        // Create a new cart for the user
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
};

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
// console.log(pendingOrders)

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
                price: item.atPrice,
                subtotal: item.quantity * item.atPrice
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

        return res.status(500).json({
            success: false,
            message: "Failed to fetch order history",
            error: error.message
        });
    }
};


// export const updateOrderStatus = async (req, res) => {
//     try {
//         const { orderId } = req.body;
//         const { status } = req.body;

        
//         if (!['Confirmed', 'Cancelled'].includes(status)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid status. Must be 'Confirmed' or 'Cancelled'"
//             });
//         }

//         const order = await Order.findByPk(orderId);

//         if (!order) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Order not found"
//             });
//         }

//         // Only allow updating Pending orders
//         if (order.status !== "Pending") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Can only update pending orders"
//             });
//         }

//         // Update the order status
//         await order.update({ status });

//         return res.status(200).json({
//             success: true,
//             message: `Order ${orderId} status updated to ${status}`,
//             data: {
//                 orderId: order.id,
//                 status: order.status,
//                 updatedAt: order.updatedAt
//             }
//         });

//     } catch (error) {
//         console.error("Error in updateOrderStatus:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to update order status",
//             error: error.message
//         });
//     }
// }
export const updateOrderStatus = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { orderId, status } = req.body;

        if (!['Confirmed', 'Cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be 'Confirmed' or 'Cancelled'"
            });
        }

        const order = await Order.findByPk(orderId, {
            include: [{
                model: Cart,
                include: [{
                    model: CartItem,
                    as: 'items'
                }]
            }]
        });

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

        if (status === 'Confirmed') {
            // Get all cart items for this order
            const cartItems = order.Cart.items;
            
            // Check inventory for all products
            const inventoryChecks = await Promise.all(
                cartItems.map(async (item) => {
                    const inventory = await Inventory.findOne({
                        where: { wsCode: item.productId }
                    });
                    
                    return {
                        wsCode: item.productId,
                        requestedQuantity: item.quantity,
                        availableStock: inventory ? inventory.stock : 0,
                        hasStock: inventory && inventory.stock >= item.quantity
                    };
                })
            );

            // Check if any products have insufficient stock
            const insufficientStock = inventoryChecks.filter(item => !item.hasStock);

            if (insufficientStock.length > 0) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock for some products",
                    insufficientStockProducts: insufficientStock.map(item => ({
                        wsCode: item.wsCode,
                        requested: item.requestedQuantity,
                        available: item.availableStock
                    }))
                });
            }

            // Update inventory for all products
            await Promise.all(
                cartItems.map(async (item) => {
                    await Inventory.decrement(
                        'stock',
                        {
                            by: item.quantity,
                            where: { wsCode: item.productId },
                            transaction
                        }
                    );
                })
            );
        }

        // Update the order status
        await order.update({ status }, { transaction });
        
        // Commit the transaction
        await transaction.commit();

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
        await transaction.rollback();
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
                            required: true, 
                            attributes: ['name', 'wsCode', 'salesPrice']
                        }]
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
// console.log()
        const formattedOrders = pendingOrders.map(order => {
            const orderData = order.get({ plain: true });
            orderData.Cart?.items?.forEach(item => {
                console.log(item.atPrice)
                return item;
            })
            return {
                orderId: orderData.id,
                status: orderData.status,
                totalAmount: orderData.totalAmount || 0,
                createdAt: orderData.createdAt,
                
                items: orderData.Cart?.items?.map(item => ({
                    productName: item?.Product?.name || 'Unknown Product',
                    productCode: item?.Product?.wsCode || 'N/A',
                    price: item?.atPrice || 0,
                    quantity: item?.quantity || 0,          
                    subtotal: (item?.atPrice || 0) * (item?.quantity || 0)
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