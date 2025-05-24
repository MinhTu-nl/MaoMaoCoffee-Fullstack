import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Login = () => {
    const [currency, setCurrency] = useState('Đăng Ký')
    const onSumitHandler = async (event) => {
        event.preventDefault()
    }

    return (
        <div className='min-h-[80vh] flex items-center justify-center'>
            <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
                <div className='text-center mb-8'>
                    <img src={assets.LOGO2} alt="Logo" className='w-32 mx-auto mb-4' />
                    <h2 className='prata-regular text-[#0d1321] text-3xl mb-2'>{currency}</h2>
                    <p className='text-gray-500 text-sm'>Chào mừng bạn đến với Mao Mao Coffee</p>
                </div>

                <form onSubmit={onSumitHandler} className='space-y-4'>
                    {currency === 'Đăng Ký' && (
                        <div className='transform transition-all duration-300 ease-in-out'>
                            <input
                                required
                                type='text'
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0d1321] focus:ring-2 focus:ring-[#0d1321]/20 outline-none transition-all duration-300'
                                placeholder='Username'
                            />
                        </div>
                    )}

                    <input
                        required
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0d1321] focus:ring-2 focus:ring-[#0d1321]/20 outline-none transition-all duration-300'
                        placeholder='Email'
                        type="email"
                    />

                    <input
                        required
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0d1321] focus:ring-2 focus:ring-[#0d1321]/20 outline-none transition-all duration-300'
                        placeholder='Mật khẩu'
                        type="password"
                    />

                    <div className='flex justify-between text-sm mt-2'>
                        <button type="button" className='text-[#0d1321] hover:text-[#00509d] transition-colors duration-300'>
                            Quên Mật Khẩu?
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrency(currency === 'Đăng Nhập' ? 'Đăng Ký' : 'Đăng Nhập')}
                            className='text-[#0d1321] hover:text-[#00509d] transition-colors duration-300'
                        >
                            {currency === 'Đăng Nhập' ? 'Tạo Tài Khoản' : 'Đăng Nhập Tại Đây'}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className='w-full bg-[#0d1321] text-white py-3 rounded-lg hover:bg-[#00509d] transition-colors duration-300 font-medium mt-6'
                    >
                        {currency === 'Đăng Nhập' ? 'Đăng Nhập' : 'Đăng Ký'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login