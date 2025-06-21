import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ onLogout }) => {
    return (
        <div className='h-screen-auto bg-white border-r border-gray-100 shadow-sm flex flex-col justify-between w-16 md:w-64 transition-all duration-300'>
            {/* Top section: Logo & Navigation */}
            <div>
                {/* Logo section */}
                <div className='py-6 px-4 flex justify-center items-center border-b border-gray-100'>
                    <img src={assets.logo} alt="MAOMAO Logo" className='w-10 md:w-28 transition-all duration-300' />
                </div>

                {/* Navigation section */}
                <div className='flex flex-col gap-1.5 p-3'>
                    <p className='text-xs font-medium text-gray-400 px-3 py-2 hidden md:block'>MENU CHÍNH</p>

                    <NavLink
                        to={"/"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                        }
                    >
                        <img className='w-5 h-5 mx-auto md:mx-0 opacity-80' src={assets.dashboard_icon} alt="" />
                        <p className='text-sm font-medium hidden md:block'>Bảng điều khiển</p>
                    </NavLink>

                    <NavLink
                        to={"/add"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                        }
                    >
                        <img className='w-5 h-5 mx-auto md:mx-0 opacity-80' src={assets.add_icon} alt="" />
                        <p className='text-sm font-medium hidden md:block'>Thêm sản phẩm</p>
                    </NavLink>

                    <NavLink
                        to={"/list"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                        }
                    >
                        <img className='w-5 h-5 mx-auto md:mx-0 opacity-80' src={assets.list_icon} alt="" />
                        <p className='text-sm font-medium hidden md:block'>Sản phẩm</p>
                    </NavLink>

                    <p className='text-xs font-medium text-gray-400 px-3 py-2 mt-4 hidden md:block'>QUẢN LÝ</p>

                    <NavLink
                        to={"/orders"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                        }
                    >
                        <img className='w-5 h-5 mx-auto md:mx-0 opacity-80' src={assets.order_icon} alt="" />
                        <p className='text-sm font-medium hidden md:block'>Đơn hàng</p>
                    </NavLink>

                    <NavLink
                        to={"/users"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                        }
                    >
                        <img className='w-5 h-5 mx-auto md:mx-0 opacity-80' src={assets.user_icon} alt="" />
                        <p className='text-sm font-medium hidden md:block'>Người dùng</p>
                    </NavLink>

                    <NavLink
                        to={"/branch"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                        }
                    >
                        <img className='w-5 h-5 mx-auto md:mx-0 opacity-80' src={assets.list_icon} alt="" />
                        <p className='text-sm font-medium hidden md:block'>Chi Nhánh</p>
                    </NavLink>
                </div>
            </div>

            {/* Bottom section: Logout */}
            <div className='p-3 border-t border-gray-100'>
                <button
                    onClick={onLogout}
                    className='w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                >
                    <div className='w-5 h-5 flex items-center justify-center mx-auto md:mx-0'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <span className='text-sm font-medium hidden md:block'>Đăng xuất</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar
