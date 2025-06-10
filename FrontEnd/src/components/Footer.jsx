import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <footer className="mt-20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Logo & Description */}
                    <div>
                        <img src={assets.LOGO2} alt="MaoMao Coffee" className="w-24 mb-3" />
                        <p className="text-gray-600 text-sm">
                            MaoMao Coffee - Nơi mang đến cho bạn những trải nghiệm cà phê tuyệt vời nhất.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-[var(--blue-dark)] font-medium mb-3">LIÊN KẾT</h3>
                        <ul className="space-y-1">
                            <li><a href="#" className="text-gray-600 hover:text-[var(--blue-dark)] text-sm">Trang chủ</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-[var(--blue-dark)] text-sm">Về chúng tôi</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-[var(--blue-dark)] text-sm">Menu</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-[var(--blue-dark)] text-sm">Liên hệ</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-[var(--blue-dark)] font-medium mb-3">LIÊN HỆ</h3>
                        <ul className="space-y-1">
                            <li className="text-gray-600 text-sm">123 Đường ABC, Quận XYZ</li>
                            <li className="text-gray-600 text-sm">Cần Thơ, Việt Nam</li>
                            <li className="text-gray-600 text-sm">+84 123 456 789</li>
                            <li className="text-gray-600 text-sm">support@maomaocoffee.com</li>
                        </ul>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Copyright */}
                <div className="py-4 text-center">
                    <p className="text-gray-600 text-sm">
                        © 2024 MaoMao Coffee. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
