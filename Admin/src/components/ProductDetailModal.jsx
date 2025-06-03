import React from 'react';
const ProductDetailModal = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-4 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex gap-4">
                    {/* Left Side - Images */}
                    <div className="w-1/2">
                        <div className="space-y-3">
                            {product.images?.map((image, index) => (
                                <div key={index} className="relative w-full">
                                    <img
                                        src={image}
                                        alt={`${product.name} - Image ${index + 1}`}
                                        className="w-full rounded-lg"
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Product Details */}
                    <div className="w-1/2 space-y-3">
                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                            <p className="text-sm text-gray-600">{product.description}</p>
                        </div>

                        {/* Category & SubCategory */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-1">Category</h3>
                                <p className="text-sm text-gray-600">
                                    {product.category === 'coldbew' ? 'Coldbrew' :
                                        product.category === 'coffee' ? 'Cà phê' :
                                            product.category === 'tea' ? 'Trà' :
                                                product.category === 'milk' ? 'Trà sữa' :
                                                    product.category === 'ice' ? 'Đá xay' :
                                                        product.category === 'croffle' ? 'Croffle' :
                                                            product.category === 'toast' ? 'Bánh nướng' :
                                                                product.category}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-1">Sub Category</h3>
                                <p className="text-sm text-gray-600">
                                    {product.subCategory === 'drink' ? 'Đồ uống' :
                                        product.subCategory === 'food' ? 'Món ăn' :
                                            product.subCategory === 'dessert' ? 'Tráng miệng' :
                                                product.subCategory}
                                </p>
                            </div>
                        </div>

                        {/* Sizes & Prices */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-1">Available Sizes & Prices</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {product.sizes?.map((size) => (
                                    <div key={size} className="bg-gray-50 p-2 rounded-lg">
                                        <p className="text-sm font-medium text-gray-700">Size {size}</p>
                                        <p className="text-sm text-gray-600">${product.price[size]?.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bestseller Status */}
                        {product.bestseller && (
                            <div className="bg-yellow-50 p-2 rounded-lg">
                                <p className="text-sm text-yellow-800 font-medium">⭐ Bestseller Product</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal; 