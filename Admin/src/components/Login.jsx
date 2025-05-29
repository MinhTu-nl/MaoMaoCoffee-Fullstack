import axios from 'axios'
import React, { useState } from 'react'
import { backEndURL } from '../App'
import { toast } from 'react-toastify'


const Login = ({ setToken }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const onSumithandler = async (e) => {
        try {
            e.preventDefault()
            setError('')
            const res = await axios.post(backEndURL + '/api/user/admin', { email, password })
            if (res.data.success) {
                setToken(res.data.token)
            } else {
                setError(res.data.message)
                toast.error(res.data.message)
            }
        } catch (e) {
            console.log(e)
            setError(e.message)
            toast.error(e.message)
        }
    }
    console.log(backEndURL)
    return (
        <div className="min-h-screen flex items-center justify-center w-full bg-white relative">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
            <div className="relative z-10 bg-white shadow-2xl rounded-2xl px-10 py-8 max-w-md w-full flex flex-col items-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Login</h2>
                <form onSubmit={onSumithandler} className="w-full flex flex-col gap-4">
                    {/* email */}
                    <input onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email" required
                        placeholder='abc@gmail.com'
                        className="rounded-full w-full px-4 py-3 border border-gray-300 outline-none focus:border-blue-400 transition text-gray-700 bg-white shadow-sm" />
                    {/* password */}
                    <input onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password" required
                        placeholder='Password'
                        className="rounded-full w-full px-4 py-3 border border-gray-300 outline-none focus:border-blue-400 transition text-gray-700 bg-white shadow-sm" />
                    <button type='submit' className="mt-2 w-full py-3 px-4 rounded-full text-white bg-gradient-to-r from-blue-500 to-blue-700 font-semibold text-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login
