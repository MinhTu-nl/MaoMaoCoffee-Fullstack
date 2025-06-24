import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import { useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
    const [visible, setVisible] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isOpening, setIsOpening] = useState(false)
    const location = useLocation()

    useEffect(() => {
        if (location.pathname.includes('Menu')) {
            setVisible(true)
        } else {
            setVisible(false)
        }
    }, [location])

    // Effect để xử lý animation khi mở search bar
    useEffect(() => {
        if (showSearch && visible) {
            setIsOpening(true)
            setTimeout(() => {
                setIsOpening(false)
            }, 300)
        }
    }, [showSearch, visible])

    // Xử lý animation khi đóng search bar
    const handleClose = () => {
        setIsAnimating(true)
        setTimeout(() => {
            setShowSearch(false)
            setIsAnimating(false)
        }, 300)
    }

    // Xử lý animation khi xóa nội dung
    const handleClear = () => {
        const input = document.querySelector('.search-input')
        if (input) {
            input.classList.add('shake')
            setTimeout(() => {
                input.classList.remove('shake')
                setSearch('')
            }, 500)
        }
    }

    return showSearch && visible ? (
        <div className={`border-t border-b bg-gradient-to-r from-gray-50 to-gray-100 py-3 shadow-sm transition-all duration-300 
            ${isAnimating ? 'opacity-0 -translate-y-2' : ''} 
            ${isOpening ? 'animate-slideDown' : ''}`}
        >
            <div className='max-w-4xl mx-auto px-4'>
                <div className='relative flex items-center justify-center'>
                    {/* Search Input Container */}
                    <div className='relative w-full max-w-2xl'>
                        <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                            <img src={assets.search_icon} className='w-4 h-4 text-gray-400' alt="search" />
                        </div>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className='search-input w-full pl-10 pr-12 py-2.5 rounded-full border border-gray-300 focus:border-blue-950 focus:ring-2 focus:ring-blue-950 focus:ring-opacity-20 outline-none transition-all duration-200 bg-white text-sm'
                            placeholder='Tìm kiếm sản phẩm...'
                        />
                        {/* Clear Button */}
                        {search && (
                            <button
                                onClick={handleClear}
                                className='absolute inset-y-0 right-0 pr-3 flex items-center group'
                            >
                                <img
                                    src={assets.cross_icon}
                                    className='w-3 h-3 text-gray-400 group-hover:scale-110 transition-transform duration-200'
                                    alt="clear"
                                />
                            </button>
                        )}
                    </div>
                    {/* Close Search Bar Button */}
                    <button
                        onClick={handleClose}
                        className='ml-3 p-2 rounded-full hover:bg-gray-200 transition-all duration-200 hover:rotate-90'
                    >
                        <img src={assets.cross_icon} className='w-4 h-4' alt="close" />
                    </button>
                </div>
            </div>

            {/* Thêm style cho animation */}
            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes slideDown {
                    0% { 
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    100% { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    ) : null
}

export default SearchBar
