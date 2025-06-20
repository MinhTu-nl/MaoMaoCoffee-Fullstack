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
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const fetchList = async () => {
        try {
            const res = await axios.get(backEndURL + `/api/product/list?limit=1000`)
            if (res.data.success) {
                setList(res.data.data)
            } else {
                toast.error(res.data.message)
            }
        } catch (e) {
            console.log(e)
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

    useEffect(() => {
        fetchList()
    }, [])

    // Tính danh sách đã lọc
    const filteredList = list
        .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(item => !categoryFilter || item.category === categoryFilter)
        .filter(item => !subCategoryFilter || item.subCategory === subCategoryFilter)
        .filter(item => {
            const prices = Object.values(item.price || {}).map(Number);
            const min = minPrice ? Number(minPrice) : null;
            const max = maxPrice ? Number(maxPrice) : null;
            if (min !== null && prices.every(p => p < min)) return false;
            if (max !== null && prices.every(p => p > max)) return false;
            if (min !== null && max !== null && prices.every(p => p < min || p > max)) return false;
            return true;
        });

    return (
        <>
            {/* Bộ lọc + Thanh tìm kiếm ngang hàng */}
            <div className='px-6 mb-4 flex flex-col md:flex-row md:items-end gap-2'>
                <div className='flex flex-col md:flex-row gap-2 flex-1'>
                    <div>
                        <label className='block text-xs mb-1'>Loại sản phẩm</label>
                        <select
                            className='border px-2 py-1 rounded w-full md:w-40'
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                        >
                            <option value=''>Tất cả</option>
                            <option value='coldbew'>Coldbrew</option>
                            <option value='coffee'>Cà phê</option>
                            <option value='tea'>Trà</option>
                            <option value='milk'>Trà sữa</option>
                            <option value='ice'>Đá xay</option>
                            <option value='croffle'>Croffle</option>
                            <option value='toast'>Bánh nướng</option>
                        </select>
                    </div>
                    <div>
                        <label className='block text-xs mb-1'>Nhóm</label>
                        <select
                            className='border px-2 py-1 rounded w-full md:w-32'
                            value={subCategoryFilter}
                            onChange={e => setSubCategoryFilter(e.target.value)}
                        >
                            <option value=''>Tất cả</option>
                            <option value='drink'>Đồ uống</option>
                            <option value='food'>Món ăn</option>
                            <option value='dessert'>Tráng miệng</option>
                        </select>
                    </div>
                </div>
                <div className='flex-1'>
                    <label className='block text-xs mb-1 invisible md:visible'>&nbsp;</label>
                    <input
                        type='text'
                        placeholder='Tìm kiếm sản phẩm theo tên...'
                        className='border px-3 py-2 rounded w-full md:w-full mb-2 md:mb-0'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
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
                <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_2fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b className='text-center'>Action</b>
                </div>

                {/* ------------- LIST TABLE DATA--------------- */}
                {
                    filteredList
                        .map((item, index) => (
                            <div key={index} className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_2fr] items-center gap-2 py-1 px-2 border text-sm'>
                                <img className='w-12' src={Array.isArray(item.images) && item.images[0] ? item.images[0] : ''} alt="" />
                                <p>{item.name}</p>
                                <p>{item.category}</p>
                                <p>
                                    {Object.entries(item.price).map(([size, value]) => (
                                        <span key={size} style={{ display: 'block' }}>{size}: {value}</span>
                                    ))}
                                </p>
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
                        ))
                }
            </div>
        </>
    )
}

export default List
