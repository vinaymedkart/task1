import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { historyOrders } from '../services/middlewares/order';

const HistoryOrders = () => {
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [orders, setOrders] = useState({
        pendingOrders: [],
        allOrders: [],
        summary: { totalOrders: 0, pendingOrders: 0, totalSpent: 0 }
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await dispatch(historyOrders(token));
                if (response?.data) {
                    setOrders(response.data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } 
        };

        fetchOrders();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'Confirmed':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Cancelled':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Package className="w-5 h-5 text-sky-500" />;
        }
    };

    

    return (
        <div className="w-full min-h-screen bg-sky-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-semibold text-sky-900 mb-8">Order History</h1>

                {/* Order Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-medium text-sky-900 mb-2">Total Orders</h3>
                        <p className="text-3xl font-bold text-sky-600">{orders.summary.totalOrders}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-medium text-sky-900 mb-2">Pending Orders</h3>
                        <p className="text-3xl font-bold text-yellow-500">{orders.summary.pendingOrders}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-medium text-sky-900 mb-2">Total Spent</h3>
                        <p className="text-3xl font-bold text-green-500">₹{orders.summary.totalSpent}</p>
                    </div>
                </div>

                {/* Pending Orders Section */}
                {orders.pendingOrders.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-sky-900 mb-4">Pending Orders</h2>
                        <div className="space-y-4">
                            {orders.pendingOrders.map((order) => (
                                <div key={order.orderId} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-sky-900 font-medium">Order #{order.orderId}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(order.status)}
                                            <span className="text-yellow-500 font-medium">{order.status}</span>
                                        </div>
                                    </div>
                                    <div className="divide-y">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="py-3">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <p className="text-sky-900">{item.productName}</p>
                                                        <p className="text-sm text-gray-500">Code: {item.productCode}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sky-900">₹{item.price} × {item.quantity}</p>
                                                        <p className="text-sm text-sky-600 font-medium">₹{item.subtotal}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sky-900 font-medium">Total Amount</span>
                                            <span className="text-sky-900 font-bold">₹{order.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Orders Section */}
                <div>
                    <h2 className="text-xl font-semibold text-sky-900 mb-4">All Orders</h2>
                    {orders.allOrders.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <h3 className="text-lg text-sky-900 mb-2">No orders found</h3>
                            <p className="text-sky-700 mb-6">Start shopping to see your orders here.</p>
                            <a href="/" className="bg-sky-600 text-white px-6 py-2 rounded-full hover:bg-sky-700 transition-colors">
                                Browse Products
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.allOrders.map((order) => (
                                <div key={order.orderId} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-sky-900 font-medium">Order #{order.orderId}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(order.status)}
                                            <span className={`font-medium ${
                                                order.status === 'Confirmed' ? 'text-green-500' :
                                                order.status === 'Cancelled' ? 'text-red-500' :
                                                'text-yellow-500'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="divide-y">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="py-3">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <p className="text-sky-900">{item.productName}</p>
                                                        <p className="text-sm text-gray-500">Code: {item.productCode}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sky-900">₹{item.price} × {item.quantity}</p>
                                                        <p className="text-sm text-sky-600 font-medium">₹{item.subtotal}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sky-900 font-medium">Total Amount</span>
                                            <span className="text-sky-900 font-bold">₹{order.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryOrders;