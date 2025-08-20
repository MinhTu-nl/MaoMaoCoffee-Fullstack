import React, { useState, useEffect, useContext } from 'react';
// import { useShopContext } from '../contexts/ShopContext';
import { assets } from '../assets/assets';
import { ShopContext } from '../contexts/ShopContext';
import axios from 'axios';

const NotificationBell = () => {
    // State: chứa thông báo, số chưa đọc, trạng thái dropdown, loading và detect mobile
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    // Lấy token và backendURL từ context để gọi API bảo mật
    const { token, backendURL } = useContext(ShopContext);

    // Khi có token (user đăng nhập), fetch notifications
    useEffect(() => {
        if (token) {
            fetchNotifications();
        }
    }, [token]);

    // Detect mobile viewport to adjust dropdown behavior
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 640px)');
        const handleChange = (e) => setIsMobile(e.matches);
        setIsMobile(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Gọi API lấy notifications của user (bảo mật bằng Bearer token)
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendURL}/api/notification/user`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                // Lưu danh sách và tính số thông báo chưa đọc
                setNotifications(response.data.notifications);
                const unread = response.data.notifications.filter(n => !n.isRead).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API đánh dấu 1 notification là đã đọc và cập nhật state local nếu thành công
    const markAsRead = async (notificationId) => {
        try {
            const response = await axios.patch(`${backendURL}/api/notification/user/${notificationId}/read`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            if (response.data.success) {
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

    // Lock background scroll when the dropdown is open on mobile
    // Khóa scroll nền khi dropdown mở trên mobile để tránh cuộn xung đột
    useEffect(() => {
        if (isMobile && showDropdown) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isMobile, showDropdown]);

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
        <div className="relative items-center ">
            {/* Notification Bell */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-3 sm:p-2 text-gray-600 hover:text-orange-500 transition-colors"
                aria-label="Mở thông báo"
            >
                <img src={assets.notification_icon} alt="notification" className="w-6 h-6" />

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div
                    className={`${isMobile ? 'fixed inset-0 z-50 flex items-start justify-center bg-black/20' : 'absolute right-0 mt-2 z-50'}`}
                    onClick={() => { if (isMobile) setShowDropdown(false); }}
                >
                    <div
                        className={`${isMobile ? 'mt-16 w-[92vw] max-w-sm bg-white rounded-lg shadow-lg border border-gray-200' : 'w-80 bg-white rounded-lg shadow-lg border border-gray-200'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Thông báo</h3>
                            {unreadCount > 0 && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {unreadCount} thông báo chưa đọc
                                </p>
                            )}
                        </div>

                        <div className={`${isMobile ? 'max-h-[70vh]' : 'max-h-96'} overflow-y-auto`}>
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
                                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-orange-50' : ''}`}
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
                                    className={`w-full text-center ${isMobile ? 'text-base' : 'text-sm'} text-orange-600 hover:text-orange-700 font-medium`}
                                >
                                    Đóng
                                </button>
                            </div>
                        )}
                    </div>
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
