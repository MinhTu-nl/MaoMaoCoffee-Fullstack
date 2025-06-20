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
                console.log("Fetched orders with branch data:", res.data.data.orders.map(order => ({
                    id: order._id,
                    branch: order.branch,
                    branchName: order.branch?.name,
                    branchLocation: order.branch?.location
                })))
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
            } else {
                setError(e.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng')
                toast.error(e.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng')
            }
        }
    }

    const paymentStatusHandler = async (orderId, currentStatus) => {
        try {
            const res = await axios.patch(
                backEndURL + '/api/order/payment/' + orderId,
                { payment: !currentStatus },
                { headers: { token } }
            )

            if (res.data.success) {
                await fetchAllOrders()
                toast.success('Cập nhật trạng thái thanh toán thành công')
            } else {
                toast.error(res.data.message)
            }
        } catch (e) {
            console.error(e)
            if (e.response && e.response.status === 401) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
            } else {
                setError(e.response?.data?.message || 'Không thể cập nhật trạng thái thanh toán')
                toast.error(e.response?.data?.message || 'Không thể cập nhật trạng thái thanh toán')
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
                                className='bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6'
                            >
                                {/* Header Section */}
                                <div className="flex items-center justify-between border-b pb-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <img className='w-10 h-10' src={assets.parcel_icon} alt="Đơn hàng" />
                                        <div>
                                            <h3 className="font-semibold text-gray-800">Đơn hàng #{order._id.slice(-6)}</h3>
                                            <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.date).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className='text-lg font-semibold text-gray-800'>
                                            {order.amount.toLocaleString('vi-VN')} {currency}
                                        </p>
                                        <p className="text-sm text-gray-500">Số lượng: {order.items.length} sản phẩm</p>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Items List */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-700 mb-2">Sản phẩm</h4>
                                        <div className="space-y-2 text-sm">
                                            {order.items.map((item, itemIndex) => (
                                                <div key={itemIndex} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        {item.sizes && <p className="text-gray-500 text-xs">Size: {item.sizes}</p>}
                                                    </div>
                                                    <span className="text-gray-600 font-medium">x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-700 mb-2">Thông tin khách hàng</h4>
                                        <div className="space-y-1 text-sm">
                                            <p className="font-medium">{order.address.firstName} {order.address.lastName}</p>
                                            <p>{order.address.street}</p>
                                            <p>{[order.address.city, order.address.state, order.address.country].filter(Boolean).join(', ')}</p>
                                            <p className="text-blue-600">{order.address.phone}</p>
                                        </div>
                                    </div>

                                    {/* Branch Info */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-700 mb-2">Thông tin chi nhánh</h4>
                                        <div className="space-y-1 text-sm">
                                            <p className="font-medium">{order.branch?.name || 'N/A'}</p>
                                            {order.branch?.location && (
                                                <p className="text-gray-600">{order.branch.location}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-700 mb-2">Chi tiết đơn hàng</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1 text-sm">
                                            <p>Phương thức: {order.paymentMethod}</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${order.payment ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <span>{order.payment ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                            <select
                                                onChange={(event) => statusHandler(event, order._id)}
                                                value={order.status}
                                                className='p-2 font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
                                            >
                                                <option value="Order Placed">{getStatusInVietnamese('Order Placed')}</option>
                                                <option value="Packing">{getStatusInVietnamese('Packing')}</option>
                                                <option value="Shipped">{getStatusInVietnamese('Shipped')}</option>
                                                <option value="Out for delivery">{getStatusInVietnamese('Out for delivery')}</option>
                                                <option value="Delivered">{getStatusInVietnamese('Delivered')}</option>
                                            </select>
                                            <button
                                                onClick={() => paymentStatusHandler(order._id, order.payment)}
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                                                    ${order.payment
                                                        ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20 hover:bg-green-100'
                                                        : 'bg-red-50 text-red-700 ring-1 ring-red-600/20 hover:bg-red-100'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${order.payment ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    {order.payment ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    ))
                )}
            </div>
        </div>
    )
}

export default Order
