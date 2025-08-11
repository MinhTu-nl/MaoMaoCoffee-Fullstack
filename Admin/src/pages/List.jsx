import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backEndURL } from '../App'
import { toast } from 'react-toastify'
import EditProductModal from '../components/EditProductModal'
import ProductDetailModal from '../components/ProductDetailModal'

const List = ({ token }) => {

    const [list, setList] = useState([])
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState('');
    const [subCategoryFilter, setSubCategoryFilter] = useState('');
    const [reviews, setReviews] = useState({});
    const [showReviews, setShowReviews] = useState({});
    const [reviewCounts, setReviewCounts] = useState({});

    // Danh sách các loại sản phẩm với tên hiển thị đẹp
    const categoryOptions = [
        { value: '', label: 'Tất cả loại' },
        { value: 'coldbew', label: 'Coldbrew' },
        { value: 'coffee', label: 'Cà phê' },
        { value: 'tea', label: 'Trà' },
        { value: 'milk', label: 'Trà sữa' },
        { value: 'ice', label: 'Đá xay' },
        { value: 'croffle', label: 'Croffle' },
        { value: 'toast', label: 'Bánh nướng' }
    ];

    const fetchList = async () => {
        try {
            const res = await axios.get(backEndURL + `/api/product/list?limit=1000`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.success) {
                setList(res.data.data)
            } else {
                toast.error(res.data.message)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const fetchReviewCounts = async () => {
        try {
            const res = await axios.get(backEndURL + `/api/review/count-all`)
            setReviewCounts(res.data)
        } catch (e) {
            setReviewCounts({})
        }
    }

    const fetchReviews = async (productId) => {
        try {
            const res = await axios.get(backEndURL + `/api/review/product/${productId}`)
            setReviews(prev => ({
                ...prev,
                [productId]: res.data
            }))
        } catch (e) {
            console.log(e)
            setReviews(prev => ({
                ...prev,
                [productId]: []
            }))
        }
    }

    const removeProduct = async (_id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            return;
        }

        try {
            const res = await axios.delete(backEndURL + `/api/product/remove/${_id}`, {
                headers: { token }
            });

            if (res.data.success) {
                toast.success(res.data.message);
                await fetchList();
                await fetchReviewCounts();
            } else {
                toast.error(res.data.message || 'Có lỗi xảy ra khi xóa sản phẩm');
            }
        } catch (e) {
            console.error('Error removing product:', e);
            toast.error(e.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm');
        }
    }

    const handleEdit = (item) => {
        setEditingProduct(item)
    }

    const toggleReviews = (productId) => {
        if (!showReviews[productId]) {
            fetchReviews(productId);
        }
        setShowReviews(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    }

    useEffect(() => {
        fetchList()
        fetchReviewCounts()
    }, [])

    // Tính danh sách đã lọc
    const filteredList = list
        .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(item => !categoryFilter || item.category === categoryFilter)
        .filter(item => !subCategoryFilter || item.subCategory === subCategoryFilter);

    return (
        <>
            {/* Header với thống kê */}
            <div className='bg-white rounded-lg shadow-sm p-4 mb-4'>
                <h1 className='text-xl font-bold text-gray-800 mb-3'>Quản lý Sản phẩm</h1>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    <div className='bg-blue-50 p-3 rounded-lg'>
                        <div className='text-blue-600 text-sm font-medium'>Tổng sản phẩm</div>
                        <div className='text-lg font-bold text-blue-800'>{list.length}</div>
                    </div>
                    <div className='bg-green-50 p-3 rounded-lg'>
                        <div className='text-green-600 text-sm font-medium'>Đang hiển thị</div>
                        <div className='text-lg font-bold text-green-800'>{filteredList.length}</div>
                    </div>
                    <div className='bg-purple-50 p-3 rounded-lg'>
                        <div className='text-purple-600 text-sm font-medium'>Bestseller</div>
                        <div className='text-lg font-bold text-purple-800'>
                            {list.filter(item => item.bestseller).length}
                        </div>
                    </div>
                    <div className='bg-orange-50 p-3 rounded-lg'>
                        <div className='text-orange-600 text-sm font-medium'>Loại sản phẩm</div>
                        <div className='text-lg font-bold text-orange-800'>
                            {new Set(list.map(item => item.category)).size}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bộ lọc và tìm kiếm */}
            <div className='bg-white rounded-lg shadow-sm p-4 mb-4'>
                <div className='flex flex-col sm:flex-row gap-3'>
                    {/* Tìm kiếm */}
                    <div className='flex-1'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Tìm kiếm
                        </label>
                        <input
                            type='text'
                            placeholder='Nhập tên sản phẩm...'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Lọc theo loại */}
                    <div className='sm:w-48'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Loại sản phẩm
                        </label>
                        <select
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                        >
                            {categoryOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSave={fetchList}
                    token={token}
                />
            )}
            {viewingProduct && (
                <ProductDetailModal
                    isOpen={!!viewingProduct}
                    onClose={() => setViewingProduct(null)}
                    product={viewingProduct}
                />
            )}
            <p className='text-sm text-gray-500 px-6 mb-4'>Số lượng sản phẩm hiện có: {filteredList.length}</p>
            <div className='flex flex-col gap-2'>
                {/* --------------- LIST TABLE TITLE -------------- */}
                <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_2fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
                    <b>Ảnh</b>
                    <b>Tên sản phẩm</b>
                    <b>Loại sản phẩm</b>
                    <b>Giá</b>
                    <b>Đánh giá</b>
                    <b className='text-center'>Hành động</b>
                </div>

                {/* ------------- LIST TABLE DATA--------------- */}
                {
                    filteredList
                        .map((item, index) => (
                            <div key={index}>
                                <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_2fr] items-center gap-2 py-1 px-2 border text-sm'>
                                    <img className='w-12' src={Array.isArray(item.images) && item.images[0] ? item.images[0] : ''} alt="" />
                                    <p>{item.name}</p>
                                    <p>{item.category}</p>
                                    <p>
                                        {Object.entries(item.price).map(([size, value]) => (
                                            <span key={size} style={{ display: 'block' }}>{size}: {value}</span>
                                        ))}
                                    </p>
                                    <div className='flex flex-col items-center'>
                                        <button
                                            onClick={() => toggleReviews(item._id)}
                                            className='bg-purple-400 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs mb-1'
                                        >
                                            {showReviews[item._id] ? 'Ẩn' : 'Xem'} Đánh giá
                                        </button>
                                        <span className='text-xs text-gray-500'>
                                            ({reviewCounts[item._id] !== undefined ? reviewCounts[item._id] : '--'} đánh giá)
                                        </span>
                                    </div>
                                    <div className='flex flex-row gap-2 justify-end md:justify-center'>
                                        <button
                                            onClick={() => setViewingProduct(item)}
                                            className='bg-blue-400 hover:bg-blue-600 text-white px-5 py-2 rounded text-xs'
                                        >
                                            Xem
                                        </button>
                                        <button onClick={() => handleEdit(item)} className='bg-green-400 hover:bg-green-600 text-white px-5 py-2 rounded text-xs'>Sửa</button>
                                        <button onClick={() => removeProduct(item._id)} className='bg-red-400 hover:bg-red-600 text-white px-5 py-2 rounded text-xs'>Xoá</button>
                                    </div>
                                </div>

                                {/* Reviews Section */}
                                {showReviews[item._id] && (
                                    <div className='bg-gray-50 p-4 border-l-4 border-purple-400'>
                                        <h4 className='font-semibold mb-3 text-purple-700'>Đánh giá sản phẩm: {item.name}</h4>
                                        {reviews[item._id]?.length > 0 ? (
                                            <div className='space-y-3'>
                                                {reviews[item._id].map((review, idx) => (
                                                    <div key={idx} className='bg-white p-3 rounded-lg border'>
                                                        <div className='flex justify-between items-start mb-2'>
                                                            <div className='flex items-center gap-2'>
                                                                <span className='font-medium'>{review.user?.name || 'Ẩn danh'}</span>
                                                                <div className='flex'>
                                                                    {[1, 2, 3, 4, 5].map(star => (
                                                                        <span key={star} className='text-yellow-400'>
                                                                            {star <= review.rating ? '★' : '☆'}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                <span className='text-xs text-gray-500'>
                                                                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className='text-gray-700'>{review.comment}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className='text-gray-500 italic'>Chưa có đánh giá nào.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                }
            </div>
        </>
    )
}

export default List
