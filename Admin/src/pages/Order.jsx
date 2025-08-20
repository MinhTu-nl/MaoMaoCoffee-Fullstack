import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backEndURL } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets.js'


const Order = ({ token }) => {
    const currency = 'VNĐ'
    // danh sách đơn hàng
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Hàm chuyển đổi trạng thái sang tiếng Việt
    // map trạng thái tiếng Anh sang tiếng Việt để hiển thị ở UI
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

    // Lấy tất cả đơn hàng (yêu cầu token để xác thực)
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
                setError(null)
            } else {
                setError(res.data.message)
                toast.error(res.data.message)
            }
        } catch (e) {
            console.error(e)
            // xử lý lỗi auth 401: session hết hạn
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

    // reload khi token thay đổi hoặc lần đầu mount
    useEffect(() => {
        fetchAllOrders()
    }, [token])

    const allowedStatuses = [
        'Order Placed',
        'Packing',
        'Shipped',
        'Out for delivery',
        'Delivered',
    ]

    // Thay đổi trạng thái đơn hàng (PATCH). UI ngăn người dùng chọn trạng thái lùi lại.
    const statusHandler = async (event, orderId, currentStatus) => {
        const selectedStatus = event.target.value

        // Prevent no-op or backward transitions on UI
        const currentIndex = allowedStatuses.indexOf(currentStatus)
        const newIndex = allowedStatuses.indexOf(selectedStatus)
        if (newIndex <= currentIndex) {
            toast.warn('Không thể cập nhật về trạng thái trước đó hoặc trùng với trạng thái hiện tại.')
            return
        }
        try {
            const res = await axios.patch(
                backEndURL + '/api/order/status/' + orderId,
                { status: selectedStatus },
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

    // Toggle trạng thái thanh toán (PATCH) - backend nhận boolean `payment`
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

    // Derived metrics for stats
    const totalOrders = orders.length
    const paidCount = orders.filter(o => o.payment).length
    const unpaidCount = totalOrders - paidCount
    const paidRate = totalOrders ? Math.round((paidCount / totalOrders) * 100) : 0

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-600 text-center">
                    <p className="text-xl font-semibold">Lỗi</p>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header + Payment stats in one row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                        <img src={assets.order_icon} alt="Quản lý đơn hàng" className="h-8 w-8" />
                        <div>
                            <h1 className="text-2xl font-bold text-blue-950">Quản lý đơn hàng</h1>
                            <p className="text-sm text-gray-600">Theo dõi, cập nhật trạng thái và thanh toán</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="rounded-md border border-green-200 bg-green-50 p-3">
                            <p className="text-xs font-medium text-green-800">Đã thanh toán</p>
                            <p className="mt-1 text-2xl font-bold text-green-700">{paidCount}</p>
                        </div>
                        <div className="rounded-md border border-red-200 bg-red-50 p-3">
                            <p className="text-xs font-medium text-red-800">Chưa thanh toán</p>
                            <p className="mt-1 text-2xl font-bold text-red-700">{unpaidCount}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center text-blue-950 py-8 text-lg">
                        Không có đơn hàng nào
                    </div>
                ) : (
                    orders.map((order, index) => (
                        order && order.items && Array.isArray(order.items) ? (
                            <div
                                key={order._id || index}
                                className='bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6'
                            >
                                {/* Header Section */}
                                <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <img className='w-10 h-10' src={assets.parcel_icon} alt="Đơn hàng" />
                                        <div>
                                            <h3 className="font-bold text-blue-950 text-lg">Đơn hàng #{order._id.slice(-6)}</h3>
                                            <p className="text-sm text-gray-700 font-medium">Ngày đặt: {new Date(order.date).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className='text-xl font-bold text-blue-950'>
                                            {order.amount.toLocaleString('vi-VN')} {currency}
                                        </p>
                                        <p className="text-sm text-gray-700 font-medium">Số lượng: {order.items.length} sản phẩm</p>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Items List */}
                                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                                        <h4 className="font-bold text-blue-950 mb-3 text-base">Sản phẩm</h4>
                                        <div className="space-y-3 text-sm">
                                            {order.items.map((item, itemIndex) => (
                                                <div key={itemIndex} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{item.name}</p>
                                                        {item.sizes && <p className="text-gray-700 text-xs font-medium">Size: {item.sizes}</p>}
                                                    </div>
                                                    <span className="text-gray-900 font-bold">x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                                        <h4 className="font-bold text-green-700 mb-3 text-base">Thông tin khách hàng</h4>
                                        <div className="space-y-2 text-sm">
                                            <p className="font-semibold text-gray-900">{order.address.firstName} {order.address.lastName}</p>
                                            <p className="text-gray-800">{order.address.street}</p>
                                            <p className="text-gray-800">{[order.address.city, order.address.state, order.address.country].filter(Boolean).join(', ')}</p>
                                            <p className="text-blue-700 font-semibold">{order.address.phone}</p>
                                            {order.address.note && (
                                                <p className="text-gray-700 italic font-medium">Ghi chú: {order.address.note}</p>
                                            )}
                                            {order.note && !order.address.note && (
                                                <p className="text-gray-700 italic font-medium">Ghi chú: {order.note}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Branch Info */}
                                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                                        <h4 className="font-bold text-yellow-700 mb-3 text-base">Thông tin chi nhánh</h4>
                                        <div className="space-y-2 text-sm">
                                            <p className="font-semibold text-gray-900">{order.branch?.name || 'N/A'}</p>
                                            {order.branch?.location && (
                                                <p className="text-gray-800">{order.branch.location}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="mt-4 bg-gray-100 p-4 rounded-lg border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-3 text-base">Chi tiết đơn hàng</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2 text-sm">
                                            <p className="text-gray-800 font-medium">Phương thức: {order.paymentMethod}</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-3 h-3 rounded-full ${order.payment ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                                <span className={`font-semibold ${order.payment ? 'text-green-700' : 'text-red-700'}`}>
                                                    {order.payment ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                            <select
                                                onChange={(event) => statusHandler(event, order._id, order.status)}
                                                value={order.status}
                                                className='p-2 font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900'
                                            >
                                                {allowedStatuses.map((st) => {
                                                    const disabled = allowedStatuses.indexOf(st) <= allowedStatuses.indexOf(order.status)
                                                    return (
                                                        <option key={st} value={st} disabled={disabled}>
                                                            {getStatusInVietnamese(st)}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                            <button
                                                onClick={() => paymentStatusHandler(order._id, order.payment)}
                                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors
                                                    ${order.payment
                                                        ? 'bg-green-100 text-green-800 ring-1 ring-green-600 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-800 ring-1 ring-red-600 hover:bg-red-200'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${order.payment ? 'bg-green-600' : 'bg-red-600'}`}></span>
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
