import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../contexts/ShopContext'
import NotificationBell from './NotificationBell'
import axios from 'axios'

const Navbar = () => {
    const [visible, setVisible] = useState(false)
    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, backendURL } = useContext(ShopContext)
    const [feedbackCount, setFeedbackCount] = useState(0)
    const [orderCount, setOrderCount] = useState(0)

    useEffect(() => {
        if (!token) {
            setFeedbackCount(0)
            setOrderCount(0)
            return
        }
        // Fetch feedback count
        axios.get(`${backendURL}/api/contact/user-contacts`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            if (res.data.success && Array.isArray(res.data.contacts)) {
                setFeedbackCount(res.data.contacts.length)
            } else {
                setFeedbackCount(0)
            }
        }).catch(() => setFeedbackCount(0))
        // Fetch order count
        axios.get(`${backendURL}/api/order/user`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => {
            if (res.data.success && res.data.data && Array.isArray(res.data.data.orders)) {
                setOrderCount(res.data.data.orders.length)
            } else {
                setOrderCount(0)
            }
        }).catch(() => setOrderCount(0))
    }, [token, backendURL])

    const logout = () => {
        navigate('/Login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
        setVisible(false)
    }

    const handleSearchClick = () => {
        setShowSearch(true)
        navigate('/Menu')
    }

    return (
        <>
            <nav className='sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm'>
                <div className='max-w-7xl mx-auto px-2 md:px-6 lg:px-8 py-3 sm:py-4'>
                    <div className='flex items-center justify-between gap-4 sm:gap-8'>
                        {/* Logo */}
                        <Link to='/' className='flex-shrink-0 transition-transform hover:scale-105'>
                            <img src={assets.LOGO2} className='w-16 sm:w-20' alt="Logo" />
                        </Link>

                        {/* Desktop Navigation */}
                        <ul className='hidden sm:flex items-center gap-8 text-center font-medium'>
                            <NavLink
                                to='/'
                                className={({ isActive }) =>
                                    `group flex flex-col items-center transition-colors hover:text-blue-950 ${isActive ? 'text-blue-600' : 'text-blue-950'}`
                                }
                            >
                                <p className='relative'>
                                    Trang Chủ
                                    <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-950 transition-all duration-300 group-hover:w-full'></span>
                                </p>
                            </NavLink>
                            <NavLink
                                to='/About'
                                className={({ isActive }) =>
                                    `group flex flex-col items-center transition-colors hover:text-blue-950 ${isActive ? 'text-blue-600' : 'text-blue-950'}`
                                }
                            >
                                <p className='relative'>
                                    Về Chúng Tôi
                                    <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-950 transition-all duration-300 group-hover:w-full'></span>
                                </p>
                            </NavLink>
                            <NavLink
                                to='/Menu'
                                className={({ isActive }) =>
                                    `group flex flex-col items-center transition-colors hover:text-blue-950 ${isActive ? 'text-blue-600' : 'text-blue-950'}`
                                }
                            >
                                <p className='relative'>
                                    Thực Đơn
                                    <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-950 transition-all duration-300 group-hover:w-full'></span>
                                </p>
                            </NavLink>
                            <NavLink
                                to='/Contact'
                                className={({ isActive }) =>
                                    `group flex flex-col items-center transition-colors hover:text-blue-950 ${isActive ? 'text-blue-600' : 'text-blue-950'}`
                                }
                            >
                                <p className='relative'>
                                    Liên Hệ
                                    <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-950 transition-all duration-300 group-hover:w-full'></span>
                                </p>
                            </NavLink>
                        </ul>

                        {/* Right Icons */}
                        <div className='flex items-center gap-3 sm:gap-6'>
                            <button
                                onClick={handleSearchClick}
                                className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                            >
                                <img
                                    src={assets.search_icon}
                                    alt="search"
                                    className='w-5 h-5'
                                />
                            </button>

                            {/* Account/Profile Section */}
                            <div className='hidden sm:block group relative'>
                                {token ? (
                                    // Logged in user
                                    <>
                                        <button className='relative p-2 hover:bg-gray-100 rounded-full transition-colors'>
                                            <img src={assets.profile_icon} className='w-5 h-5' alt="profile" />
                                            {(feedbackCount > 0 || orderCount > 0) && (
                                                <span className='absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full translate-x-1/3 -translate-y-1/3'></span>
                                            )}
                                        </button>
                                        <div className='invisible group-hover:visible absolute dropdown-menu right-0 pt-2 opacity-0 group-hover:opacity-100 transition-all duration-200'>
                                            <div className='w-48 py-2 bg-white rounded-xl shadow-lg border border-gray-100'>
                                                <div className='px-2 pb-2 border-b border-gray-100'>
                                                    <NotificationBell />
                                                </div>
                                                <button
                                                    onClick={() => navigate('/Profile')}
                                                    className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-blue-950 transition-colors'
                                                >
                                                    Hồ Sơ
                                                </button>
                                                <button
                                                    onClick={() => navigate('/Order')}
                                                    className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-blue-950 transition-colors flex items-center gap-2'
                                                >
                                                    Đặt Hàng
                                                    {orderCount > 0 && <span className="ml-1 w-2 h-2 bg-red-400 rounded-full inline-block"></span>}
                                                </button>
                                                <button
                                                    onClick={() => navigate('/Feedback')}
                                                    className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-blue-950 transition-colors flex items-center gap-2'
                                                >
                                                    Phản Hồi
                                                    {feedbackCount > 0 && <span className="ml-1 w-2 h-2 bg-red-400 rounded-full inline-block"></span>}
                                                </button>
                                                <button
                                                    onClick={logout}
                                                    className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-blue-950 transition-colors'
                                                >
                                                    Đăng Xuất
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    // Not logged in - show clear login button
                                    <button
                                        onClick={() => navigate('/Login')}
                                        className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-950 hover:bg-blue-50 rounded-lg transition-colors'
                                    >
                                        <img src={assets.profile_icon} className='w-5 h-5' alt="profile" />
                                    </button>
                                )}
                            </div>

                            <Link to="/Cart" className='relative p-2 hover:bg-gray-100 rounded-full transition-colors'>
                                <img src={assets.cart_icon} className='w-5 h-5' alt="cart" />
                                {getCartCount() > 0 && (
                                    <span className='absolute top-0 right-0 w-5 h-5 flex items-center justify-center bg-blue-950 text-white text-xs font-medium rounded-full transform translate-x-1/2 -translate-y-1/2'>
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>

                            <button
                                onClick={() => setVisible(true)}
                                className='p-2 hover:bg-gray-100 rounded-full transition-colors sm:hidden ml-1'
                            >
                                <img src={assets.menu_icon} alt="menu" className='w-6 h-6' />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {visible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setVisible(false)}>
                    {/* Mobile Menu Content */}
                    <div
                        className="fixed top-0 right-0 h-full w-72 max-w-full bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className='flex flex-col h-full'>
                            <div className='flex-1 overflow-y-auto'>
                                <div className='py-2'>
                                    <NavLink
                                        onClick={() => setVisible(false)}
                                        className={({ isActive }) =>
                                            `block px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 hover:text-blue-950 transition-colors ${isActive ? 'text-blue-950 bg-blue-50' : ''}`
                                        }
                                        to="/"
                                    >
                                        Trang Chủ
                                    </NavLink>
                                    <NavLink
                                        onClick={() => setVisible(false)}
                                        className={({ isActive }) =>
                                            `block px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 hover:text-blue-950 transition-colors ${isActive ? 'text-blue-950 bg-blue-50' : ''}`
                                        }
                                        to="/About"
                                    >
                                        Về Chúng Tôi
                                    </NavLink>
                                    <NavLink
                                        onClick={() => setVisible(false)}
                                        className={({ isActive }) =>
                                            `block px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 hover:text-blue-950 transition-colors ${isActive ? 'text-blue-950 bg-blue-50' : ''}`
                                        }
                                        to="/Menu"
                                    >
                                        Thực Đơn
                                    </NavLink>
                                    <NavLink
                                        onClick={() => setVisible(false)}
                                        className={({ isActive }) =>
                                            `block px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 hover:text-blue-950 transition-colors ${isActive ? 'text-blue-950 bg-blue-50' : ''}`
                                        }
                                        to="/Contact"
                                    >
                                        Liên Hệ
                                    </NavLink>

                                    {/* Account Section in Mobile Menu */}
                                    {token ? (
                                        // Logged in user
                                        <>
                                            <div className='px-6 pb-2'>
                                                <NotificationBell />
                                            </div>
                                            <NavLink
                                                onClick={() => setVisible(false)}
                                                className={({ isActive }) =>
                                                    `block px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 hover:text-blue-950 transition-colors flex items-center gap-2 ${isActive ? 'text-blue-950 bg-blue-50' : ''}`
                                                }
                                                to="/Profile"
                                            >
                                                Hồ Sơ
                                            </NavLink>
                                            <NavLink
                                                onClick={() => setVisible(false)}
                                                className={({ isActive }) =>
                                                    `block px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 hover:text-blue-950 transition-colors flex items-center gap-2 ${isActive ? 'text-blue-950 bg-blue-50' : ''}`
                                                }
                                                to="/Order"
                                            >
                                                Đặt Hàng
                                                {orderCount > 0 && <span className="ml-1 w-2 h-2 bg-red-400 rounded-full inline-block"></span>}
                                            </NavLink>
                                            <NavLink
                                                onClick={() => setVisible(false)}
                                                className={({ isActive }) =>
                                                    `block px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 hover:text-blue-950 transition-colors flex items-center gap-2 ${isActive ? 'text-blue-950 bg-blue-50' : ''}`
                                                }
                                                to="/Feedback"
                                            >
                                                Phản Hồi
                                                {feedbackCount > 0 && <span className="ml-1 w-2 h-2 bg-red-400 rounded-full inline-block"></span>}
                                            </NavLink>
                                            <button
                                                onClick={() => { logout(); setVisible(false); }}
                                                className='block w-full text-left px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 hover:text-blue-950 transition-colors'
                                            >
                                                Đăng Xuất
                                            </button>
                                        </>
                                    ) : (
                                        // Not logged in - show clear login option
                                        <NavLink
                                            onClick={() => setVisible(false)}
                                            className={({ isActive }) =>
                                                `block px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 hover:text-blue-950 transition-colors flex items-center gap-2 ${isActive ? 'text-blue-950 bg-blue-50' : ''}`
                                            }
                                            to="/Login"
                                        >
                                            <img src={assets.profile_icon} className='w-5 h-5' alt="profile" />
                                            Đăng nhập / Tài khoản
                                        </NavLink>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default Navbar
