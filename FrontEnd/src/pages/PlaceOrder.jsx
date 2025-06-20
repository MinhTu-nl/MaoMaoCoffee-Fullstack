import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import axios from 'axios'
import { toast } from 'react-toastify'
import BranchList from '../components/BranchList'

const PlaceOrder = () => {
    const [method, setMethod] = useState('cod')
    const { navigate, backendURL, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        phone: '',
        note: ''
    })
    const [selectedBranch, setSelectedBranch] = useState(null)
    const [errors, setErrors] = useState({})
    const [orderItemsToDisplay, setOrderItemsToDisplay] = useState([])

    useEffect(() => {
        const preparedItems = [];
        for (const productId in cartItems) {
            for (const size in cartItems[productId]) {
                if (cartItems[productId][size] > 0) {
                    preparedItems.push({
                        productId: productId,
                        size: size,
                        quantity: cartItems[productId][size]
                    });
                }
            }
        }
        setOrderItemsToDisplay(preparedItems);
    }, [cartItems, products]);

    const validateForm = () => {
        const newErrors = {}
        if (!formData.firstName) {
            newErrors.firstName = 'Vui lòng nhập họ'
            toast.info('Vui lòng nhập họ của bạn')
        }
        if (!formData.lastName) {
            newErrors.lastName = 'Vui lòng nhập tên'
            toast.info('Vui lòng nhập tên của bạn')
        }
        if (!formData.email) {
            newErrors.email = 'Vui lòng nhập email'
            toast.info('Vui lòng nhập địa chỉ email của bạn')
        }
        if (!formData.address) {
            newErrors.address = 'Vui lòng nhập địa chỉ'
            toast.info('Vui lòng nhập địa chỉ giao hàng')
        }
        if (!formData.phone) {
            newErrors.phone = 'Vui lòng nhập số điện thoại'
            toast.info('Vui lòng nhập số điện thoại của bạn')
        }
        if (!selectedBranch) {
            toast.info('Vui lòng chọn chi nhánh gần nhất')
            return false
        }
        if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ'
            toast.info('Số điện thoại phải có 10 chữ số')
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ'
            toast.info('Vui lòng nhập địa chỉ email hợp lệ')
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin')
            return
        }

        try {
            let orderItems = []

            for (const productId in cartItems) {
                for (const size in cartItems[productId]) {
                    if (cartItems[productId][size] > 0) {
                        // The backend expects an array of objects with productId, size, and quantity
                        orderItems.push({
                            productId: productId,
                            size: size,
                            quantity: cartItems[productId][size]
                        })
                    }
                }
            }

            if (orderItems.length === 0) {
                toast.warning('Giỏ hàng trống')
                return
            }

            let orderData = {
                address: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    street: formData.address,
                    phone: formData.phone,
                    note: formData.note,
                    city: 'Default City', // Placeholder - Ideally collect from user
                    country: 'Default Country' // Placeholder - Ideally collect from user
                },
                items: orderItems,
                amount: getCartAmount() + delivery_fee,
                branchId: selectedBranch._id
            }

            switch (method) {
                case 'cod':
                    const res = await axios.post(backendURL + `/api/order/place`, orderData, { headers: { Authorization: 'Bearer ' + token } })
                    if (res.data.success) {
                        setCartItems({})
                        toast.success('Đặt hàng thành công')
                        navigate('/Order')
                    } else {
                        toast.warning(res.data.message)
                    }
                    break
                // case 'stripe':
                //     toast.info('Phương thức thanh toán Stripe đang được phát triển')
                //     break
                // case 'razorpay':
                //     toast.info('Phương thức thanh toán Razorpay đang được phát triển')
                //     break
                default:
                    toast.error('Phương thức thanh toán không hợp lệ')
            }
        } catch (e) {
            console.error(e)
            toast.error(e.message || 'Có lỗi xảy ra khi đặt hàng')
        }
    }

    return (
        <div className='min-h-[80vh] py-8 sm:py-16 bg-gray-50'>
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
                    Hoàn tất Đơn hàng của bạn
                </h1>

                <div className='flex flex-col lg:flex-row gap-8'>
                    {/* ------------ Left Side: Customer Information and Branch Selection ------------ */}
                    <div className='flex-1 bg-white p-6 sm:p-8 rounded-lg shadow-md'>
                        <h2 className='text-2xl font-semibold text-gray-800 mb-6 border-b pb-4'>Thông tin giao hàng</h2>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="md:col-span-1">
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
                                <input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={onChangeHandler}
                                    required
                                    name="firstName"
                                    className={`block w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    type="text"
                                    placeholder="Nguyễn"
                                />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                            </div>
                            <div className="md:col-span-1">
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                                <input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={onChangeHandler}
                                    required
                                    name="lastName"
                                    className={`block w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    type="text"
                                    placeholder="An"
                                />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    id="email"
                                    value={formData.email}
                                    onChange={onChangeHandler}
                                    required
                                    name="email"
                                    className={`block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    type="email"
                                    placeholder="example@email.com"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
                                <input
                                    id="address"
                                    value={formData.address}
                                    onChange={onChangeHandler}
                                    required
                                    name="address"
                                    className={`block w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    type="text"
                                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                                />
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                <input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={onChangeHandler}
                                    required
                                    name="phone"
                                    className={`block w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    type="tel"
                                    placeholder="09x-xxx-xxxx"
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (Tùy chọn)</label>
                                <textarea
                                    id="note"
                                    value={formData.note}
                                    onChange={onChangeHandler}
                                    name="note"
                                    rows="3"
                                    className="block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Ví dụ: Giao hàng vào buổi tối, để ở cổng..."
                                ></textarea>
                            </div>
                        </form>

                        {/* Branch Selection */}
                        <div className="mt-8 pt-6 border-t">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Chọn chi nhánh gần nhất</h2>
                            <BranchList onSelect={setSelectedBranch} selectedBranch={selectedBranch} />
                        </div>
                    </div>

                    {/* ---------- Right Side: Order Summary and Payment Method ------------ */}
                    <div className='lg:flex-1 bg-white p-6 sm:p-8 rounded-lg shadow-md flex flex-col justify-between'>
                        <div>
                            <h2 className='text-2xl font-semibold text-gray-800 mb-6 border-b pb-4'>Tổng quan đơn hàng</h2>
                            <CartTotal items={orderItemsToDisplay} />
                        </div>

                        <div className='mt-8 pt-6 border-t'>
                            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Phương thức thanh toán</h2>
                            <div className='flex flex-col gap-4'>
                                <label
                                    onClick={() => setMethod('cod')}
                                    className={`flex items-center gap-3 border p-4 rounded-lg cursor-pointer transition-colors
                                        ${method === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}
                                    `}
                                >
                                    <span className={`h-4 w-4 rounded-full border-2 ${method === 'cod' ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'} flex-shrink-0`}></span>
                                    <p className='text-gray-700 font-medium'>Thanh toán khi nhận hàng (COD)</p>
                                </label>
                            </div>

                            <div className='w-full mt-8'>
                                <button
                                    type="button"
                                    onClick={onSubmitHandler}
                                    className='w-full bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md'
                                >
                                    Đặt Hàng Ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder
