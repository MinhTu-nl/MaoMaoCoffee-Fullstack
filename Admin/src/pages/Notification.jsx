import React, { useEffect, useState } from 'react';
import { backEndURL } from '../App';
import axios from 'axios';

const typeColor = {
    order: 'bg-blue-50 border-blue-200',
    review: 'bg-yellow-50 border-yellow-200',
    contact: 'bg-green-50 border-green-200',
    register: 'bg-purple-50 border-purple-200',
    default: 'bg-gray-50 border-gray-100'
};

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);

    const token = localStorage.getItem('token');

    const fetchNotifications = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${backEndURL}/api/notification`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Lỗi không xác định');
        }
        setLoading(false);
    };

    const fetchUnreadCount = async () => {
        try {
            const res = await axios.get(`${backEndURL}/api/notification/unread/count`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUnreadCount(res.data.unread);
            localStorage.setItem('admin_unread_notification', res.data.unread);
        } catch (err) {
            setUnreadCount(0);
            localStorage.setItem('admin_unread_notification', '0');
        }
    };

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.patch(`${backEndURL}/api/notification/${id}/read`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchNotifications();
            fetchUnreadCount();
        } catch (err) {
            setError('Không thể đánh dấu đã đọc');
        }
    };

    const deleteNotification = async (id) => {
        try {
            await axios.delete(`${backEndURL}/api/notification/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchNotifications();
            fetchUnreadCount();
        } catch (err) {
            setError('Không thể xóa thông báo');
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-800">Thông báo hệ thống</h2>
                    {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center h-6 px-2.5 rounded-full bg-red-500 text-white text-xs font-medium">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <button
                    onClick={fetchNotifications}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm transition flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Làm mới
                </button>
            </div>

            {/* Loading and Error */}
            {loading && (
                <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                    {error}
                </div>
            )}

            {/* Notification List */}
            {!loading && notifications.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Không có thông báo nào</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {notifications.map(n => (
                        <li
                            key={n._id}
                            className={`p-4 rounded-lg border ${typeColor[n.type] || typeColor.default} shadow-sm`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                                {/* Notification Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${n.isRead ? 'bg-gray-200 text-gray-600' : 'bg-yellow-400 text-white'
                                            }`}>
                                            {n.isRead ? 'Đã đọc' : 'Mới'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(n.createdAt).toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-800">
                                        {(() => {
                                            const match = n.message.match(/^([A-ZÀ-Ỹ][^\s]*\s(?:[A-ZÀ-Ỹ][^\s]*\s?)+)(.*)$/u);
                                            if (match) {
                                                return <><span className="font-semibold">{match[1].trim()}</span>{match[2]}</>;
                                            } else {
                                                return n.message;
                                            }
                                        })()}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 sm:flex-col sm:gap-2">
                                    {!n.isRead && (
                                        <button
                                            onClick={() => markAsRead(n._id)}
                                            className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs font-medium transition flex items-center gap-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Đã đọc
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(n._id)}
                                        className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs font-medium transition flex items-center gap-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notification;
