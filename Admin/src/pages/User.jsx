import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backEndURL } from '../App'
import { toast } from 'react-toastify'

const User = () => {
    const [users, setUsers] = useState([])
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 12;
    const [searchTerm, setSearchTerm] = useState('');
    // State lưu phản hồi cho từng contact (key: contactId)
    const [replyMessages, setReplyMessages] = useState({});
    const [sendingReply, setSendingReply] = useState({});
    // Xử lý thay đổi input phản hồi
    const handleReplyChange = (contactId, value) => {
        setReplyMessages(prev => ({ ...prev, [contactId]: value }));
    };

    // Gửi phản hồi admin
    // Gửi phản hồi admin (đúng API)
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
            // Sau khi gửi, cập nhật lại feedback cho contact trên UI (nếu cần)
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
        <div className="p-4 bg-gray-50 max-h-screen">
            <h2 className="text-base font-bold mb-4 text-gray-800">Danh sách người dùng</h2>
            <input
                type="text"
                placeholder="Tìm kiếm theo tên người dùng..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="border px-3 py-2 rounded mb-4 w-full max-w-xs"
            />
            <div className="w-full max-w-6xl mx-auto bg-white overflow-hidden">
                <div className='hidden md:grid grid-cols-5 items-center py-3 px-6 text-[11px] font-semibold text-gray-700 border-b bg-gray-100 gap-8'>
                    <span></span>
                    <span>Tên người dùng</span>
                    <span>Email</span>
                    <span className='text-center'>Liên hệ</span>
                    <span>Thao tác</span>
                </div>
                {currentUsers?.map((item, index) => (
                    <div key={index}>
                        <div className='grid grid-cols-2 md:grid-cols-5 items-center gap-8 py-2 px-4 text-[11px] relative border-b border-gray-100 bg-white'>
                            <img className='w-7 h-7 rounded-full object-cover bg-white' src={assets.user_icon} alt="" />
                            <span className="truncate max-w-[120px] text-gray-800 font-medium text-[11px]">{item?.name || 'N/A'}</span>
                            <span className="truncate max-w-[180px] text-gray-700 text-[10px]">{item?.email || 'N/A'}</span>
                            <span className="text-gray-800 font-semibold text-[11px] text-center">{Array.isArray(item?.contactData) ? item.contactData.length : 0}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    className='text-blue-600 text-[10px] border border-blue-200 rounded px-2.5 py-1 hover:bg-blue-600 hover:text-white transition'
                                    onClick={() => handleToggleDropdown(index)}
                                >
                                    {openDropdownIndex === index ? 'Đóng' : 'Xem'}
                                </button>
                            </div>
                        </div>
                        {openDropdownIndex === index && (
                            <div className="px-8 py-3 border-b border-gray-100 bg-white">
                                {(!item.contactData || item.contactData.length === 0) ? (
                                    <p className="text-gray-500 italic text-[10px]">Không có liên hệ nào.</p>
                                ) : (
                                    <div className='space-y-2'>
                                        {item.contactData.map((contact, idx) => (
                                            <div key={contact._id || idx} className='text-[10px] text-gray-600 border-b border-dashed border-gray-200 pb-2 last:border-b-0'>
                                                <div><b>Họ tên:</b> {contact.name}</div>
                                                <div><b>Email:</b> {contact.email}</div>
                                                <div><b>Tin nhắn:</b> {contact.message}</div>
                                                <div><b>Ngày gửi:</b> {contact.date ? new Date(contact.date).toLocaleString() : ''}</div>
                                                {/* Input phản hồi admin */}
                                                {/* Hiển thị phản hồi đã gửi nếu có */}
                                                {contact.feedback && (
                                                    <div className="text-green-600 text-[10px] mt-1">
                                                        <b>Phản hồi của Admin:</b> {contact.feedback}
                                                    </div>
                                                )}
                                                <div className="mt-2 flex flex-col gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Nhập phản hồi..."
                                                        className="border px-2 py-1 rounded text-[10px] w-full max-w-xs"
                                                        value={replyMessages[contact._id] || ''}
                                                        onChange={e => handleReplyChange(contact._id, e.target.value)}
                                                        disabled={sendingReply[contact._id]}
                                                    />
                                                    <button
                                                        className="bg-blue-500 text-white text-[10px] px-3 py-1 rounded hover:bg-blue-600 transition w-fit disabled:opacity-60"
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
                ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default User
