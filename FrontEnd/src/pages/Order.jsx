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
                setOrderData(allOrdersItem);
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

    // Hàm kiểm tra xem đơn hàng có thể hủy được không
    const canCancelOrder = (status) => {
        const nonCancellableStatuses = ["Delivered", "Shipped", "Processing", "Cancelled"]
        return !nonCancellableStatuses.includes(status)
    }

    // Hàm hủy đơn hàng
    const handleCancelOrder = async (orderId) => {
        setOrderToCancelId(orderId)
        setShowConfirmModal(true)
    }

    // Hàm xác nhận hủy đơn hàng từ modal
    const confirmCancellation = async () => {
        setShowConfirmModal(false)
        if (!orderToCancelId) return

        setIsCancelling(true)
        console.log('Attempting to cancel order with ID:', orderToCancelId);
        try {
            const res = await axios.delete(backendURL + `/api/order/${orderToCancelId}`, {
                headers: { Authorization: 'Bearer ' + token }
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
        }
    }

    // Hàm từ chối hủy đơn hàng từ modal
    const cancelCancellation = () => {
        setShowConfirmModal(false)
        setOrderToCancelId(null)
    }

    return (
        <div className='min-h-screen bg-white'>
            <div className='max-w-4xl mx-auto px-4 py-12'>
                <div className='mb-10'>
                    <Title text1={'Đơn Hàng Của Tôi'} text2={''} />
                </div>

                {Array.isArray(orderData) && orderData.length > 0 ? (
                    <div className='space-y-6'>
                        {orderData.map((item, index) => (
                            <div key={index} className='border border-gray-100 rounded-lg p-6 hover:border-gray-200 transition-colors duration-200'>
                                <div className='flex flex-col md:flex-row gap-6'>
                                    {/* Product Image and Basic Info */}
                                    <div className='flex gap-6 flex-1'>
                                        <img
                                            className='w-24 h-24 object-cover rounded-lg'
                                            src={item.images && Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : ''}
                                            alt={item.name || 'Product image'}
                                        />
                                        <div className='flex-1'>
                                            <h3 className='text-lg font-medium text-gray-900 mb-2'>{item.name || 'Unknown Product'}</h3>
                                            <div className='space-y-1 text-sm text-gray-600'>
                                                <p>Quantity: {item.quantity || '-'}</p>
                                                <p>Size: {item.sizes}</p>
                                                <p>Date: {item.date ? new Date(item.date).toLocaleDateString('vi-VN') : '-'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Status and Actions */}
                                    <div className='md:w-48 flex flex-col justify-between'>
                                        <div className='flex items-center gap-2 mb-4'>
                                            <span className={`w-2 h-2 rounded-full ${item.status === 'Delivered' || item.status === 'Completed' ? 'bg-green-500' :
                                                item.status === 'Processing' || item.status === 'Packing' ? 'bg-blue-500' :
                                                    item.status === 'Cancelled' ? 'bg-red-500' :
                                                        'bg-yellow-500'
                                                }`}></span>
                                            <span className='text-sm text-gray-600'>{getStatusInVietnamese(item.status) || 'Trạng thái không xác định'}</span>
                                        </div>
                                        <div className='space-y-3'>
                                            <div className='text-right'>
                                                <p className='text-lg font-medium text-gray-900'>
                                                    {item.lineItemTotal !== undefined ? item.lineItemTotal : '-'} {currency}
                                                </p>
                                                <p className='text-sm text-gray-500'>{item.paymentMethod || '-'}</p>
                                            </div>
                                            <div className='flex gap-2'>
                                                <button
                                                    onClick={loadOrderData}
                                                    className='flex-1 px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200'
                                                >
                                                    Theo Dõi Đơn Hàng
                                                </button>
                                                {canCancelOrder(item.status) && (
                                                    <button
                                                        onClick={() => handleCancelOrder(item.orderId)}
                                                        disabled={isCancelling}
                                                        className='flex-1 px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200 disabled:opacity-50'
                                                    >
                                                        {isCancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
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
                        <p className='text-gray-700 mb-6'>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
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
