import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const NewsletterBox = () => {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Reset form
        setEmail('')
        setIsSubmitting(false)
        toast.info('Cảm ơn bạn đã đăng ký!')
    }

    return (
        <div className='py-12 md:py-16 px-4 md:px-6 lg:px-8'>
            <div className='relative overflow-hidden bg-gradient-to-r from-blue-950 to-indigo-950 rounded-xl shadow-xl max-w-7xl mx-auto'>
                {/* Background Pattern */}
                <div className='absolute inset-0 opacity-20'>
                    <div className='absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full translate-x-16 -translate-y-16'></div>
                    <div className='absolute bottom-0 left-0 w-24 h-24 bg-indigo-600 rounded-full -translate-x-12 translate-y-12'></div>
                </div>

                <div className='relative flex flex-col lg:flex-row items-center gap-8 p-8 lg:p-12'>
                    {/* Left Side - Content */}
                    <div className='flex-1 space-y-6 text-center lg:text-left'>
                        <div className='space-y-3'>
                            <h2 className='text-3xl lg:text-4xl font-bold text-white leading-tight'>
                                Đăng Ký Nhận
                                <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300'> Bản Tin</span>
                            </h2>
                            <p className='text-blue-100 text-base lg:text-lg max-w-2xl mx-auto lg:mx-0'>
                                Nhận ưu đãi 20% cho lần mua đầu tiên và cập nhật sản phẩm mới nhất
                            </p>
                        </div>

                        <form onSubmit={onSubmitHandler} className='space-y-4'>
                            <div className='flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0'>
                                <input
                                    className='flex-1 px-6 py-4 rounded-xl border-2 border-blue-800 focus:border-blue-300 focus:ring-2 focus:ring-blue-300/20 transition-all duration-200 outline-none text-gray-900 placeholder-gray-500 bg-white/95 text-base'
                                    type="email"
                                    required
                                    placeholder='Nhập email của bạn'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 text-base
                                        ${isSubmitting
                                            ? 'bg-gray-600 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 hover:shadow-lg'
                                        }`}
                                >
                                    {isSubmitting ? 'Đang xử lý...' : 'Đăng Ký'}
                                </button>
                            </div>
                            <p className='text-sm text-blue-200'>
                                ✨ Bảo mật thông tin, hủy đăng ký bất cứ lúc nào
                            </p>
                        </form>
                    </div>

                    {/* Right Side - Image */}
                    <div className='relative flex-shrink-0'>
                        <div className='relative'>
                            <img
                                src={assets.newbox}
                                alt="Newsletter"
                                className='w-40 h-40 lg:w-56 lg:h-56 object-cover rounded-xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300'
                            />
                            {/* Small Badge */}
                            <div className='absolute -top-3 -right-3 bg-white rounded-full p-3 shadow-lg'>
                                <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center'>
                                    <span className='text-white font-bold text-sm'>20%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewsletterBox
