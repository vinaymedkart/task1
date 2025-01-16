import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../../services/middlewares/product.jsx';
import { ChevronLeft, ChevronRight, ShoppingCart, Plus, Edit2Icon } from 'lucide-react';
import Admin from '../core/PrivateRoutes/Admin.jsx';
import NotAdmin from '../core/PrivateRoutes/NotAdmin.jsx';
import ProductModal from './ProductModal';
import { getAllTags } from '../../services/middlewares/tag.jsx';
import { getAllCategorys } from '../../services/middlewares/category.jsx';
import { addToCart } from '../../services/middlewares/cart.jsx';
// import { addItemToCart } from './cartStorage.jsx';

const ProductList = () => {
    const dispatch = useDispatch();
    const { products, currentPage, totalPages } = useSelector((state) => state.appdata);
    const [selectedImageIndexes, setSelectedImageIndexes] = useState({});
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState({ isOpen: false, type: null, data: null });
  const { data ,token} = useSelector((state) => state.auth);
    const fetchProducts = async (page) => {
        setLoading(true);
        try {
            await dispatch(getAllProducts(page, 10));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        
        fetchProducts(1);
    }, []);

    const handlePrevImage = (productId) => {
        setSelectedImageIndexes(prev => ({
            ...prev,
            [productId]: (prev[productId] === undefined ?
                products.find(p => p.wsCode === productId)?.images?.length - 1 :
                (prev[productId] - 1 + products.find(p => p.wsCode === productId)?.images?.length) %
                products.find(p => p.wsCode === productId)?.images?.length) || 0
        }));
    };

    const handleNextImage = (productId) => {
        setSelectedImageIndexes(prev => ({
            ...prev,
            [productId]: ((prev[productId] || 0) + 1) % (products.find(p => p.wsCode === productId)?.images?.length || 1)
        }));
    };

    const handleEditClick = (product) => {
        console.log('Edit product data:', product); // Debug log
        setOpenModal({
            isOpen: true,
            type: 'edit',
            data: {
                wsCode: product.wsCode,
                name: product.name,
                salesPrice: product.salesPrice,
                mrp: product.mrp,
                packageSize: product.packageSize,
                images: product.images,
                categoryId: product.categoryId,
                sell: product.sell,
                stock: product.stock,
                tags: product.tags || [], // Ensure tags is an array
            }
        });
    };
    const handleCartClick = (product) => {
        
        console.log('Cart product data:', product); 
        // const updatedCart = addItemToCart(data.email, product.wsCode, 1); 
        // dispatch(addToCart(token, {
        //     productId: product.wsCode,
        //     quantity: 1
        // }));
    };

    const handleSubmit = (formData) => {
        if (openModal.type === 'edit') {
            console.log('Updated product data:', formData);
            // Here you would typically dispatch your update action
            // dispatch(updateProduct(formData));
        }
        setOpenModal({ isOpen: false, type: null, data: null });
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => fetchProducts(i)}
                    className={`px-4 py-2 rounded-full ${currentPage === i
                        ? 'bg-sky-600 text-white'
                        : 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                        } transition-colors duration-200`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex justify-center items-center gap-2">
                {currentPage > 1 && (
                    <button
                        onClick={() => fetchProducts(currentPage - 1)}
                        className="flex items-center gap-2 bg-sky-100 text-sky-800 px-4 py-2 rounded-full hover:bg-sky-200 transition-colors duration-200"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => fetchProducts(1)}
                            className="bg-sky-100 text-sky-800 px-4 py-2 rounded-full hover:bg-sky-200 transition-colors duration-200"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="px-2">...</span>}
                    </>
                )}

                {pages}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-2">...</span>}
                        <button
                            onClick={() => fetchProducts(totalPages)}
                            className="bg-sky-100 text-sky-800 px-4 py-2 rounded-full hover:bg-sky-200 transition-colors duration-200"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {currentPage < totalPages && (
                    <button
                        onClick={() => fetchProducts(currentPage + 1)}
                        className="flex items-center gap-2 bg-sky-100 text-sky-800 px-4 py-2 rounded-full hover:bg-sky-200 transition-colors duration-200"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold text-sky-900 mb-8">Featured Products</h2>

            {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.wsCode}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="relative h-64">
                                    {product.images && product.images.length > 0 ? (
                                        <>
                                            <img
                                                src={product.images[selectedImageIndexes[product.wsCode] || 0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                            {product.images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handlePrevImage(product.wsCode);
                                                        }}
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors duration-200"
                                                    >
                                                        <ChevronLeft className="w-5 h-5 text-sky-900" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleNextImage(product.wsCode);
                                                        }}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors duration-200"
                                                    >
                                                        <ChevronRight className="w-5 h-5 text-sky-900" />
                                                    </button>
                                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                                        {product.images.map((_, index) => (
                                                            <div
                                                                key={index}
                                                                className={`w-2 h-2 rounded-full ${(selectedImageIndexes[product.wsCode] || 0) === index
                                                                    ? 'bg-sky-600'
                                                                    : 'bg-white/80'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <span className="text-gray-400">No image available</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-medium text-sky-900">{product.name}</h3>
                                        <div className="flex gap-2">
                                            <span className="text-sm text-gray-500">WS: {product.wsCode}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sky-700 font-semibold">₹{product.salesPrice}</p>
                                            {product.mrp > product.salesPrice && (
                                                <p className="text-sm text-gray-500 line-through">MRP: ₹{product.mrp}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Admin>
                                                <button 
                                                    onClick={() => handleEditClick(product)}
                                                    className="flex items-center gap-2 bg-sky-100 text-sky-800 px-4 py-2 rounded-full hover:bg-sky-200 transition-colors duration-200"
                                                >
                                                    <Edit2Icon className="w-4 h-4" />
                                                </button>
                                            </Admin>

                                            <NotAdmin>
                                                <button onClick={() => handleCartClick(product)} className="flex items-center gap-2 bg-sky-100 text-sky-800 px-4 py-2 rounded-full hover:bg-sky-200 transition-colors duration-200">
                                                    <Plus className="w-4 h-4" />
                                                    <ShoppingCart className="w-4 h-4" />
                                                </button>
                                            </NotAdmin>
                                        </div>
                                    </div>

                                    {product.packageSize && (
                                        <p className="text-sm text-gray-600 mt-2">Pack size: {product.packageSize} units</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-8">
                            {renderPagination()}
                        </div>
                    )}
                </>
            )}

            <ProductModal 
                isOpen={openModal.isOpen}
                onClose={() => setOpenModal({ isOpen: false, type: null, data: null })}
                onSubmit={handleSubmit}
                initialData={openModal.data}
                type={openModal.type}
            />
        </div>
    );
};

export default ProductList;