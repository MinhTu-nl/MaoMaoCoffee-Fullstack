import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './components/Login'
import { Route, Routes, Navigate } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Order from './pages/Order'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import User from './pages/User'
import Dashboard from './components/Dashboard'

export const backEndURL = import.meta.env.VITE_BACKEND_URL
export const currency = 'VNĐ'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {
        token === ''
          ? <Login setToken={setToken} />
          : <>
            <Navbar setToken={setToken} />
            <hr />
            <div className='flex w-full'>
              <Sidebar />
              <div className='w-[75%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base'>
                <Routes>
                  <Route path='/' element={<Dashboard />} />
                  <Route path='/add' element={<Add token={token} />} />
                  <Route path='/list' element={<List token={token} />} />
                  <Route path='/orders' element={<Order token={token} />} />
                  <Route path='/users' element={<User token={token} />} />
                </Routes>
              </div>
            </div>
          </>
      }
    </div>
  )
}

export default App
