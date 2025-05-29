import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './components/Login'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Order from './pages/Order'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import User from './pages/User'

export const backEndURL = import.meta.env.VITE_BACKEND_URL
export const currency = 'VNĐ'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')

  useEffect(() => {
    localStorage.setItem('token', token)
  })

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
                  <Route path='/add' element={<Add setToken={token} />} />
                  <Route path='/list' element={<List setToken={token} />} />
                  <Route path='/orders' element={<Order setToken={token} />} />
                  <Route path='/users' element={<User setToken={token} />} />
                </Routes>
              </div>
            </div>

          </>
      }

    </div>
  )
}

export default App
