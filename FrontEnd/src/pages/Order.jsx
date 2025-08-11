import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'


const Order = () => {
    const { products, currency, backendURL, token } = useContext(ShopContext)
    const [orderData, setOrderData] = useState([])
    const [isCancelling, setIsCancelling] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [orderToCancelId, setOrderToCancelId] = useState(null)
    const [cancelReason, setCancelReason] = useState("");

    // Hàm chuyển đổi trạng thái sang tiếng Việt
    const getStatusInVietnamese = (status) => {
        const statusMap = {
            'Order Placed': 'Đã đặt hàng',
            'Packing': 'Đang đóng gói',
            'Shipped': 'Đang vận chuyển',
            'Out for delivery': 'Đang giao hàng',
            'Delivered': 'Đã giao hàng',
            'Completed': 'Hoàn thành',
            'Processing': 'Đang xử lý',
            'Cancelled': 'Đã hủy'
        };
        return statusMap[status] || status;
    }

    const loadOrderData = async () => {
        if (!token) { // Only fetch if token exists
            console.log("Token not available, skipping order data fetch.");
            return;
        }
        try {
            const res = await axios.get(backendURL + `/api/order/user`, { headers: { Authorization: 'Bearer ' + token } })
            if (res.data.success) {
                console.log('Fetched orders raw data:', res.data.data.orders); // Log raw data
                let allOrdersItem = []
                res.data.data.orders.map((order) => {
                    order.items.map((item) => {
                        // Find product details from the global products list (still needed for images/name if not in item)
                        const productDetail = products.find(product => product._id === item._id);

                        // Use item data from backend, but fallback to productDetail if necessary
                        const currentItem = productDetail ? { ...productDetail, ...item } : item; // Combine data

                        // Determine the unit price using the helper function
                        const unitPrice = getDisplayPrice(currentItem.price, currentItem.sizes); // Use price and sizes from currentItem

                        // Calculate total price for this line item
                        const lineItemTotal = (unitPrice || 0) * (currentItem.quantity || 0); // Ensure calculation with numbers

                        const orderItem = {
                            ...currentItem, // Include all properties from currentItem (combined backend item + productDetail)
                            lineItemTotal: lineItemTotal, // Store the calculated total for this item
                            // Add order-level details (override if exist in item/productDetail)
                            orderId: order._id,
                            status: order.status,
                            payment: order.payment,
                            paymentMethod: order.paymentMethod,
                            date: order.date,
                        };
                        allOrdersItem.push(orderItem);
                        console.log('Created orderItem:', orderItem); // Log each created orderItem
                    });
                });
                setOrderData(allOrdersItem.sort((a, b) => new Date(b.date) - new Date(a.date)));
            }
        } catch (e) {
            console.error("Error loading orders:", e);
            // Handle 401 error specifically if needed, e.g., redirect to login
            if (e.response && e.response.status === 401) {
                console.log("Unauthorized access. Token might be invalid or expired.");
                // You might want to add logic here to log out the user or refresh the token
            }
        }
    };

    useEffect(() => {
        // Only load data if token is available
        if (token) {
            loadOrderData();
        } else {
            console.log("Token not available, skipping order data fetch in useEffect.");
        }
    }, [token, products]); // products is still needed to find product details

    // Helper to get the price value for display from potentially object price
    // Ensures a numeric value is returned
    const getDisplayPrice = (price, size) => {
        if (typeof price === 'object' && price !== null) {
            // Assuming price object keys are size indicators (like M, L, XL)
            // Return price for specific size, or fallback to 'M' or 0 if not found
            // Use the provided size parameter to look up the price and parse to float
            const sizeKey = size || 'M'; // Use provided size or default to 'M'
            const priceValue = price[sizeKey];
            return priceValue !== undefined ? parseFloat(priceValue) : (price.M !== undefined ? parseFloat(price.M) : 0); // Fallback to 'M' if specific size not found
        } else if (typeof price === 'number' || (typeof price === 'string' && !isNaN(parseFloat(price)))) {
            return parseFloat(price); // Price is already a number or parseable string
        }
        return 0; // Default to 0 if price is invalid or null
    };

    // Gom các sản phẩm theo từng đơn hàng
    const groupedOrders = React.useMemo(() => {
        const map = {};
        orderData.forEach(item => {
            if (!map[item.orderId]) {
                map[item.orderId] = {
                    orderId: item.orderId,
                    status: item.status,
                    payment: item.payment,
                    paymentMethod: item.paymentMethod,
                    date: item.date,
                    items: [],
                };
            }
            map[item.orderId].items.push(item);
        });
        // Sắp xếp theo ngày mới nhất
        return Object.values(map).sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [orderData]);

    // Hàm kiểm tra xem đơn hàng có thể hủy được không
    const canCancelOrder = (status) => {
        const nonCancellableStatuses = ["Delivered", "Shipped", "Processing", "Cancelled"]
        return !nonCancellableStatuses.includes(status)
    }

    // Hàm hủy đơn hàng
    const handleCancelOrder = async (orderId) => {
        setOrderToCancelId(orderId)
        setCancelReason("")
        setShowConfirmModal(true)
    }

    // Hàm xác nhận hủy đơn hàng từ modal
    const confirmCancellation = async () => {
        setShowConfirmModal(false)
        if (!orderToCancelId) return

        setIsCancelling(true)
        console.log('Attempting to cancel order with ID:', orderToCancelId, 'Reason:', cancelReason);
        try {
            const res = await axios.delete(backendURL + `/api/order/${orderToCancelId}`, {
                headers: { Authorization: 'Bearer ' + token },
                data: { reason: cancelReason }
            })
            if (res.data.success) {
                toast.success('Hủy đơn hàng thành công')
                loadOrderData()
            }
        } catch (error) {
            console.error("Error cancelling order:", error)
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng')
        } finally {
            setIsCancelling(false)
            setOrderToCancelId(null)
            setCancelReason("")
        }
    }

    // Hàm từ chối hủy đơn hàng từ modal
    const cancelCancellation = () => {
        setShowConfirmModal(false)
        setOrderToCancelId(null)
    }

    return (
        <div className='min-h-screen bg-white'>
            <div className='max-w-7xl mx-auto px-4 py-12'>
                <div className='mb-10'>
                    <Title text1={'Đơn Hàng Của Tôi'} text2={''} />
                </div>

                {Array.isArray(orderData) && orderData.length > 0 ? (
                    <div className='space-y-8'>
                        {groupedOrders.map((order, idx) => (
                            <div key={order.orderId} className='w-full border border-gray-200 rounded-xl p-6 bg-white shadow hover:shadow-lg transition-all'>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2'>
                                    <div className='flex items-center gap-3'>
                                        <span className={`w-3 h-3 rounded-full inline-block ${order.status === 'Delivered' || order.status === 'Completed' ? 'bg-green-500' : order.status === 'Processing' || order.status === 'Packing' ? 'bg-blue-500' : order.status === 'Cancelled' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                        <span className='font-semibold text-gray-700'>{getStatusInVietnamese(order.status)}</span>
                                        <span className='text-gray-400 text-xs'>| #{order.orderId.slice(-6).toUpperCase()}</span>
                                    </div>
                                    <div className='text-gray-500 text-sm'>Ngày đặt: {order.date ? new Date(order.date).toLocaleString('vi-VN') : '-'}</div>
                                </div>
                                <div className='overflow-x-auto'>
                                    <table className='min-w-full'>
                                        <thead>
                                            <tr className='bg-gray-50'>
                                                <th className='px-3 py-2 text-left text-xs font-semibold text-gray-500'>Sản phẩm</th>
                                                <th className='px-3 py-2 text-left text-xs font-semibold text-gray-500'>Size</th>
                                                <th className='px-3 py-2 text-center text-xs font-semibold text-gray-500'>Số lượng</th>
                                                <th className='px-3 py-2 text-right text-xs font-semibold text-gray-500'>Đơn giá</th>
                                                <th className='px-3 py-2 text-right text-xs font-semibold text-gray-500'>Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item, i) => (
                                                <tr key={i} className='border-b last:border-b-0'>
                                                    <td className='px-3 py-2 flex items-center gap-2'>
                                                        <img src={item.images && Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : ''} alt={item.name || 'Product'} className='w-12 h-12 object-cover rounded' />
                                                        <span className='font-medium text-gray-900'>{item.name || 'Unknown'}</span>
                                                    </td>
                                                    <td className='px-3 py-2'>{item.size}</td>
                                                    <td className='px-3 py-2 text-center'>{item.quantity}</td>
                                                    <td className='px-3 py-2 text-right'>{getDisplayPrice(item.price, item.size)} {currency}</td>
                                                    <td className='px-3 py-2 text-right'>{item.lineItemTotal} {currency}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-2'>
                                    <div className='flex items-center gap-4'>
                                        <span className='text-gray-500 text-sm'>Phương thức: <span className='font-medium text-red-500'>{order.paymentMethod || '-'}</span></span>
                                        <span className='text-gray-500 text-sm'>Thanh toán: <span className='font-medium text-green-500'>{order.payment ? 'Đã thanh toán' : 'Chưa thanh toán'}</span></span>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        <span className='text-lg font-bold text-gray-900'>Tổng: {order.items.reduce((sum, item) => sum + (item.lineItemTotal || 0), 0)} {currency}</span>
                                        <button onClick={loadOrderData} className='px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors'>Theo Dõi Đơn Hàng</button>
                                        {canCancelOrder(order.status) && (
                                            <button onClick={() => handleCancelOrder(order.orderId)} disabled={isCancelling} className='px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50'>
                                                {isCancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-16'>
                        <div className='text-gray-300 mb-4'>
                            <svg className='mx-auto h-12 w-12' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
                            </svg>
                        </div>
                        <h3 className='text-lg font-medium text-gray-900 mb-1'>Không có đơn hàng nào</h3>
                        <p className='text-gray-500'>Bạn chưa có đơn hàng nào trong hệ thống.</p>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 max-w-sm w-full shadow-lg'>
                        <h4 className='text-lg font-semibold mb-4'>Xác nhận hủy đơn hàng</h4>
                        <p className='text-gray-700 mb-4'>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
                        <textarea
                            className='w-full border border-gray-300 rounded-md p-2 mb-6 focus:outline-none focus:ring-2 focus:ring-red-200'
                            placeholder='Lý do hủy đơn hàng (bắt buộc)'
                            value={cancelReason}
                            onChange={e => setCancelReason(e.target.value)}
                            rows={3}
                            required
                        />
                        <div className='flex justify-end gap-3'>
                            <button
                                onClick={cancelCancellation}
                                className='px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors'
                            >
                                Không
                            </button>
                            <button
                                onClick={confirmCancellation}
                                className='px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors'
                                disabled={!cancelReason.trim()}
                            >
                                Có
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Order
