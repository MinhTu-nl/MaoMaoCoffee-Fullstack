import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import ProductItem from './ProductItem'
import Title from './Title'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const BestSeller = () => {
    const { products } = useContext(ShopContext)
    const [bestseller, setBestSeller] = useState([])

    useEffect(() => {
        const bestProduct = products.filter((item) => (item.bestseller));
        setBestSeller(bestProduct.slice(0, 10))
    }, [products])

    return (
        <div className='relative py-12 md:py-16 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden'>
            {/* Background Pattern */}
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]' />

            <div className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative'>
                <div className='text-center mb-10 md:mb-12'>
                    <Title
                        text1={'SẢN PHẨM BÁN CHẠY'}
                        text2={'Khám phá những món đồ uống được yêu thích nhất của chúng tôi. Được chọn lọc từ hàng ngàn đánh giá của khách hàng, những sản phẩm này đã chinh phục được trái tim của những người yêu thích hương vị độc đáo và chất lượng tuyệt hảo.'}
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
                    slidesPerView={1}
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                            spaceBetween: 16,
                            centeredSlides: true, // Thêm dòng này để căn giữa slide
                            slidesOffsetBefore: 0 // Đảm bảo không có khoảng cách lệch
                        },
                        520: { slidesPerView: 2, spaceBetween: 20 },
                        768: { slidesPerView: 3, spaceBetween: 24 },
                        1024: { slidesPerView: 4, spaceBetween: 24 },
                        1280: { slidesPerView: 5, spaceBetween: 24 }
                    }}
                    className='!pb-12 !pt-4'
                >
                    {bestseller.map((item, index) => (
                        <SwiperSlide key={index} className='px-2 flex justify-center'> {/* Thêm flex justify-center */}
                            <ProductItem
                                id={item._id}
                                images={item.images}
                                name={item.name}
                                price={item.price}
                                category={item.category}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default BestSeller
