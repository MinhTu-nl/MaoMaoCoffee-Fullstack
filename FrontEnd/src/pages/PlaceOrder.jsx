import React, { useContext, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'


const PlaceOrder = () => {
    const [method, setMethod] = useState('cod')
    const { navigrate } = useContext(ShopContext)

    return (
        <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* ------------ Left Side ------------ */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'Nhập Thông Tin Của Bạn'} text2={''} />
                </div>
                {/* -- 4:19:56 */}
                <div class="flex gap-3">
                    <input value='' required name="firstName" class="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Họ (Ví dụ: Nguyễn)" />
                    <input value='' required name="lastName" class="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Tên (Ví dụ: An)" />
                </div>
                <input value='' required name="email" class="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Địa chỉ Email" />
                <input value='' required name="address" class="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Địa chỉ" />
                <input value='' required name="phone" class="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Phone" />
                <input value='' required name="note" class="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Ghi chú" />

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
                        <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                            <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                            <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>Khi Nhận Hàng</p>
                        </div>
                    </div>

                    <div className='w-full text-end mt-8'>
                        <button onClick={() => navigrate('/Order')} className='bg-black text-white px-16 py-3 text-sm'>Đặt Hàng</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PlaceOrder
