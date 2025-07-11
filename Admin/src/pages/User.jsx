import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backEndURL } from '../App'

const User = () => {
    const [users, setUsers] = useState([])
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

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

    return (
        <div className="p-4 bg-gray-50 max-h-screen">
            <h2 className="text-base font-bold mb-4 text-gray-800">Danh sách người dùng</h2>
            <div className="w-full max-w-6xl mx-auto bg-white overflow-hidden">
                <div className='hidden md:grid grid-cols-5 items-center py-3 px-6 text-[11px] font-semibold text-gray-700 border-b bg-gray-100 gap-8'>
                    <span>Avatar</span>
                    <span>Name</span>
                    <span>Email</span>
                    <span className='text-center'>Contact</span>
                    <span>Thao tác</span>
                </div>
                {users?.map((item, index) => (
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
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default User
