import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { ShopContext } from '../contexts/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
    const [currency, setCurrency] = useState('Đăng Nhập')

    // BackEnd
    const { token, setToken, navigate, backendURL } = useContext(ShopContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            if (currency === 'Đăng Ký') {
                const res = await axios.post(
                    backendURL + `/api/user/register`,
                    { name, email, password }
                )
                console.log(res.data)
                if (res.data.success) {
                    setToken(res.data.success)
                    localStorage.setItem('token', res.data.token)
                } else {
                    toast.error(res.data.message)
                }

            } else if (currency === "Đăng Nhập") {
                const res = await axios.post(backendURL + `/api/user/login`, { email, password })
                console.log(res.data)
                if (res.data.success) {
                    setToken(res.data.token)
                    localStorage.setItem('token', res.data.token)
                } else {
                    toast.error(res.data.message)
                }
            }
        } catch (e) {
            console.log(e)
            toast.error(e.message)
        }
    }

    useEffect(() => {
        if (token && localStorage.getItem('token')) {
            navigate('/')
        }
    }, [token])


    return (
        <div className='min-h-[80vh] flex items-center justify-center'>
            <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
                <div className='text-center mb-8'>
                    <img src={assets.LOGO2} alt="Logo" className='w-32 mx-auto mb-4' />
                    <h2 className='prata-regular text-blue-950 text-3xl mb-2'>{currency}</h2>
                    <p className='text-gray-500 text-sm'>Chào mừng bạn đến với Mao Mao Coffee</p>
                </div>

                <form onSubmit={onSubmitHandler} className='space-y-4'>
                    {currency === 'Đăng Ký' && (
                        <div className='transform transition-all duration-300 ease-in-out'>
                            <input
                                required
                                type='text'
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/20 outline-none transition-all duration-300'
                                placeholder='Username'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}

                    <input
                        required
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/20 outline-none transition-all duration-300'
                        placeholder='Email'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        required
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/20 outline-none transition-all duration-300'
                        placeholder='Mật khẩu'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className='flex justify-between text-sm mt-2'>
                        <button type="button" className='text-blue-950 hover:text-[#00509d] transition-colors duration-300'>
                            Quên Mật Khẩu?
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrency(currency === 'Đăng Nhập' ? 'Đăng Ký' : 'Đăng Nhập')}
                            className='text-blue-950 hover:text-[#00509d] transition-colors duration-300'
                        >
                            {currency === 'Đăng Nhập' ? 'Tạo Tài Khoản' : 'Đăng Nhập Tại Đây'}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className='w-full bg-blue-950 text-white py-3 rounded-lg hover:bg-[#00509d] transition-colors duration-300 font-medium mt-6'
                    >
                        {currency === 'Đăng Nhập' ? 'Đăng Nhập' : 'Đăng Ký'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login