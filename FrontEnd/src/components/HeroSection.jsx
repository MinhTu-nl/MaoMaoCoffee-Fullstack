import React from 'react';
import { assets } from '../assets/assets';

const HeroSection = () => {
    return (
        <section className="w-full bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
                {/* Left: Text */}
                <div className="flex-1 flex flex-col items-start">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#0d1321] mb-4 leading-tight">
                        MaoMao Coffee <br />
                        Cà phê ngon <br />
                        Đậm vị, <span className="text-[#00509d]">tươi mới</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
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
                <div className="flex-1 flex justify-center mt-10 md:mt-0">
                    <img
                        src={assets.banner_icon}
                        alt="Coffee Banner"
                        className="w-[900px] max-w-full drop-shadow-2xl"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
