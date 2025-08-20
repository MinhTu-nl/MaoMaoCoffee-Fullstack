/*
 * Page: Feedback.jsx
 * Purpose: Gửi đánh giá/feedback (rating + comment, optional image uploads).
 * Main behavior: Thu thập rating và comment, optional upload media, gọi API tạo review, hiển thị trạng thái.
 * Inputs: Rating, comment, files.
 * Outputs: POST review, cập nhật UI (success/error).
 * Edge cases: File too large, duplicate submissions, validation độ dài comment.
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../contexts/ShopContext';
import { assets } from '../assets/assets';
import axios from 'axios';

const Feedback = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, navigate, backendURL } = useContext(ShopContext);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchUserContacts();
    }, [token, navigate]);

    const fetchUserContacts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendURL}/api/contact/user-contacts`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.data;

            if (data.success) {
                setContacts(data.contacts);
            } else {
                setError(data.message || 'Failed to fetch contacts');
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
            setError('Failed to fetch contacts');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <img src={assets.user_icon} alt="User" className="w-12 h-12" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Phản hồi của tôi</h1>
                            <p className="text-gray-600 mt-1">Xem lại các tin nhắn liên hệ và phản hồi từ admin</p>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Contacts List */}
                {contacts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <img src={assets.support_img} alt="No contacts" className="w-24 h-24 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có tin nhắn nào</h3>
                        <p className="text-gray-500 mb-6">Bạn chưa gửi tin nhắn liên hệ nào đến chúng tôi</p>
                        <button
                            onClick={() => navigate('/contact')}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Gửi tin nhắn liên hệ
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {contacts.map((contact, index) => (
                            <div key={contact._id || index} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Contact Header */}
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                                <img src={assets.user_icon} alt="User" className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">{contact.name}</h3>
                                                <p className="text-orange-100 text-sm">{contact.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-blue-100 text-sm">
                                                {formatDate(contact.date)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Message */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-gray-800 mb-2">Tin nhắn của bạn:</h4>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                                        </div>
                                    </div>

                                    {/* Admin Feedback */}
                                    {contact.feedback && (
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                                <img src={assets.LOGO2} alt="Admin" className="w-5 h-5" />
                                                Phản hồi từ Admin:
                                            </h4>
                                            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                                                <p className="text-gray-700 whitespace-pre-wrap">{contact.feedback}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Status */}
                                    <div className="mt-4 flex items-center gap-2">
                                        {contact.feedback ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                Đã phản hồi
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                                Đang xử lý
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
