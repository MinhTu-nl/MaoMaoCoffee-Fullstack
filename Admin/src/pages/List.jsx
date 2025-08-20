import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backEndURL } from '../App'
import { toast } from 'react-toastify'
import EditProductModal from '../components/EditProductModal'
import ProductDetailModal from '../components/ProductDetailModal'
import { assets } from '../assets/assets'

const List = ({ token }) => {

    // state chứa danh sách sản phẩm
    const [list, setList] = useState([])
    // product đang mở modal edit
    const [editingProduct, setEditingProduct] = useState(null);
    // product đang xem chi tiết (modal)
    const [viewingProduct, setViewingProduct] = useState(null);
    // tìm kiếm theo tên
    const [searchTerm, setSearchTerm] = useState("");
    // lọc theo category / subCategory
    const [categoryFilter, setCategoryFilter] = useState('');
    const [subCategoryFilter, setSubCategoryFilter] = useState('');
    // cache review cho từng productId: reviews[productId] = [..]
    const [reviews, setReviews] = useState({});
    // checkbox: chỉ hiển thị sản phẩm có đánh giá
    const [onlyWithReviews, setOnlyWithReviews] = useState(false);
    // trạng thái hiển thị phần review cho từng productId
    const [showReviews, setShowReviews] = useState({});
    // số lượng review cho từng productId
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

    // Lấy danh sách sản phẩm (limit lớn để lấy hết)
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

    // Lấy số lượng review cho tất cả sản phẩm
    const fetchReviewCounts = async () => {
        try {
            const res = await axios.get(backEndURL + `/api/review/count-all`)
            setReviewCounts(res.data)
        } catch (e) {
            setReviewCounts({})
        }
    }

    // Lấy review cho 1 product và cache vào `reviews[productId]`
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

    // Xóa sản phẩm (confirm browser), gọi API DELETE kèm token
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

    // Mở modal sửa sản phẩm
    const handleEdit = (item) => {
        setEditingProduct(item)
    }

    // Toggle hiển thị review cho product: nếu chưa có thì fetch trước
    const toggleReviews = (productId) => {
        if (!showReviews[productId]) {
            fetchReviews(productId);
        }
        setShowReviews(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    }

    // load danh sách và số review khi component mount
    useEffect(() => {
        fetchList()
        fetchReviewCounts()
    }, [])

    // Tính danh sách đã lọc theo search + filter
    const filteredList = list
        .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(item => !categoryFilter || item.category === categoryFilter)
        .filter(item => !subCategoryFilter || item.subCategory === subCategoryFilter);

    // Nếu checkbox bật, chỉ giữ sản phẩm có review (>0) dựa trên reviewCounts cache
    const filteredListWithReviews = filteredList.filter(item => {
        if (!onlyWithReviews) return true
        return (reviewCounts[item._id] ?? 0) > 0
    })

    return (
        <div className="p-4 sm:p-6">
            {/* Header với thống kê */}
            <div className='bg-white rounded-lg shadow-sm p-4 mb-4'>
                <h1 className='text-xl font-bold text-gray-800 mb-3'>Quản lý Sản phẩm</h1>
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                    <div className='bg-blue-50 p-3 rounded-lg'>
                        <div className='text-blue-600 text-xs sm:text-sm font-medium'>Tổng sản phẩm</div>
                        <div className='text-base sm:text-lg font-bold text-blue-800'>{list.length}</div>
                    </div>
                    <div className='bg-green-50 p-3 rounded-lg'>
                        <div className='text-green-600 text-xs sm:text-sm font-medium'>Đang hiển thị</div>
                        <div className='text-base sm:text-lg font-bold text-green-800'>{filteredList.length}</div>
                    </div>
                    <div className='bg-purple-50 p-3 rounded-lg'>
                        <div className='text-purple-600 text-xs sm:text-sm font-medium'>Bestseller</div>
                        <div className='text-base sm:text-lg font-bold text-purple-800'>
                            {list.filter(item => item.bestseller).length}
                        </div>
                    </div>
                    <div className='bg-orange-50 p-3 rounded-lg'>
                        <div className='text-orange-600 text-xs sm:text-sm font-medium'>Loại sản phẩm</div>
                        <div className='text-base sm:text-lg font-bold text-orange-800'>
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
                        <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
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
                        <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
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

                    {/* Styled toggle: chỉ show sản phẩm có review */}
                    <div className='sm:w-40 flex items-center'>
                        <label className='flex items-center cursor-pointer select-none'>
                            <div className='relative'>
                                <input
                                    type='checkbox'
                                    className='sr-only'
                                    checked={onlyWithReviews}
                                    onChange={e => setOnlyWithReviews(e.target.checked)}
                                />
                                <div className={`block w-11 h-6 rounded-full transition-colors ${onlyWithReviews ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                                <div className={`dot absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${onlyWithReviews ? 'transform translate-x-5' : ''}`}></div>
                            </div>
                            <span className='ml-3 text-sm text-gray-700'>Review</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Modal */}
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

            <p className='text-xs sm:text-sm text-gray-500 mb-4'>Số lượng sản phẩm hiện có: {filteredListWithReviews.length}</p>

            {/* Danh sách sản phẩm */}
            <div className='space-y-3'>
                {/* Header - chỉ hiển thị trên desktop */}
                <div className='hidden sm:grid grid-cols-12 items-center py-2 px-2 bg-gray-100 text-sm font-medium'>
                    <div className="col-span-1">Ảnh</div>
                    <div className="col-span-3">Tên sản phẩm</div>
                    <div className="col-span-2">Loại</div>
                    <div className="col-span-2">Giá</div>
                    <div className="col-span-2">Review</div>
                    <div className="col-span-2 text-center">Hành động</div>
                </div>

                {/* Data */}
                {filteredListWithReviews.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                    </div>
                ) : (
                    filteredListWithReviews.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {/* Product Info - Mobile */}
                            <div className="sm:hidden p-3 border-b">
                                <div className="flex gap-3">
                                    <img
                                        className='w-16 h-16 object-cover rounded border'
                                        src={Array.isArray(item.images) && item.images[0] ? item.images[0] : ''}
                                        alt={item.name}
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                                        <div className="mt-1 text-xs">
                                            {Object.entries(item.price).map(([size, value]) => (
                                                <span key={size} className="mr-2">{size}: {value}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Info - Desktop */}
                            <div className="hidden sm:grid grid-cols-12 items-center gap-2 p-2 border-b">
                                <div className="col-span-1">
                                    <img
                                        className='w-12 h-12 object-cover rounded'
                                        src={Array.isArray(item.images) && item.images[0] ? item.images[0] : ''}
                                        alt=""
                                    />
                                </div>
                                <div className="col-span-3 truncate">{item.name}</div>
                                <div className="col-span-2 text-sm text-gray-600">{item.category}</div>
                                <div className="col-span-2 text-sm">
                                    {Object.entries(item.price).map(([size, value]) => (
                                        <div key={size}>{size}: {value}</div>
                                    ))}
                                </div>
                                <div className="col-span-2 flex flex-col items-center">
                                    <button
                                        onClick={() => toggleReviews(item._id)}
                                        className='bg-purple-400 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs mb-1'
                                    >
                                        {showReviews[item._id] ? 'Ẩn' : 'Xem'} Review
                                    </button>
                                    <span className='text-xs text-gray-500'>
                                        ({reviewCounts[item._id] ?? '--'} Review)
                                    </span>
                                </div>
                                <div className="col-span-2 flex justify-center gap-1">
                                    <button
                                        onClick={() => setViewingProduct(item)}
                                        className='bg-blue-400 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs'
                                    >
                                        Xem
                                    </button>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className='bg-green-400 hover:bg-green-600 text-white px-2 py-1 rounded text-xs'
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => removeProduct(item._id)}
                                        className='bg-red-400 hover:bg-red-600 text-white px-2 py-1 rounded text-xs'
                                    >
                                        Xoá
                                    </button>
                                </div>
                            </div>

                            {/* Actions - Mobile */}
                            <div className="sm:hidden p-3 flex justify-between items-center">
                                <button
                                    onClick={() => toggleReviews(item._id)}
                                    className='bg-purple-400 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs'
                                >
                                    {showReviews[item._id] ? 'Ẩn' : 'Xem'} Review ({reviewCounts[item._id] ?? '--'})
                                </button>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setViewingProduct(item)}
                                        className='bg-blue-400 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs'
                                    >
                                        Xem
                                    </button>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className='bg-green-400 hover:bg-green-600 text-white px-3 py-1 rounded text-xs'
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => removeProduct(item._id)}
                                        className='bg-red-400 hover:bg-red-600 text-white px-3 py-1 rounded text-xs'
                                    >
                                        Xoá
                                    </button>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            {showReviews[item._id] && (
                                <div className='bg-gray-50 p-4 border-t'>
                                    <h4 className='font-semibold mb-3 text-purple-700 text-sm'>Review sản phẩm: {item.name}</h4>
                                    {reviews[item._id]?.length > 0 ? (
                                        <div className='space-y-3'>
                                            {reviews[item._id].map((review, idx) => (
                                                <div key={idx} className='bg-white p-3 rounded-lg border text-sm'>
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
                                                        </div>
                                                        <span className='text-xs text-gray-500'>
                                                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    </div>
                                                    <p className='text-gray-700'>{review.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='text-gray-500 italic text-sm'>Chưa có Review nào.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default List
