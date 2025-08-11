import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { ShopContext } from '../contexts/ShopContext';
import axios from 'axios';

const Contact = () => {
    // State cho form
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const { backendURL } = useContext(ShopContext)

    // Xử lý thay đổi input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                backendURL + '/api/contact/add',
                form,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = res.data;
            if (data.success) {
                setAlert({ type: 'success', message: 'Gửi liên hệ thành công!' });
                setForm({ name: '', email: '', message: '' });
            } else {
                setAlert({ type: 'error', message: data.message || 'Gửi liên hệ thất bại!' });
            }
        } catch (err) {
            setAlert({ type: 'error', message: err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.' });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-16">
                {/* Contact Form and Info Section */}
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Thông Tin Liên Hệ</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">Địa Chỉ</h3>
                                        <p className="text-gray-600">Cần Thơ, Việt Nam</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">Điện Thoại</h3>
                                        <p className="mt-1 text-gray-600">+84 123 456 789</p>
                                        <p className="text-gray-600">+84 987 654 321</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">Email</h3>
                                        <p className="mt-1 text-gray-600">info@maomaocoffee.com</p>
                                        <p className="text-gray-600">support@maomaocoffee.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">Giờ Làm Việc</h3>
                                        <p className="mt-1 text-gray-600">8:00 - 22:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Section */}
                        {/* <div className="bg-white rounded-xl shadow-md p-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Bản Đồ</h2>
                            <div className="aspect-w-16 aspect-h-9">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.841123456789!2d105.7727!3d10.0452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0883d1f9d2e5f%3A0x7c2e59d3b3bc3766!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBO4buZYyBD4bqnbiBUaMah!5e0!3m2!1svi!2s!4v1234567890"
                                    className="w-full h-full rounded-lg"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div> */}
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gửi Tin Nhắn Cho Chúng Tôi</h2>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {alert && (
                                <div className={`p-2 rounded text-center mb-2 ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {alert.message}
                                </div>
                            )}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                                    placeholder="Nhập họ và tên của bạn"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                                    placeholder="Nhập email của bạn"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tin nhắn
                                </label>
                                <textarea
                                    id="message"
                                    rows="1"
                                    value={form.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                                    placeholder="Nhập tin nhắn của bạn"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-60"
                                disabled={loading}
                            >
                                {loading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact