import React from 'react';

const MarqueeStrip = () => {
    return (
        <div className="bg-blue-950 py-2 w-screen relative -mx-[50vw] left-[50%] right-[50%] overflow-hidden">
            {/* Hai dòng marquee lặp để tạo hiệu ứng chạy liên tục (pure CSS animation) */}
            <div className="inline-flex whitespace-nowrap animate-marquee">
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
            </div>
            <div className="inline-flex whitespace-nowrap animate-marquee2 absolute top-2 left-0">
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
                <span className="text-white font-bold text-xl mx-6 uppercase tracking-wider">Mao Mao Coffee</span>
            </div>
        </div>
    );
};

export default MarqueeStrip; 