import React, { useState } from 'react'
import { toast } from 'react-toastify'

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
        <div className='text-center max-w-2xl mx-auto px-4 py-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-lg'>
            <h2 className='text-3xl font-bold text-gray-800 mb-4'>Đăng Ký Nhận Bản Tin</h2>
            <p className='text-gray-600 mb-8'>
                Cập nhật thông tin về sản phẩm mới nhất, ưu đãi đặc biệt và tin tức thú vị.
                Đăng ký ngay để nhận ưu đãi giảm giá 20% cho lần mua đầu tiên!
            </p>

            <form onSubmit={onSubmitHandler} className='w-full max-w-md mx-auto'>
                <div className='flex flex-col sm:flex-row gap-3'>
                    <input
                        className='flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none'
                        type="email"
                        required
                        placeholder='Nhập địa chỉ email của bạn'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-200
                            ${isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                            }`}
                    >
                        {isSubmitting ? 'Đang xử lý...' : 'Đăng Ký Ngay'}
                    </button>
                </div>
                <p className='text-sm text-gray-500 mt-3'>
                    Chúng tôi cam kết bảo vệ thông tin của bạn. Bạn có thể hủy đăng ký bất cứ lúc nào.
                </p>
            </form>
        </div>
    )
}

export default NewsletterBox
