import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    return (
        <div className='h-screen-auto bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between w-16 md:w-60 transition-all duration-300'>
            {/* Top: Admin title and navigation */}
            <div>
                <div className='py-8 flex justify-center items-center border-b border-gray-200'>
                    <h2 className='text-lg md:text-2xl font-bold text-gray-800 tracking-wide hidden md:block'>Admin</h2>
                    <span className='md:hidden font-bold text-gray-800 text-xl'>A</span>
                </div>
                <div className='flex flex-col gap-2 p-2 md:p-4'>
                    <NavLink
                        to={"/"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-2 md:px-4 py-3 rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                        }
                    >
                        <img className='w-6 h-6 mx-auto md:mx-0' src={assets.dashboard_icon} alt="" />
                        <p className='font-medium hidden md:block'>Dashboard</p>
                    </NavLink>

                    <NavLink
                        to={"/add"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-2 md:px-4 py-3 rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                        }
                    >
                        <img className='w-6 h-6 mx-auto md:mx-0' src={assets.add_icon} alt="" />
                        <p className='font-medium hidden md:block'>Add Items</p>
                    </NavLink>

                    <NavLink
                        to={"/list"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-2 md:px-4 py-3 rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                        }
                    >
                        <img className='w-6 h-6 mx-auto md:mx-0' src={assets.list_icon} alt="" />
                        <p className='font-medium hidden md:block'>List Items</p>
                    </NavLink>

                    <NavLink
                        to={"/orders"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-2 md:px-4 py-3 rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                        }
                    >
                        <img className='w-6 h-6 mx-auto md:mx-0' src={assets.order_icon} alt="" />
                        <p className='font-medium hidden md:block'>Orders</p>
                    </NavLink>

                    <NavLink
                        to={"/users"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-2 md:px-4 py-3 rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                        }
                    >
                        <img className='w-6 h-6 mx-auto md:mx-0' src={assets.user_icon} alt="" />
                        <p className='font-medium hidden md:block'>User</p>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
