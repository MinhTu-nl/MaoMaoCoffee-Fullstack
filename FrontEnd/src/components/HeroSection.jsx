import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { ShopContext } from '../contexts/ShopContext'

// Redesigned HeroSection: two-column layout, blue primary theme, updated copy and CTAs
const HeroSection = () => {
    const { navigate } = useContext(ShopContext)
    return (
        <section className="w-full bg-gradient-to-br from-blue-50 via-white to-blue-200 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col-reverse md:flex-row items-center gap-12">
                    {/* Left: Text content */}
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        <h2 className="text-base sm:text-sm font-medium text-blue-950 mb-4">MaoMao Coffee</h2>
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                            Hương vị đích thực,
                            <br />
                            Cà phê chuẩn vị Việt
                        </h1>
                        <p className="text-gray-600 text-base sm:text-md max-w-2xl mb-6">
                            Rang xay mỗi ngày từ những hạt chọn lọc, phục vụ tại quán và giao tận nhà. Thưởng thức ngay ly cà phê tươi ngon, đậm vị và an toàn.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center sm:justify-start">
                            <button
                                onClick={() => navigate('/Menu')}
                                className="inline-block w-full sm:w-auto px-6 py-3 bg-blue-950 text-white rounded-lg shadow hover:bg-blue-800 transition font-semibold text-base text-center"
                                aria-label="Xem menu"
                            >
                                Đặt hàng ngay
                            </button>
                            <button
                                onClick={() => navigate('/About')}
                                className="inline-block w-full sm:w-auto px-5 py-3 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition font-medium text-base text-center"
                                aria-label="Tìm hiểu thêm"
                            >
                                Tìm hiểu
                            </button>
                        </div>

                        {/* Features row */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left">
                                <img src={assets.quality_icon} alt="Hạt chọn lọc" className="w-8 h-8 mx-auto sm:mx-0" />
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-800">Hạt chọn lọc</h4>
                                    <p className="text-xs text-gray-500">Rang xay tại chỗ</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left">
                                <img src={assets.support_img} alt="Giao nhanh" className="w-8 h-8 mx-auto sm:mx-0" />
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-800">Giao nhanh</h4>
                                    <p className="text-xs text-gray-500">Trong khu vực</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left">
                                <img src={assets.user_icon} alt="Hài lòng" className="w-8 h-8 mx-auto sm:mx-0" />
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-800">Hài lòng</h4>
                                    <p className="text-xs text-gray-500">100% khách hàng</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Image with decorative badges */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
                        <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                            <div className="hidden md:block absolute -left-8 -top-8 w-44 h-44 rounded-full bg-blue-200 opacity-40 filter blur-3xl" />
                            <div className="hidden md:block absolute -right-12 -bottom-12 w-36 h-36 rounded-full bg-blue-300 opacity-30" />

                            <img
                                src={assets.banner_icon}
                                alt="MaoMao coffee banner"
                                className="w-full rounded-2xl shadow-2xl relative z-10 object-cover max-h-[420px] sm:max-h-[520px] lg:max-h-[620px]"
                            />

                            {/* Small floating badge */}
                            <div className="hidden sm:flex flex-col items-center gap-1 absolute left-4 top-4 bg-white rounded-xl px-3 py-2 shadow-md z-20">
                                <span className="text-xs text-gray-500">5k+</span>
                                <span className="text-sm font-semibold text-slate-800">Đơn hàng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
