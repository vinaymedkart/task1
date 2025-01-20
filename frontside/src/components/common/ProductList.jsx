import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, editProducts, getAllProducts } from '../../services/middlewares/product.jsx';
import { ChevronLeft, ChevronRight, Edit2Icon, Package, Tag, Box, Loader2 } from 'lucide-react';
import Admin from '../core/PrivateRoutes/Admin.jsx';
import NotAdmin from '../core/PrivateRoutes/NotAdmin.jsx';
import DeleteIcon from "../../assets/delete.png";
import ProductModal from './ProductModal.jsx';
import CartControls from './CartFunctionality.jsx';
import Pagination from './Pagination';
import ProductFilters from './ProductFilters.jsx';
import { getAllTags } from '../../services/middlewares/tag.jsx';
import { getAllCategorys } from '../../services/middlewares/category.jsx';

const ProductList = () => {
    const dispatch = useDispatch();
    const { products, currentPage, totalPages } = useSelector((state) => state.appdata);
    const [selectedImageIndexes, setSelectedImageIndexes] = useState({});
    const [openModal, setOpenModal] = useState({ isOpen: false, type: null, data: null });
    const { token, loading } = useSelector((state) => state.auth);
    const [page, setPage] = useState(1);
    const [cartData, setCartData] = useState({});
    const [filters, setFilters] = useState({ searchbar: "", tags: [], categories: [] });

    useEffect(() => {
        fetchProducts(1);
    }, [filters]);

    useEffect(() => {
        const email = localStorage.getItem('email');
        const storedData = JSON.parse(localStorage.getItem("usersData")) || {};
        setCartData(storedData[email] || {});
    }, []);

    const fetchProducts = async (page = 1) => {
        if (token) {
            const { searchbar, tags, categories } = filters;
            const query = { searchbar, tags, categorys: categories };
            dispatch(getAllProducts(token, page, query));           
            setPage(page);
        }
    };

    const handleImageNavigation = (productId, direction) => {
        setSelectedImageIndexes(prev => {
            const currentProduct = products.find(p => p.wsCode === productId);
            const totalImages = currentProduct?.images?.length || 1;
            const currentIndex = prev[productId] || 0;
            
            let newIndex;
            if (direction === 'prev') {
                newIndex = (currentIndex - 1 + totalImages) % totalImages;
            } else {
                newIndex = (currentIndex + 1) % totalImages;
            }
            
            return { ...prev, [productId]: newIndex };
        });
    };

    const handleEditClick = (product) => {
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
                categoryName: product.categoryName,
                sell: product.sell,
                stock: product.stock,
                tags: product.tags || [],
            }
        });
    };

    const handleDeleteClick = (productId) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (confirmed) {
            dispatch(deleteProduct(token, productId));
        }
    };

    const handleSubmit = async (formData) => {
        if (openModal.type === 'edit') {
            await dispatch(editProducts(token, formData));
        }
        setOpenModal({ isOpen: false, type: null, data: null });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h2 className="text-3xl font-bold text-sky-900 mb-4 md:mb-0">
                    Featured Products
                    <div className="h-1 w-20 bg-gradient-to-r from-sky-500 to-sky-600 mt-2 rounded-full"></div>
                </h2>
            </div>

            <div className="mb-8">
                <ProductFilters onFilterChange={setFilters} />
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div key={product.wsCode} 
                                className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative h-72">
                                    {product.images && product.images.length > 0 ? (
                                        <>
                                            <img
                                                src={product.images[selectedImageIndexes[product.wsCode] || 0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            {product.images.length > 1 && (
                                                <>
                                                    <button 
                                                        onClick={() => handleImageNavigation(product.wsCode, 'prev')}
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                                                    >
                                                        <ChevronLeft className="w-5 h-5 text-sky-900" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleImageNavigation(product.wsCode, 'next')}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                                                    >
                                                        <ChevronRight className="w-5 h-5 text-sky-900" />
                                                    </button>
                                                </>
                                            )}
                                            {product.stock <= 10 && (
                                                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    Low Stock
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-sky-50">
                                            <Package className="w-12 h-12 text-sky-300" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-semibold text-sky-900 line-clamp-2">{product.name}</h3>
                                        <span className="text-sm text-sky-600 font-medium bg-sky-50 px-2 py-1 rounded-md">
                                            {product.wsCode}
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1">
                                                <p className="text-2xl font-bold text-sky-700">₹{product.salesPrice}</p>
                                                {product.mrp > product.salesPrice && (
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm text-gray-500 line-through">MRP: ₹{product.mrp}</p>
                                                        <span className="text-green-600 text-sm font-medium">
                                                            {Math.round(((product.mrp - product.salesPrice) / product.mrp) * 100)}% off
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Admin>
                                                    <button 
                                                        onClick={() => handleEditClick(product)} 
                                                        className="p-2 bg-sky-100 text-sky-600 rounded-full hover:bg-sky-200 transition-colors duration-200"
                                                    >
                                                        <Edit2Icon className="w-5 h-5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteClick(product.wsCode)} 
                                                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors duration-200"
                                                    >
                                                        <img src={DeleteIcon} className="h-5 w-5" alt="delete" />
                                                    </button>
                                                </Admin>
                                            </div>
                                        </div>

                                        {product.packageSize && (
                                            <div className="flex items-center gap-2 text-sky-700">
                                                <Box className="w-4 h-4" />
                                                <p className="text-sm">Pack size: {product.packageSize} units</p>
                                            </div>
                                        )}

                                        {product.tags && product.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {product.tags.map((tag, index) => (
                                                    <span 
                                                        key={index}
                                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-sm"
                                                    >
                                                        <Tag className="w-3 h-3" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <NotAdmin>
                                            <div className="pt-2">
                                                <CartControls product={product} cartData={cartData} setCartData={setCartData} />
                                            </div>
                                        </NotAdmin>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={fetchProducts}
                        />
                    </div>
                </>
            )}

            <ProductModal
                isOpen={openModal.isOpen}
                onClose={() => setOpenModal({ isOpen: false, type: null, data: null })}
                onSubmit={handleSubmit}
                initialData={openModal.data}
            />
        </div>
    );
};

export default ProductList;