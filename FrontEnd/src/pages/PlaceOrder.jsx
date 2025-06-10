import React, { useContext, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import axios from 'axios'
import { toast } from 'react-toastify'

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
    const [errors, setErrors] = useState({})

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

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.sizes = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }

            if (orderItems.length === 0) {
                toast.warning('Giỏ hàng trống')
                return
            }

            let orderData = {
                address: {
                    street: formData.address,
                    city: 'Default City', // Placeholder - Ideally collect from user
                    country: 'Default Country' // Placeholder - Ideally collect from user
                },
                items: orderItems,
                amount: getCartAmount() + delivery_fee
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
        <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* ------------ Left Side ------------ */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'Nhập Thông Tin Của Bạn'} text2={''} />
                </div>
                <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
                    <div className="flex gap-3">
                        <div className="w-full">
                            <input
                                value={formData.firstName}
                                onChange={onChangeHandler}
                                required
                                name="firstName"
                                className={`border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`}
                                type="text"
                                placeholder="Họ (Ví dụ: Nguyễn)"
                            />
                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                        </div>
                        <div className="w-full">
                            <input
                                value={formData.lastName}
                                onChange={onChangeHandler}
                                required
                                name="lastName"
                                className={`border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`}
                                type="text"
                                placeholder="Tên (Ví dụ: An)"
                            />
                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                        </div>
                    </div>
                    <div>
                        <input
                            value={formData.email}
                            onChange={onChangeHandler}
                            required
                            name="email"
                            className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`}
                            type="email"
                            placeholder="Địa chỉ Email"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <input
                            value={formData.address}
                            onChange={onChangeHandler}
                            required
                            name="address"
                            className={`border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`}
                            type="text"
                            placeholder="Địa chỉ"
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div>
                        <input
                            value={formData.phone}
                            onChange={onChangeHandler}
                            required
                            name="phone"
                            className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`}
                            type="tel"
                            placeholder="Số điện thoại"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                        <input
                            value={formData.note}
                            onChange={onChangeHandler}
                            name="note"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            type="text"
                            placeholder="Ghi chú"
                        />
                    </div>
                </form>
            </div>

            {/* ---------- Right Side ------------ */}
            <div className='mt-8'>
                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <Title text1={"PAYMENT"} text2={"METHOD"} />
                    {/* ------------ Payment method selection -------------- */}
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        {/* <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                            <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                            <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
                        </div> */}
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>Khi Nhận Hàng</p>
                        </div>
                    </div>

                    <div className='w-full text-end mt-8'>
                        <button
                            onClick={onSubmitHandler}
                            className='bg-black text-white px-16 py-3 text-sm hover:bg-gray-800 transition-colors'
                        >
                            Đặt Hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder
