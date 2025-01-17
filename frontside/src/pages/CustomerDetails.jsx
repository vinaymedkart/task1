import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCcw, Package, User, Calendar } from 'lucide-react';
import { allOrders} from '../services/middlewares/order';
import UpdateOrder from './UpdateOrder';

const CustomerDetails = () => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [pendingOrders, setPendingOrders] = useState([]);

    const fetchPendingOrders = async () => {
        try {
            setLoading(true);
            const response = await dispatch(allOrders(token));
            if (response?.data?.pendingOrders) {
                // Sort by creation date, newest first
                const sortedOrders = response.data.pendingOrders.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setPendingOrders(sortedOrders);
            }
        } catch (error) {
            console.error('Error fetching pending orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingOrders();
    }, [token]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchPendingOrders();
        setRefreshing(false);
    };

    const handleStatusUpdate = (updatedOrder) => {
        setPendingOrders(prevOrders => 
            prevOrders.filter(order => order.orderId !== updatedOrder.orderId)
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-sky-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-sky-900">Customer Orders</h1>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className={`flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:shadow-md transition-all ${
                            refreshing ? 'opacity-50' : ''
                        }`}
                    >
                        <RefreshCcw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-around items-center">
                        <div className="text-center">
                            <Package className="w-8 h-8 text-sky-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-sky-900">{pendingOrders.length}</p>
                            <p className="text-sm text-sky-600">Pending Orders</p>
                        </div>
                        <div className="text-center">
                            <Calendar className="w-8 h-8 text-sky-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-sky-900">
                                {pendingOrders.length > 0 
                                    ? new Date(pendingOrders[0].createdAt).toLocaleDateString() 
                                    : '-'}
                            </p>
                            <p className="text-sm text-sky-600">Latest Order</p>
                        </div>
                    </div>
                </div>

                {/* Pending Orders List */}
                {pendingOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <Package className="w-16 h-16 text-sky-300 mx-auto mb-4" />
                        <h2 className="text-xl text-sky-900 mb-2">No Pending Orders</h2>
                        <p className="text-sky-700">All orders have been processed!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {pendingOrders.map((order) => (
                            <div key={order.orderId} className="bg-white rounded-lg shadow-md p-6">
                                {/* Order Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-5 h-5 text-sky-600" />
                                            <h3 className="text-lg font-medium text-sky-900">
                                                Order #{order.orderId}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-medium text-sky-900">
                                            Total: ₹{order.totalAmount}
                                        </p>
                                        <p className="text-sm text-yellow-500 mt-1">
                                            Status: {order.status}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-sky-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-sky-900">Product</th>
                                                <th className="px-4 py-2 text-left text-sky-900">Code</th>
                                                <th className="px-4 py-2 text-right text-sky-900">Price</th>
                                                <th className="px-4 py-2 text-right text-sky-900">Qty</th>
                                                <th className="px-4 py-2 text-right text-sky-900">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {order.items.map((item, index) => (
                                                <tr key={index} className="hover:bg-sky-50">
                                                    <td className="px-4 py-3 text-sky-900">
                                                        {item.productName}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500">
                                                        {item.productCode}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sky-900">
                                                        ₹{item.price}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sky-900">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium text-sky-900">
                                                        ₹{item.subtotal}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Update Order Status */}
                                <UpdateOrder 
                                    order={order} 
                                    onStatusUpdate={handleStatusUpdate}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDetails;