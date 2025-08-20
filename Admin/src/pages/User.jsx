import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backEndURL } from '../App'
import { toast } from 'react-toastify'

const User = () => {
    // danh sách user
    const [users, setUsers] = useState([])
    // index của dropdown chi tiết đang mở
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    // phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 12;
    const [searchTerm, setSearchTerm] = useState('');
    // State lưu phản hồi cho từng contact (key: contactId)
    const [replyMessages, setReplyMessages] = useState({});
    // trạng thái gửi riêng cho từng contact
    const [sendingReply, setSendingReply] = useState({});
    // Xử lý thay đổi input phản hồi (controlled input cho từng contact)
    const handleReplyChange = (contactId, value) => {
        setReplyMessages(prev => ({ ...prev, [contactId]: value }));
    };

    // Gửi phản hồi admin cho contact: PUT /api/contact/feedback/:userId/:contactId
    const handleSendReply = async (contactId, userId) => {
        const reply = replyMessages[contactId]?.trim();
        if (!reply) return;
        setSendingReply(prev => ({ ...prev, [contactId]: true }));
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${backEndURL}/api/contact/feedback/${userId}/${contactId}`,
                { feedback: reply },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Gửi phản hồi thành công!');
            setReplyMessages(prev => ({ ...prev, [contactId]: '' }));
            // Update local UI: gán feedback vào contact tương ứng
            setUsers(prevUsers => prevUsers.map(u => {
                if (u._id !== userId) return u;
                return {
                    ...u,
                    contactData: u.contactData.map(c =>
                        c._id === contactId ? { ...c, feedback: reply } : c
                    )
                };
            }));
        } catch (e) {
            toast.error('Gửi phản hồi thất bại!');
        }
        setSendingReply(prev => ({ ...prev, [contactId]: false }));
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(backEndURL + `/api/user/list`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(res.data?.users || [])
            } catch (e) {
                setUsers([])
            }
        }
        fetchUsers()
    }, [])

    const handleToggleDropdown = (index) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };

    // Lọc theo tên
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Phân trang
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Danh sách người dùng</h2>

                {/* Search bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên..."
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="border px-3 py-2 rounded w-full sm:max-w-xs text-sm"
                    />
                </div>

                {/* User list */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {/* Table header - hidden on mobile */}
                    <div className='hidden sm:grid grid-cols-12 items-center py-3 px-4 text-xs font-semibold text-gray-700 border-b bg-gray-100'>
                        <div className="col-span-1"></div>
                        <div className="col-span-3">Tên người dùng</div>
                        <div className="col-span-4">Email</div>
                        <div className="col-span-2 text-center">Liên hệ</div>
                        <div className="col-span-2">Thao tác</div>
                    </div>

                    {currentUsers.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">Không tìm thấy người dùng nào</div>
                    ) : (
                        currentUsers.map((item, index) => (
                            <div key={index} className="border-b border-gray-100 last:border-b-0">
                                {/* User row */}
                                <div className='grid grid-cols-12 items-center gap-2 py-3 px-4 text-sm relative hover:bg-gray-50'>
                                    <div className="col-span-2 sm:col-span-1">
                                        <img className='w-8 h-8 rounded-full object-cover' src={assets.user_icon} alt="User" />
                                    </div>
                                    <div className="col-span-4 sm:col-span-3 truncate font-medium text-gray-800">
                                        {item?.name || 'N/A'}
                                    </div>
                                    <div className="col-span-6 sm:col-span-4 truncate text-gray-600 text-xs sm:text-sm">
                                        {item?.email || 'N/A'}
                                    </div>
                                    <div className="hidden sm:col-span-2 sm:flex justify-center text-gray-700 font-medium">
                                        {Array.isArray(item?.contactData) ? item.contactData.length : 0}
                                    </div>
                                    <div className="col-span-12 sm:col-span-2 flex justify-end sm:justify-start mt-2 sm:mt-0">
                                        <button
                                            className='text-blue-600 text-xs border border-blue-200 rounded px-3 py-1 hover:bg-blue-600 hover:text-white transition'
                                            onClick={() => handleToggleDropdown(index)}
                                        >
                                            {openDropdownIndex === index ? 'Đóng' : 'Chi tiết'}
                                        </button>
                                    </div>
                                </div>

                                {/* Dropdown content */}
                                {openDropdownIndex === index && (
                                    <div className="px-4 py-3 bg-gray-50">
                                        <div className="flex sm:hidden items-center justify-between mb-2">
                                            <span className="text-xs font-medium">Số liên hệ:</span>
                                            <span className="text-gray-700 font-medium">
                                                {Array.isArray(item?.contactData) ? item.contactData.length : 0}
                                            </span>
                                        </div>

                                        {(!item.contactData || item.contactData.length === 0) ? (
                                            <p className="text-gray-500 italic text-xs">Không có liên hệ nào.</p>
                                        ) : (
                                            <div className='space-y-3'>
                                                {item.contactData.map((contact, idx) => (
                                                    <div key={contact._id || idx} className='text-xs text-gray-600 border-b border-gray-200 pb-3 last:border-b-0'>
                                                        <div className="grid grid-cols-2 gap-2 mb-1">
                                                            <div><b>Họ tên:</b> {contact.name}</div>
                                                            <div><b>Email:</b> {contact.email}</div>
                                                        </div>
                                                        <div className="mb-1"><b>Tin nhắn:</b> {contact.message}</div>
                                                        <div className="mb-2 text-xs text-gray-500">
                                                            <b>Ngày gửi:</b> {contact.date ? new Date(contact.date).toLocaleString() : ''}
                                                        </div>

                                                        {/* Admin feedback */}
                                                        {contact.feedback && (
                                                            <div className="bg-blue-50 p-2 rounded mb-2">
                                                                <div className="text-blue-600 text-xs">
                                                                    <b>Phản hồi của Admin:</b> {contact.feedback}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Reply form */}
                                                        <div className="mt-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Nhập phản hồi..."
                                                                className="border px-3 py-2 rounded text-xs w-full mb-2"
                                                                value={replyMessages[contact._id] || ''}
                                                                onChange={e => handleReplyChange(contact._id, e.target.value)}
                                                                disabled={sendingReply[contact._id]}
                                                            />
                                                            <button
                                                                className="bg-blue-500 text-white text-xs px-4 py-1.5 rounded hover:bg-blue-600 transition w-full sm:w-auto disabled:opacity-60"
                                                                onClick={() => handleSendReply(contact._id, item._id)}
                                                                disabled={sendingReply[contact._id] || !(replyMessages[contact._id]?.trim())}
                                                            >
                                                                {sendingReply[contact._id] ? 'Đang gửi...' : 'Gửi phản hồi'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4 gap-1 sm:gap-2 flex-wrap">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 text-xs sm:text-sm"
                        >
                            Trước
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1 rounded text-xs sm:text-sm ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 text-xs sm:text-sm"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default User
