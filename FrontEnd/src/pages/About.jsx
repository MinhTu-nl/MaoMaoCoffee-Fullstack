import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import BranchList from '../components/BranchList'

const About = () => {
    const navigate = useNavigate()

    const handleMenuClick = () => {
        window.scrollTo(0, 0)
        navigate('/Menu')
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[400px] flex items-center justify-center">
                <img
                    src={assets.about_img}
                    alt="MaoMao Coffee Shop"
                    className="w-full h-full object-cover absolute inset-0 z-0"
                />
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <div className="relative z-20 flex flex-col items-center text-center text-white">
                    <img src={assets.LOGO} alt="Logo" className="w-24 mb-4 drop-shadow-lg" />
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow">MaoMao Coffee</h1>
                    <p className="text-lg md:text-2xl font-medium drop-shadow">Khơi nguồn cảm hứng từ từng hạt cà phê</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-16">
                {/* Story Section */}
                <div className="mb-20 grid md:grid-cols-2 gap-10 items-center">
                    <div className="order-2 md:order-1 space-y-6 text-gray-700">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Câu chuyện của chúng tôi</h2>
                        <p>
                            Ra đời vào năm 2018 tại Đà Lạt, MaoMao Coffee bắt đầu từ niềm đam mê với những hạt cà phê Việt Nam thơm ngon. Người sáng lập, chị Minh Anh, từng là một barista yêu thích việc mang đến những ly cà phê kể câu chuyện về vùng đất cao nguyên.
                        </p>
                        <p>
                            Chúng tôi tin rằng mỗi ly cà phê không chỉ là thức uống, mà còn là một trải nghiệm, kết nối con người với thiên nhiên và văn hóa Việt Nam.
                        </p>
                    </div>
                    <div className="order-1 md:order-2 flex justify-center">
                        <img src={assets.LOGO2} alt="Founder" className="w-60 h-60 object-contain rounded-full shadow-lg border-4 border-white bg-white" />
                    </div>
                </div>

                {/* Mission and Values */}
                <div className="mb-20">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Sứ mệnh & Giá trị của chúng tôi</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8 border border-gray-200 rounded-2xl shadow hover:shadow-lg transition group bg-white">
                            <div className="flex justify-center mb-4">
                                <span className="inline-block bg-yellow-100 p-3 rounded-full group-hover:bg-yellow-200 transition">
                                    <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636" /></svg>
                                </span>
                            </div>
                            <h3 className="text-xl font-medium text-gray-800 mb-2">Chất lượng</h3>
                            <p className="text-gray-600">Chọn lọc những hạt cà phê ngon nhất từ Đà Lạt, Buôn Ma Thuột và các nông trại bền vững.</p>
                        </div>
                        <div className="text-center p-8 border border-gray-200 rounded-2xl shadow hover:shadow-lg transition group bg-white">
                            <div className="flex justify-center mb-4">
                                <span className="inline-block bg-pink-100 p-3 rounded-full group-hover:bg-pink-200 transition">
                                    <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 1.343-3 3 0 2.25 3 5 3 5s3-2.75 3-5c0-1.657-1.343-3-3-3z" /><circle cx="12" cy="11" r="3" /></svg>
                                </span>
                            </div>
                            <h3 className="text-xl font-medium text-gray-800 mb-2">Sáng tạo</h3>
                            <p className="text-gray-600">Kết hợp truyền thống và hiện đại để tạo ra các loại đồ uống độc đáo, từ cà phê phin đến trà trái cây.</p>
                        </div>
                        <div className="text-center p-8 border border-gray-200 rounded-2xl shadow hover:shadow-lg transition group bg-white">
                            <div className="flex justify-center mb-4">
                                <span className="inline-block bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                                </span>
                            </div>
                            <h3 className="text-xl font-medium text-gray-800 mb-2">Bền vững</h3>
                            <p className="text-gray-600">Hỗ trợ nông dân địa phương và sử dụng bao bì thân thiện với môi trường.</p>
                        </div>
                    </div>
                </div>

                {/* Branches Section */}
                <div className="mb-20">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Hệ thống chi nhánh</h2>
                    <div className="bg-white rounded-2xl shadow p-6">
                        <BranchList />
                    </div>
                </div>



                {/* Call to Action */}
                <div className="text-center py-16 rounded-2xl bg-gradient-to-r from-yellow-100 via-pink-100 to-green-100 shadow">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Thưởng thức hương vị cà phê đích thực</h2>
                    <p className="text-gray-600 mb-8 text-lg">Khám phá ngay những sản phẩm tuyệt vời từ MaoMao Coffee!</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleMenuClick}
                            className="inline-block bg-gray-800 text-white px-10 py-4 rounded-full hover:bg-gray-700 transition-colors text-lg font-semibold shadow-lg"
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
