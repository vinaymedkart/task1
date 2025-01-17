import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, XCircle } from 'lucide-react';
import { updateOrderStatus } from '../services/middlewares/order';

const UpdateOrder = ({ order, onStatusUpdate }) => {
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleStatusUpdate = async (newStatus) => {
        if (window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this order?`)) {
            const result = await dispatch(updateOrderStatus(order.orderId, newStatus, token));
            if (result?.success && onStatusUpdate) {
                onStatusUpdate(result.data);
            }
        }
    };

    // Don't render update options for non-pending orders
    if (order.status !== 'Pending') {
        return null;
    }

    return (
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
    );
};

export default UpdateOrder;