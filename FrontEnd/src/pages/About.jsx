import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const About = () => {
    const navigate = useNavigate()

    const handleMenuClick = () => {
        window.scrollTo(0, 0) // Reset scroll position
        navigate('/Menu')
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative">
                <img
                    src={assets.about_img}
                    alt="MaoMao Coffee Shop"
                    className="w-full h-[400px] object-cover"
                />
            </div>

            <div className="max-w-5xl mx-auto px-4 py-16">
                {/* Story Section */}
                <div className="mb-20">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Câu chuyện của chúng tôi</h2>
                    <div className="space-y-6 text-gray-600">
                        <p>
                            Ra đời vào năm 2018 tại Đà Lạt, MaoMao Coffee bắt đầu từ niềm đam mê với những hạt cà phê Việt Nam thơm ngon. Người sáng lập, chị Minh Anh, từng là một barista yêu thích việc mang đến những ly cà phê kể câu chuyện về vùng đất cao nguyên.
                        </p>
                        <p>
                            Chúng tôi tin rằng mỗi ly cà phê không chỉ là thức uống, mà còn là một trải nghiệm, kết nối con người với thiên nhiên và văn hóa Việt Nam.
                        </p>
                    </div>
                </div>

                {/* Mission and Values */}
                <div className="mb-20">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Sứ mệnh & Giá trị của chúng tôi</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6 border border-gray-200 rounded-lg">
                            <h3 className="text-xl font-medium text-gray-800 mb-4">Chất lượng</h3>
                            <p className="text-gray-600">Chọn lọc những hạt cà phê ngon nhất từ Đà Lạt, Buôn Ma Thuột và các nông trại bền vững.</p>
                        </div>
                        <div className="text-center p-6 border border-gray-200 rounded-lg">
                            <h3 className="text-xl font-medium text-gray-800 mb-4">Sáng tạo</h3>
                            <p className="text-gray-600">Kết hợp truyền thống và hiện đại để tạo ra các loại đồ uống độc đáo, từ cà phê phin đến trà trái cây.</p>
                        </div>
                        <div className="text-center p-6 border border-gray-200 rounded-lg">
                            <h3 className="text-xl font-medium text-gray-800 mb-4">Bền vững</h3>
                            <p className="text-gray-600">Hỗ trợ nông dân địa phương và sử dụng bao bì thân thiện với môi trường.</p>
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <div className="mb-20">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Thành tựu của chúng tôi</h2>
                    <div className="max-w-2xl mx-auto">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                <p className="text-gray-600">Phục vụ hơn 10.000 khách hàng trên toàn quốc từ năm 2020.</p>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                <p className="text-gray-600">Hợp tác với 5 nông trại cà phê bền vững tại Việt Nam.</p>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                <p className="text-gray-600">Được vinh danh trong top 10 thương hiệu cà phê trực tuyến yêu thích năm 2024.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thưởng thức hương vị cà phê đích thực</h2>
                    <p className="text-gray-600 mb-8">Khám phá ngay những sản phẩm tuyệt vời từ MaoMao Coffee!</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleMenuClick}
                            className="inline-block bg-gray-800 text-white px-8 py-3 rounded-full hover:bg-gray-700 transition-colors"
                        >
                            Xem thực đơn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
