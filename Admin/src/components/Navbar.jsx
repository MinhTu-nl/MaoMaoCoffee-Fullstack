import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
    return (
        <div className=' bg-white flex items-center px-[4%] justify-between'>
            <img className='w-[7%]' src={assets.logo} alt="" />
            <button onClick={() => setToken('')} className='bg-black text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:test-sm'>Logout</button>
        </div>
    )
}

export default Navbar
