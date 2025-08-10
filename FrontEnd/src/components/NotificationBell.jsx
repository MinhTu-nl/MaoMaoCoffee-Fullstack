import React, { useState, useEffect, useContext } from 'react';
// import { useShopContext } from '../contexts/ShopContext';
import { assets } from '../assets/assets';
import { ShopContext } from '../contexts/ShopContext';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const { token, backendURL } = useContext(ShopContext);

    useEffect(() => {
        if (token) {
            fetchNotifications();
        }
    }, [token]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendURL}/api/notification/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setNotifications(data.notifications);
                const unread = data.notifications.filter(n => !n.isRead).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`${backendURL}/api/notification/user/${notificationId}/read`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                // Update local state
                setNotifications(prev =>
                    prev.map(n =>
                        n._id === notificationId ? { ...n, isRead: true } : n
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Vừa xong';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} giờ trước`;
        } else {
            return date.toLocaleDateString('vi-VN');
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'contact':
                return '💬';
            case 'order':
                return '📦';
            case 'review':
                return '⭐';
            default:
                return '🔔';
        }
    };

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v3.75l1.5 1.5H3l1.5-1.5V9.75a6 6 0 0 1 6-6z" />
                </svg>

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Thông báo</h3>
                        {unreadCount > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                                {unreadCount} thông báo chưa đọc
                            </p>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                                <p className="text-gray-500 mt-2">Đang tải...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center">
                                <img src={assets.LOGO2} alt="No notifications" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p className="text-gray-500">Không có thông báo nào</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-orange-50' : ''
                                            }`}
                                        onClick={() => markAsRead(notification._id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="text-2xl">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800 font-medium">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDate(notification.createdAt)}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                            >
                                Đóng
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Backdrop */}
            {showDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
};

export default NotificationBell;
