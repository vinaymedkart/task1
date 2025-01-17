import React, { useState, useEffect } from 'react';
import { Trash2, CreditCard } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../services/middlewares/cart';
import { placeOrder } from '../services/middlewares/order';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false);
    const { email, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const fetchCartItems = async () => {
        try {
            const cartData = JSON.parse(localStorage.getItem("usersData")) || {};
            const userEmail = localStorage.getItem('email') || email;
            const userCart = cartData[userEmail] || {};

            const response = await dispatch(addToCart(token, userCart));
            
            if (response.success && response.cart && response.cart.items) {
                // Transform the API response data into the format we need
                const formattedItems = response.cart.items.map(item => ({
                    wsCode: item.Product.wsCode,
                    quantity: item.quantity,
                    name: item.Product.name,
                    salesPrice: item.Product.salesPrice,
                    mrp: item.Product.mrp,
                    packageSize: item.Product.packageSize,
                    images: item.Product.images || [],
                    cartItemId: item.id,
                    // tags: item.Product.tags,
                    // category: item.Product.category,
                }));
                
                setCartItems(formattedItems);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const updateQuantity = async (wsCode, change) => {
        const userEmail = localStorage.getItem('email') || email;
        if (!userEmail) return;

        try {
            let cartData = JSON.parse(localStorage.getItem("usersData")) || {};
            if (!cartData[userEmail]) cartData[userEmail] = {};

            const currentQty = cartData[userEmail][wsCode] || 0;
            const newQty = currentQty + change;

            if (newQty <= 0) {
                delete cartData[userEmail][wsCode];
            } else {
                cartData[userEmail][wsCode] = newQty;
            }

            if (Object.keys(cartData[userEmail]).length === 0) {
                delete cartData[userEmail];
            }

            localStorage.setItem("usersData", JSON.stringify(cartData));
            await fetchCartItems(); // Refresh cart items with API data
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const removeItem = async (wsCode) => {
        const userEmail = localStorage.getItem('email') || email;
        if (!userEmail) return;

        try {
            let cartData = JSON.parse(localStorage.getItem("usersData")) || {};
            if (cartData[userEmail]) {
                delete cartData[userEmail][wsCode];
                if (Object.keys(cartData[userEmail]).length === 0) {
                    delete cartData[userEmail];
                }
                localStorage.setItem("usersData", JSON.stringify(cartData));
                await fetchCartItems(); // Refresh cart items with API data
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.salesPrice * item.quantity), 0);
    };

    const handlePlaceOrder = async () => {
        setOrderLoading(true);
        try {
            const userEmail = localStorage.getItem('email') || email;
            let cartData = JSON.parse(localStorage.getItem("usersData")) || {};
            delete cartData[userEmail];
            localStorage.setItem("usersData", JSON.stringify(cartData));
            await dispatch(placeOrder(token))
            
            
        } catch (error) {
            console.error('Error placing order:', error);
        } finally {
            setOrderLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-sky-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-semibold text-sky-900 mb-8">Your Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h2 className="text-xl text-sky-900 mb-4">Your cart is empty</h2>
                        <p className="text-sky-700 mb-6">Add some medicines to your cart to get started.</p>
                        <a href="/" className="bg-sky-600 text-white px-6 py-2 rounded-full hover:bg-sky-700 transition-colors">
                            Continue Shopping
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {cartItems.map((item) => (
                                <div key={item.wsCode} className="bg-white rounded-lg shadow-md mb-4 p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-24 h-24 overflow-hidden rounded-md">
                                            {item.images && item.images.length > 0 ? (
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400">No image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-medium text-sky-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500">WS: {item.wsCode}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <p className="text-sky-700 font-semibold">₹{item.salesPrice}</p>
                                                {item.mrp > item.salesPrice && (
                                                    <p className="text-sm text-gray-500 line-through">MRP: ₹{item.mrp}</p>
                                                )}
                                            </div>
                                            {item.packageSize && (
                                                <p className="text-sm text-gray-500">Pack size: {item.packageSize}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.wsCode, -1)}
                                                    className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full hover:bg-sky-200"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sky-900 min-w-[20px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.wsCode, 1)}
                                                    className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full hover:bg-sky-200"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.wsCode)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                                <h3 className="text-xl font-semibold text-sky-900 mb-4">Order Summary</h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-sky-700">Subtotal</span>
                                        <span className="font-medium">₹{calculateTotal()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sky-700">Items</span>
                                        <span className="font-medium">{cartItems.length}</span>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between mb-6">
                                        <span className="text-sky-900 font-semibold">Total</span>
                                        <span className="text-sky-900 font-semibold">₹{calculateTotal()}</span>
                                    </div>
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={orderLoading}
                                        className="w-full bg-sky-600 text-white px-6 py-3 rounded-full hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {orderLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <CreditCard className="w-5 h-5" />
                                                Place Order
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;