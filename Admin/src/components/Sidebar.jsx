import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ onLogout }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [newOrderCount, setNewOrderCount] = useState(0);
    const [productCount, setProductCount] = useState(0);

    useEffect(() => {
        // Hàm fetch số lượng thông báo chưa đọc
        const fetchUnreadCount = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notification/unread/count`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setUnreadCount(data.unread || 0);
            } catch {
                setUnreadCount(0);
            }
        };
        // Hàm fetch số lượng đơn hàng mới
        const fetchNewOrderCount = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/all?status=Order%20Placed`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setNewOrderCount(data.data?.orders?.length || 0);
            } catch {
                setNewOrderCount(0);
            }
        };
        // Hàm fetch số lượng sản phẩm
        const fetchProductCount = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/list?limit=1`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setProductCount(data.pagination?.total || data.data?.length || 0);
            } catch {
                setProductCount(0);
            }
        };
        fetchUnreadCount();
        fetchNewOrderCount();
        fetchProductCount();
        const interval = setInterval(() => {
            fetchUnreadCount();
            fetchNewOrderCount();
            fetchProductCount();
        }, 5000); // 5 giây
        return () => clearInterval(interval);
    }, []);

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
                    <p className='text-[10px] font-medium text-gray-400 px-3 py-2 hidden md:block'>MENU CHÍNH</p>

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
                        <p className='text-xs font-medium hidden md:block'>Bảng điều khiển</p>
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
                        <p className='text-xs font-medium hidden md:block'>Thêm sản phẩm</p>
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
                        <div className="relative">
                            <img className='w-5 h-5 mx-auto md:mx-0 opacity-80' src={assets.list_icon} alt="" />
                            {productCount > 0 && (
                                <span className="absolute -top-2 -right-2 min-w-[18px] h-5 px-1 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white font-bold">{productCount}</span>
                            )}
                        </div>
                        <p className='text-xs font-medium hidden md:block'>Sản phẩm</p>
                    </NavLink>

                    <p className='text-[10px] font-medium text-gray-400 px-3 py-2 mt-4 hidden md:block'>QUẢN LÝ</p>

                    <NavLink
                        to={"/orders"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                        }
                    >
                        <div className="relative">
                            <img className='w-5 h-5 mx-auto md:mx-0 opacity-80' src={assets.order_icon} alt="" />
                            {newOrderCount > 0 && (
                                <span className="absolute -top-2 -right-2 min-w-[18px] h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white font-bold">{newOrderCount}</span>
                            )}
                        </div>
                        <p className='text-xs font-medium hidden md:block'>Đơn hàng</p>
                    </NavLink>

                    <NavLink
                        to={"/notification"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                        }
                    >
                        <div className="relative">
                            <img className='w-5 h-5 mx-auto md:mx-0 opacity-80' src={assets.notification_icon} alt="" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-2 -right-2 min-w-[18px] h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white font-bold">{unreadCount}</span>
                            )}
                        </div>
                        <p className='text-xs font-medium hidden md:block'>Thông báo</p>
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
                        <p className='text-xs font-medium hidden md:block'>Người dùng</p>
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
                        <p className='text-xs font-medium hidden md:block'>Chi Nhánh</p>
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
                    <span className='text-xs font-medium hidden md:block'>Đăng xuất</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar
