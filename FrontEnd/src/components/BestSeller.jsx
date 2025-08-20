import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import ProductItem from './ProductItem'
import Title from './Title'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const BestSeller = () => {
    // Lấy danh sách products từ context và lọc ra các sản phẩm bestseller
    const { products } = useContext(ShopContext)
    const [bestseller, setBestSeller] = useState([])

    // Khi products thay đổi, lọc các item có flag bestseller và lấy tối đa 8 phần tử
    useEffect(() => {
        const bestProduct = products.filter((item) => (item.bestseller));
        setBestSeller(bestProduct.slice(0, 8))
    }, [products])

    return (
        <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white via-blue-50/30 to-white overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.05),transparent_50%)]" />

            {/* Floating Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-br from-purple-100/40 to-pink-100/40 rounded-full blur-xl opacity-60 animate-pulse delay-1000" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                    <Title
                        text1={'SẢN PHẨM BÁN CHẠY'}
                        text2={'Khám phá những món đồ uống được yêu thích nhất của chúng tôi. Được chọn lọc từ hàng ngàn đánh giá của khách hàng, những sản phẩm này đã chinh phục được trái tim của những người yêu thích hương vị độc đáo và chất lượng tuyệt hảo.'}
                    />
                </div>

                {/* Products Carousel */}
                <div className="relative">
                    {/* Navigation Arrows */}
                    <div className="hidden lg:block">
                        <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 group">
                            <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 group">
                            <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <Swiper
                        modules={[Navigation, Autoplay, Pagination]}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnHover: true,
                        }}
                        spaceBetween={16}
                        slidesPerView={1}
                        breakpoints={{
                            320: {
                                slidesPerView: 1.2,
                                spaceBetween: 12,
                                centeredSlides: true,
                            },
                            480: {
                                slidesPerView: 1.5,
                                spaceBetween: 16,
                                centeredSlides: true,
                            },
                            640: {
                                slidesPerView: 2.2,
                                spaceBetween: 20,
                                centeredSlides: true,
                            },
                            768: {
                                slidesPerView: 2.8,
                                spaceBetween: 24,
                                centeredSlides: false,
                            },
                            1024: {
                                slidesPerView: 3.2,
                                spaceBetween: 28,
                                centeredSlides: false,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 32,
                                centeredSlides: false,
                            },
                            1536: {
                                slidesPerView: 4.5,
                                spaceBetween: 36,
                                centeredSlides: false,
                            }
                        }}
                        className="!pb-16 !pt-4"
                        loop={true}
                        speed={800}
                        grabCursor={true}
                    >
                        {bestseller.map((item, index) => (
                            <SwiperSlide key={index} className="px-1 sm:px-1.5">
                                <div className="group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                                    <ProductItem
                                        id={item._id}
                                        images={item.images}
                                        name={item.name}
                                        price={item.price}
                                        category={item.category}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </div>
            </div>
        </section>
    )
}

export default BestSeller
