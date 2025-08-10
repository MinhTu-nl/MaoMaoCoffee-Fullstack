import React from 'react'
import { assets } from '../assets/assets'

const contactInfo = [
    {
        icon: (
            <svg className="w-4 h-4 mr-2 inline-block text-blue-950" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 0 0-3-3.87" /><path d="M9 20H4v-2a4 4 0 0 1 3-3.87" /><circle cx="12" cy="7" r="4" /></svg>
        ),
        text: '123 Đường ABC, Quận XYZ, Cần Thơ, Việt Nam',
    },
    {
        icon: (
            <svg className="w-4 h-4 mr-2 inline-block text-blue-950" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0 1 22 16.92z" /></svg>
        ),
        text: '+84 123 456 789',
    },
    {
        icon: (
            <svg className="w-4 h-4 mr-2 inline-block text-blue-950" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" /><path d="M22 4L12 14.01 2 4" /></svg>
        ),
        text: 'support@maomaocoffee.com',
    },
];

const links = [
    { name: 'Trang chủ', to: '/' },
    { name: 'Về chúng tôi', to: '/About' },
    { name: 'Menu', to: '/Menu' },
    { name: 'Liên hệ', to: '/Contact' },
];

const Footer = () => {
    return (
        <footer className="mt-20 bg-white/90 backdrop-blur-md shadow-[0_-2px_16px_0_rgba(0,0,0,0.04)]">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-6 items-start">
                    {/* Logo & Description */}
                    <div>
                        <img src={assets.LOGO2} alt="MaoMao Coffee" className="w-24 mb-4" />
                        <p className="text-gray-500 text-sm">
                            MaoMao Coffee - Nơi mang đến cho bạn những trải nghiệm cà phê tuyệt vời nhất.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-blue-950 font-semibold mb-4 tracking-wide">LIÊN KẾT</h3>
                        <ul className="space-y-2">
                            {links.map(link => (
                                <li key={link.name}>
                                    <a href={link.to} className="text-gray-600 hover:text-blue-950 transition-colors text-sm font-medium">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-blue-950 font-semibold mb-4 tracking-wide">LIÊN HỆ</h3>
                        <ul className="space-y-2">
                            {contactInfo.map((item, idx) => (
                                <li key={idx} className="text-gray-600 text-sm flex items-center">
                                    {item.icon}
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Copyright */}
                <div className="py-4 text-center">
                    <p className="text-gray-400 text-xs">
                        ©2025 MaoMao Coffee. Author Nguyen Le Minh Tu
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
