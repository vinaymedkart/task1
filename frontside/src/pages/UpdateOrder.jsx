import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { updateOrderStatus } from '../services/middlewares/order';

// Separate StockCheckModal component
const StockCheckModal = ({ isOpen, onClose, insufficientProducts }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
                <div className="p-4 border-b">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        <h2 className="text-lg font-semibold">Insufficient Stock</h2>
                    </div>
                </div>

                <div className="p-4">
                    <p className="text-gray-600 mb-4">
                        The following products don't have sufficient stock:
                    </p>
                    <div className="space-y-3">
                        {insufficientProducts?.map((product) => (
                            <div 
                                key={product.wsCode} 
                                className="bg-red-50 p-3 rounded-lg border border-red-100"
                            >
                                <p className="text-sm font-medium text-gray-700">
                                    Product Code: {product.wsCode}
                                </p>
                                <div className="mt-1 text-sm text-gray-600">
                                    <p>Requested Quantity: {product.requested} units</p>
                                    <p>Available Stock: {product.available} units</p>
                                    <p className="text-red-600 mt-1">
                                        Shortage: {product.requested - product.available} units
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main UpdateOrder component
const UpdateOrder = ({ order, onStatusUpdate }) => {
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [showStockModal, setShowStockModal] = useState(false);
    const [insufficientStock, setInsufficientStock] = useState([]);

    const handleStatusUpdate = async (newStatus) => {
        if (window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this order?`)) {
            try {
                const result = await dispatch(updateOrderStatus(order.orderId, newStatus, token));
                
                if (!result.success && result.insufficientStockProducts) {
                    setInsufficientStock(result.insufficientStockProducts);
                    setShowStockModal(true);
                    return;
                }

                if (result.success && onStatusUpdate) {
                    onStatusUpdate(result);
                }
            } catch (error) {
                console.error('Error updating order status:', error);
            }
        }
    };

    return (
        <>
            <div className="flex justify-end space-x-4 mt-4 pt-4 border-t">
                <button
                    onClick={() => handleStatusUpdate('Confirmed')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                >
                    <CheckCircle className="w-4 h-4" />
                    Confirm Order
                </button>
                
                <button
                    onClick={() => handleStatusUpdate('Cancelled')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                >
                    <XCircle className="w-4 h-4" />
                    Cancel Order
                </button>
            </div>

            <StockCheckModal
                isOpen={showStockModal}
                onClose={() => setShowStockModal(false)}
                insufficientProducts={insufficientStock}
            />
        </>
    );
};

export default UpdateOrder;