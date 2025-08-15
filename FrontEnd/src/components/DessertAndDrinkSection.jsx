import React, { useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import Title from './Title';
import cf1 from '../assets/CF1.png'
import dx1 from "../assets/DX01.png"
import t01 from "../assets/T01.png"
import ts1 from "../assets/TS01.png"
import cr1 from "../assets/CRO1.png"
import toast1 from "../assets/TOA1.png"
import coldBrew from "../assets/CB01.png"
import { ShopContext } from '../contexts/ShopContext';

const DessertAndDrinkSection = () => {
    const { navigate } = useContext(ShopContext)

    const items = [
        { title: 'Cà', title2: 'Phê', image: cf1, category: 'coffee' },
        { title: 'Trà', title2: '', image: t01, category: 'tea' },
        { title: 'Đá', title2: 'Xay', image: dx1, category: 'ice' },
        { title: 'Trà', title2: 'Sữa', image: ts1, category: 'milk' },
        { title: 'Croffle', title2: '', image: cr1, category: 'croffle' },
        { title: 'Toast', title2: '', image: toast1, category: 'toast' },
        { title: 'Cold', title2: 'Brew', image: coldBrew, category: 'coldbew' },
    ];

    const handleItemClick = (category) => {
        if (category) {
            navigate(`/Menu?category=${category}`);
        } else {
            navigate('/Menu');
        }
    };

    const ItemBox = ({ item }) => (
        <div
            className="relative flex items-center w-full max-w-xs mx-auto h-32 sm:h-40 md:h-48 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg px-4 sm:px-6 overflow-visible transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-xl hover:from-gray-50 hover:to-white cursor-pointer group"
            onClick={() => handleItemClick(item.category)}
        >
            <div className="flex flex-col justify-center z-10 w-1/2">
                <div className="font-bold text-base text-blue-950 sm:text-xl md:text-2xl lg:text-3xl leading-6 sm:leading-7 text-left whitespace-pre-line text-gray-800 group-hover:text-gray-900">
                    {item.title}<br />{item.title2}
                </div>
                <span className="hidden sm:inline-block mt-2 text-sm text-gray-500 group-hover:text-gray-700">Khám phá ngay</span>
            </div>
            {item.image && (
                <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                    <img
                        src={item.image}
                        alt={item.title + ' ' + item.title2}
                        className="w-20 sm:w-24 md:w-28 lg:w-32 h-auto object-contain drop-shadow-lg z-20 select-none"
                    />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    );

    if (items.length >= 2) {
        return (
            <div className="py-12 md:py-16 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                <div className="max-w-7xl mx-auto my-6 md:my-10 px-4 md:px-6 lg:px-8 relative">
                    <div className="text-center mb-10 md:mb-12">
                        <Title
                            text1={"Khám phá thực đơn của chúng tôi"}
                            text2={
                                "Khám phá các lựa chọn đa dạng từ món tráng miệng ngọt ngào đến đồ uống giải khát, phù hợp cho mọi sở thích."
                            }
                        />
                    </div>
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        navigation
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        spaceBetween={24}
                        slidesPerView={2}
                        centeredSlides={true} // Thêm dòng này để căn giữa slide
                        breakpoints={{
                            520: {
                                slidesPerView: 2,
                                spaceBetween: 24,
                                centeredSlides: false // Tắt căn giữa trên màn hình lớn hơn
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 32,
                                centeredSlides: false
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 32,
                                centeredSlides: false
                            }
                        }}
                        className="!pb-12 !pt-4"
                    >
                        {items.map((item, idx) => (
                            <SwiperSlide key={idx} className="px-2">
                                <ItemBox item={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center py-12 md:py-16 bg-gradient-to-b from-white via-gray-50/50 to-white relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
            <div className="max-w-7xl mx-auto mb-6 w-full px-4 md:px-6 lg:px-8 relative">
                <div className="text-center mb-10 md:mb-12">
                    <Title text1="Khám phá thực đơn" text2="Chọn món yêu thích của bạn" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {items.map((item, idx) => (
                        <ItemBox key={idx} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DessertAndDrinkSection;