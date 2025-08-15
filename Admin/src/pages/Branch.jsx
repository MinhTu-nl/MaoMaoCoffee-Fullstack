import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backEndURL } from '../App'
import { toast } from 'react-toastify'

const Branch = ({ token }) => {
    const [branches, setBranches] = useState([])
    const [newBranch, setNewBranch] = useState({
        name: '',
        location: ''
    })
    const [editingBranch, setEditingBranch] = useState(null)

    const fetchBranches = async () => {
        try {
            const res = await axios.get(backEndURL + '/api/branch/list')
            if (res.data) {
                setBranches(res.data)
            }
        } catch (e) {
            console.log(e)
            toast.error('Có lỗi xảy ra khi lấy danh sách chi nhánh')
        }
    }

    const handleAddBranch = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(backEndURL + '/api/branch/create', newBranch)
            if (res.data) {
                toast.success('Thêm chi nhánh thành công')
                setNewBranch({ name: '', location: '' })
                fetchBranches()
            }
        } catch (e) {
            console.log(e)
            toast.error(e.response?.data?.message || 'Có lỗi xảy ra khi thêm chi nhánh')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa chi nhánh này?')) {
            return
        }

        try {
            const res = await axios.delete(backEndURL + `/api/branch/delete/${id}`)
            if (res.data) {
                toast.success('Xóa chi nhánh thành công')
                fetchBranches()
            }
        } catch (e) {
            console.log(e)
            toast.error('Có lỗi xảy ra khi xóa chi nhánh')
        }
    }

    const handleEdit = async (id) => {
        try {
            const res = await axios.put(backEndURL + `/api/branch/update/${id}`, editingBranch)
            if (res.data) {
                toast.success('Cập nhật chi nhánh thành công')
                setEditingBranch(null)
                fetchBranches()
            }
        } catch (e) {
            console.log(e)
            toast.error('Có lỗi xảy ra khi cập nhật chi nhánh')
        }
    }

    const startEditing = (branch) => {
        setEditingBranch({ ...branch })
    }

    const cancelEditing = () => {
        setEditingBranch(null)
    }

    useEffect(() => {
        fetchBranches()
    }, [])

    return (
        <div className='p-4 sm:p-6'>
            {/* Form thêm chi nhánh mới */}
            <div className='bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6'>
                <h2 className='text-lg sm:text-xl font-semibold mb-3 sm:mb-4'>Thêm Chi Nhánh Mới</h2>
                <form onSubmit={handleAddBranch} className='space-y-3 sm:space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Tên Chi Nhánh</label>
                        <input
                            type="text"
                            value={newBranch.name}
                            onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm'
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Vị Trí</label>
                        <input
                            type="text"
                            value={newBranch.location}
                            onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm'
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className='bg-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-blue-600 text-sm sm:text-base'
                    >
                        Thêm Chi Nhánh
                    </button>
                </form>
            </div>

            {/* Danh sách chi nhánh */}
            <div className='bg-white p-4 sm:p-6 rounded-lg shadow-md'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4'>
                    <h2 className='text-lg sm:text-xl font-semibold'>Danh Sách Chi Nhánh</h2>
                    <p className='text-xs sm:text-sm text-gray-500'>Số lượng: {branches.length}</p>
                </div>

                <div className='flex flex-col gap-2'>
                    {/* Header - chỉ hiển thị trên desktop */}
                    <div className='hidden md:grid grid-cols-[2fr_3fr_2fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
                        <b>Tên Chi Nhánh</b>
                        <b>Vị Trí</b>
                        <b className='text-center'>Thao Tác</b>
                    </div>

                    {/* Data */}
                    {branches.length === 0 ? (
                        <div className='text-center py-4 text-gray-500'>Không có chi nhánh nào</div>
                    ) : (
                        branches.map((branch, index) => (
                            <div key={index} className='border rounded-lg p-3 sm:p-2'>
                                {editingBranch?._id === branch._id ? (
                                    <div className='space-y-3 sm:space-y-0 sm:grid sm:grid-cols-[2fr_3fr_2fr] items-center gap-3'>
                                        <div>
                                            <label className='block text-xs text-gray-500 sm:hidden'>Tên Chi Nhánh</label>
                                            <input
                                                type="text"
                                                value={editingBranch.name}
                                                onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                                                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-xs text-gray-500 sm:hidden'>Vị Trí</label>
                                            <input
                                                type="text"
                                                value={editingBranch.location}
                                                onChange={(e) => setEditingBranch({ ...editingBranch, location: e.target.value })}
                                                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm'
                                            />
                                        </div>
                                        <div className='flex gap-2 justify-end sm:justify-center pt-2 sm:pt-0'>
                                            <button
                                                onClick={() => handleEdit(branch._id)}
                                                className='bg-green-400 hover:bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs'
                                            >
                                                Lưu
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className='bg-gray-400 hover:bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs'
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='space-y-3 sm:space-y-0 sm:grid sm:grid-cols-[2fr_3fr_2fr] items-center gap-3'>
                                        <div>
                                            <p className='font-medium sm:font-normal text-sm'>{branch.name}</p>
                                        </div>
                                        <div>
                                            <p className='text-gray-600 text-sm'>{branch.location}</p>
                                        </div>
                                        <div className='flex gap-2 justify-end sm:justify-center pt-2 sm:pt-0'>
                                            <button
                                                onClick={() => startEditing(branch)}
                                                className='bg-green-400 hover:bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs'
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(branch._id)}
                                                className='bg-red-400 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs'
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Branch
