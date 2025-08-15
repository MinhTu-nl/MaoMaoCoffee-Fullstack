import React from 'react';
import { assets } from '../assets/assets';

const HeroSection = () => {
    return (
        <section className="w-full bg-gray-50 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6">
                {/* Left: Text */}
                <div className="flex-1 flex flex-col items-start text-center md:text-left mb-8 md:mb-0">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-950 mb-3 sm:mb-4 leading-tight">
                        MaoMao Coffee <br className="hidden sm:block" />
                        Cà phê ngon <br className="hidden sm:block" />
                        Đậm vị, <span className="text-[#00509d]">tươi mới</span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-lg mx-auto md:mx-0">
                        Thưởng thức cà phê rang xay nguyên chất, hương vị độc đáo chỉ có tại MaoMao. Đặt hàng ngay để trải nghiệm sự khác biệt!
                    </p>
                    {/* <a
                        href="/menu"
                        className="px-8 py-3 bg-black text-white rounded-lg shadow hover:bg-[#00509d] transition font-semibold text-lg"
                    >
                        MORE
                    </a> */}
                </div>
                {/* Right: Banner Icon */}
                <div className="flex-1 flex justify-center items-center mt-6 md:mt-0">
                    <img
                        src={assets.banner_icon}
                        alt="Coffee Banner"
                        className="w-full max-w-[600px] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] drop-shadow-2xl"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
