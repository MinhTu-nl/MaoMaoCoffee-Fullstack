import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backEndURL } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets.js'


const Order = ({ token }) => {
    const currency = 'VNĐ'
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Hàm chuyển đổi trạng thái sang tiếng Việt
    const getStatusInVietnamese = (status) => {
        const statusMap = {
            'Order Placed': 'Đã đặt hàng',
            'Packing': 'Đang đóng gói',
            'Shipped': 'Đang vận chuyển',
            'Out for delivery': 'Đang giao hàng',
            'Delivered': 'Đã giao hàng'
        };
        return statusMap[status] || status;
    }

    const fetchAllOrders = async () => {
        if (!token) {
            setError('Vui lòng đăng nhập để xem đơn hàng')
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const res = await axios.get(
                backEndURL + `/api/order/all`,
                { headers: { token } }
            )

            if (res.data.success) {
                setOrders(res.data.data.orders)
                console.log("Fetched orders:", res.data.data.orders)
                setError(null)
            } else {
                setError(res.data.message)
                toast.error(res.data.message)
            }
        } catch (e) {
            console.error(e)
            if (e.response && e.response.status === 401) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
                // TODO: Redirect user to login page or trigger logout
            } else {
                setError(e.message)
                toast.error(e.message)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllOrders()
    }, [token])

    const statusHandler = async (event, orderId) => {
        try {
            const res = await axios.patch(
                backEndURL + '/api/order/status/' + orderId,
                { status: event.target.value },
                { headers: { token } }
            )

            if (res.data.success) {
                await fetchAllOrders()
                toast.success('Cập nhật trạng thái đơn hàng thành công')
            } else {
                toast.error(res.data.message)
            }
        } catch (e) {
            console.error(e)
            if (e.response && e.response.status === 401) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
                // TODO: Redirect user to login page or trigger logout
            } else {
                setError(e.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng')
                toast.error(e.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng')
            }
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold">Lỗi</p>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        Không có đơn hàng nào
                    </div>
                ) : (
                    orders.map((order, index) => (
                        order && order.items && Array.isArray(order.items) ? (
                            <div
                                key={order._id || index}
                                className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow'
                            >
                                <img className='w-12' src={assets.parcel_icon} alt="Đơn hàng" />
                                <div>
                                    <div>
                                        {order.items && Array.isArray(order.items) && order.items.map((item, itemIndex, itemsArray) => (
                                            <p className='py-0.5' key={itemIndex}>
                                                {item.name} x {item.quantity}
                                                {item.sizes && <span className="ml-1">{item.sizes}</span>}
                                                {itemIndex < itemsArray.length - 1 && ','}
                                            </p>
                                        ))}
                                    </div>
                                    <p className='mt-3 mb-2 font-medium'>
                                        {order.address.firstName} {order.address.lastName}
                                    </p>
                                    <div>
                                        <p>{order.address.street},</p>
                                        <p>
                                            {[
                                                order.address.city,
                                                order.address.state,
                                                order.address.country,
                                                order.address.zipcode
                                            ].filter(Boolean).join(' ')}
                                        </p>
                                    </div>
                                    <p>{order.address.phone}</p>
                                </div>
                                <div>
                                    <p className='text-sm sm:text-[15px]'>Số lượng: {order.items.length}</p>
                                    <p className='mt-3'>Phương thức: {order.paymentMethod}</p>
                                    <p>Thanh toán: {order.payment ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                                    <p>Ngày đặt: {new Date(order.date).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <p className='text-sm sm:text-[15px] font-semibold'>
                                    {order.amount.toLocaleString('vi-VN')} {currency}
                                </p>
                                <select
                                    onChange={(event) => statusHandler(event, order._id)}
                                    value={order.status}
                                    className='p-2 font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                >
                                    <option value="Order Placed">{getStatusInVietnamese('Order Placed')}</option>
                                    <option value="Packing">{getStatusInVietnamese('Packing')}</option>
                                    <option value="Shipped">{getStatusInVietnamese('Shipped')}</option>
                                    <option value="Out for delivery">{getStatusInVietnamese('Out for delivery')}</option>
                                    <option value="Delivered">{getStatusInVietnamese('Delivered')}</option>
                                </select>
                            </div>
                        ) : null
                    ))
                )}
            </div>
        </div>
    )
}

export default Order
