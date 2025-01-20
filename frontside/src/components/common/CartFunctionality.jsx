import React from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

const CartControls = ({ product, cartData, setCartData }) => {
    const quantity = cartData[product.wsCode] || 0;

    const handleCartClick = (product, quantityChange) => {
        const email = localStorage.getItem('email');
        if (email) {
            const newQuantity = (cartData[product.wsCode] || 0) + quantityChange;

            if (newQuantity >= 0) {
                const updatedCart = { ...cartData };
                if (newQuantity === 0) {
                    delete updatedCart[product.wsCode];
                } else {
                    updatedCart[product.wsCode] = newQuantity;
                }

                setCartData(updatedCart); // Update state to trigger re-render

                // Persist changes in localStorage
                const storedData = JSON.parse(localStorage.getItem("usersData")) || {};
                storedData[email] = updatedCart;
                localStorage.setItem("usersData", JSON.stringify(storedData));
            }
        }
    };

    return (
        <div className="flex items-center justify-end mt-2">
            {quantity > 0 ? (
                <div className="flex items-center gap-2 bg-sky-100 rounded-full p-1">
                    <button
                        onClick={() => handleCartClick(product, -1)}
                        className="p-1 hover:bg-sky-200 rounded-full"
                    >
                        <Minus className="w-4 h-4 text-sky-800" />
                    </button>
                    <span className="text-sky-900 min-w-[20px] text-center">{quantity}</span>
                    <button
                        onClick={() => handleCartClick(product, 1)}
                        className="p-1 hover:bg-sky-200 rounded-full"
                    >
                        <Plus className="w-4 h-4 text-sky-800" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => handleCartClick(product, 1)}
                    className="flex items-center gap-2 bg-sky-100 text-sky-800 px-4 py-2 rounded-full hover:bg-sky-200"
                >
                    <Plus className="w-4 h-4" />
                    <ShoppingCart className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default CartControls;
