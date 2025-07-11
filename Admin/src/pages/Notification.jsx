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

    const markAllAsRead = async () => {
        try {
            await axios.patch(`${backEndURL}/api/notification/all/read`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchNotifications();
            fetchUnreadCount();
        } catch (err) {
            setError('Không thể đánh dấu tất cả đã đọc');
        }
    };

    const deleteAll = async () => {
        try {
            await axios.delete(`${backEndURL}/api/notification/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchNotifications();
            fetchUnreadCount();
        } catch (err) {
            setError('Không thể xóa tất cả thông báo');
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 md:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-2">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold tracking-tight">Thông báo hệ thống</h2>
                    <span className="inline-block mt-1 text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg ml-2">Chưa đọc: <b>{unreadCount}</b></span>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={fetchNotifications} className="px-2.5 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition text-[10px]">Làm mới</button>
                    <button onClick={markAllAsRead} className="px-2.5 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition text-[10px]">Đánh dấu tất cả đã đọc</button>
                    <button onClick={deleteAll} className="px-2.5 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition text-[10px]">Xóa tất cả</button>
                </div>
            </div>
            {loading && <p className="text-[10px]">Đang tải...</p>}
            {error && <p className="text-red-500 mb-2 text-[10px]">{error}</p>}
            <ul className="flex flex-col gap-2">
                {notifications.length === 0 && !loading && <li className="text-center text-gray-400 text-[10px]">Không có thông báo nào.</li>}
                {notifications.map(n => (
                    <li key={n._id} className={`flex flex-col md:flex-row md:items-center gap-4 p-3 rounded-xl border ${typeColor[n.type] || typeColor.default} transition-all text-[11px]`}>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wide ${n.isRead ? 'bg-gray-200 text-gray-500' : 'bg-yellow-400 text-white'}`}>{n.isRead ? 'Đã đọc' : 'Chưa đọc'}</span>
                                <span className="break-words text-gray-700 text-[10px]">
                                    {(() => {
                                        const match = n.message.match(/^([A-ZÀ-Ỹ][^\s]*\s(?:[A-ZÀ-Ỹ][^\s]*\s?)+)(.*)$/u);
                                        if (match) {
                                            return <><b className="font-semibold text-[10px]">{match[1].trim()}</b>{match[2]}</>;
                                        } else {
                                            return n.message;
                                        }
                                    })()}
                                </span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1 pl-1">{new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="flex gap-2 md:flex-col md:gap-2 ml-2">
                            {!n.isRead && (
                                <button onClick={() => markAsRead(n._id)} className="px-2 py-0.5 bg-green-400 text-white rounded-lg hover:bg-green-600 text-[10px] font-semibold transition">Đã đọc</button>
                            )}
                            <button onClick={() => deleteNotification(n._id)} className="px-2 py-0.5 bg-red-400 text-white rounded-lg hover:bg-red-600 text-[10px] font-semibold transition">Xóa</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notification;
