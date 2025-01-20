import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, editProducts, getAllProducts } from '../../services/middlewares/product.jsx';
import { ChevronLeft, ChevronRight, Edit2Icon } from 'lucide-react';
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

    const fetchProducts = async (page = 1) => {
        if (token) {
            const { searchbar, tags, categories } = filters;
            const query = { searchbar, tags, categorys: categories };
            dispatch(getAllProducts(token, page, query));           
            setPage(page);
        }
    };


    useEffect(() => {
   
        fetchProducts(1);
    }, [filters]);

    useEffect(() => {
        const email = localStorage.getItem('email');
        const storedData = JSON.parse(localStorage.getItem("usersData")) || {};
        setCartData(storedData[email] || {});
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
            console.log(token)
            dispatch(deleteProduct(token, productId));
        }
    };

    const handleSubmit = async (formData) => {
        console.log(formData)
        if (openModal.type === 'edit') {
            await dispatch(editProducts(token, formData));
        }
        setOpenModal({ isOpen: false, type: null, data: null });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold text-sky-900 mb-8">Featured Products</h2>
            <ProductFilters onFilterChange={setFilters} />
            {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product.wsCode} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="relative h-64">
                                    {/* Image section with navigation */}
                                    {product.images && product.images.length > 0 ? (
                                        <>
                                            <img
                                                src={product.images[selectedImageIndexes[product.wsCode] || 0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                            {product.images.length > 1 && (
                                                <>
                                                    <button onClick={() => handlePrevImage(product.wsCode)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white">
                                                        <ChevronLeft className="w-5 h-5 text-sky-900" />
                                                    </button>
                                                    <button onClick={() => handleNextImage(product.wsCode)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white">
                                                        <ChevronRight className="w-5 h-5 text-sky-900" />
                                                    </button>
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
                                        <span className="text-sm text-gray-500">WS: {product.wsCode}</span>
                                    </div>

                                    <div className="mt-2">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sky-700 font-semibold">₹{product.salesPrice}</p>
                                                {product.mrp > product.salesPrice && (
                                                    <p className="text-sm text-gray-500 line-through">MRP: ₹{product.mrp}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Admin>
                                                    <button onClick={() => handleEditClick(product)} className="p-2 bg-sky-100 text-sky-800 rounded-full hover:bg-sky-200">
                                                        <Edit2Icon className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(product.wsCode)} className="p-2 bg-red-100 text-red-800 rounded-full hover:bg-red-200">
                                                        <img src={DeleteIcon} className="h-4 w-4" alt="delete" />
                                                    </button>
                                                </Admin>
                                            </div>
                                        </div>
                                        <NotAdmin>
                                            <CartControls product={product} cartData={cartData} setCartData={setCartData} />
                                        </NotAdmin>
                                    </div>

                                    {product.packageSize && (
                                        <p className="text-sm text-gray-600 mt-2">Pack size: {product.packageSize} units</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={fetchProducts}
                    />
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