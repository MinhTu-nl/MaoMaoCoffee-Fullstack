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
    const fetchList = async () => {
        try {
            const res = await axios.get(backEndURL + `/api/product/list?limit=1000`)
            console.log(res.data.data)
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

    return (
        <>
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
            <p className='text-sm text-gray-500 px-6 mb-4'>Số lượng sản phẩm hiện có: {list.length}</p>
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
                    list.map((item, index) => (
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
