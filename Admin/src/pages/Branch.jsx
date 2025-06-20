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
        <div className='p-6'>
            {/* Form thêm chi nhánh mới */}
            <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
                <h2 className='text-xl font-semibold mb-4'>Thêm Chi Nhánh Mới</h2>
                <form onSubmit={handleAddBranch} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Tên Chi Nhánh</label>
                        <input
                            type="text"
                            value={newBranch.name}
                            onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Vị Trí</label>
                        <input
                            type="text"
                            value={newBranch.location}
                            onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                    >
                        Thêm Chi Nhánh
                    </button>
                </form>
            </div>

            {/* Danh sách chi nhánh */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
                <h2 className='text-xl font-semibold mb-4'>Danh Sách Chi Nhánh</h2>
                <p className='text-sm text-gray-500 mb-4'>Số lượng: {branches.length}</p>

                <div className='flex flex-col gap-2'>
                    {/* Header */}
                    <div className='hidden md:grid grid-cols-[2fr_3fr_2fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
                        <b>Tên Chi Nhánh</b>
                        <b>Vị Trí</b>
                        <b className='text-center'>Thao Tác</b>
                    </div>

                    {/* Data */}
                    {branches.map((branch, index) => (
                        <div key={index} className='grid grid-cols-[2fr_3fr_2fr] items-center gap-2 py-1 px-2 border text-sm'>
                            {editingBranch?._id === branch._id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editingBranch.name}
                                        onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                    />
                                    <input
                                        type="text"
                                        value={editingBranch.location}
                                        onChange={(e) => setEditingBranch({ ...editingBranch, location: e.target.value })}
                                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                    />
                                    <div className='flex flex-row gap-2 justify-end md:justify-center'>
                                        <button
                                            onClick={() => handleEdit(branch._id)}
                                            className='bg-green-400 hover:bg-green-600 text-white px-5 py-2 rounded text-xs'
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className='bg-gray-400 hover:bg-gray-600 text-white px-5 py-2 rounded text-xs'
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>{branch.name}</p>
                                    <p>{branch.location}</p>
                                    <div className='flex flex-row gap-2 justify-end md:justify-center'>
                                        <button
                                            onClick={() => startEditing(branch)}
                                            className='bg-green-400 hover:bg-green-600 text-white px-5 py-2 rounded text-xs'
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(branch._id)}
                                            className='bg-red-400 hover:bg-red-600 text-white px-5 py-2 rounded text-xs'
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Branch
