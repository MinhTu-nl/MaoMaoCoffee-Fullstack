import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backEndURL } from '../App'
import { toast } from 'react-toastify'

const Branch = ({ token }) => {
    // danh sách chi nhánh lấy từ server
    const [branches, setBranches] = useState([])
    // trạng thái form thêm chi nhánh mới
    const [newBranch, setNewBranch] = useState({
        name: '',
        location: ''
    })
    // khi người dùng đang sửa một chi nhánh, lưu object đó ở đây
    const [editingBranch, setEditingBranch] = useState(null)

    // gọi API để lấy danh sách chi nhánh và cập nhật state `branches`
    const fetchBranches = async () => {
        try {
            const res = await axios.get(backEndURL + '/api/branch/list')
            // nếu API trả về dữ liệu (mảng chi nhánh), cập nhật state
            if (res.data) {
                setBranches(res.data)
            }
        } catch (e) {
            // log lỗi để debug, và hiển thị toast cho người dùng
            console.log(e)
            toast.error('Có lỗi xảy ra khi lấy danh sách chi nhánh')
        }
    }

    // xử lý submit form thêm chi nhánh
    const handleAddBranch = async (e) => {
        e.preventDefault() // ngăn form reload trang
        try {
            // gọi API POST với payload `newBranch` và header Authorization
            const res = await axios.post(backEndURL + '/api/branch/create', newBranch, {
                headers: { Authorization: `Bearer ${token}` }
            })
            // nếu thành công: thông báo, reset form và reload danh sách
            if (res.data) {
                toast.success('Thêm chi nhánh thành công')
                setNewBranch({ name: '', location: '' })
                fetchBranches()
            }
        } catch (e) {
            // hiển thị lỗi cụ thể nếu server trả về message, nếu không thì dùng message mặc định
            console.log(e)
            toast.error(e.response?.data?.message || 'Có lỗi xảy ra khi thêm chi nhánh')
        }
    }

    // hiển thị toast confirm (không tự đóng) để hỏi người dùng trước khi xóa
    // nếu người dùng nhấn Xóa, gọi API DELETE; nếu Hủy thì đóng toast
    const handleDelete = async (id) => {
        toast.info(
            <div>
                <div>Bạn có chắc chắn muốn xóa chi nhánh này?</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        onClick={async () => {
                            toast.dismiss() // đóng dialog confirm
                            try {
                                // gọi API xóa kèm Authorization
                                const res = await axios.delete(backEndURL + `/api/branch/delete/${id}`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                })
                                if (res.data) {
                                    toast.success('Xóa chi nhánh thành công')
                                    fetchBranches() // cập nhật lại danh sách sau khi xóa
                                }
                            } catch (e) {
                                console.log(e)
                                toast.error('Có lỗi xảy ra khi xóa chi nhánh')
                            }
                        }}
                    >Xóa</button>
                    <button
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                        onClick={() => toast.dismiss()}
                    >Hủy</button>
                </div>
            </div>,
            { autoClose: false }
        )
    }

    // gửi request cập nhật chi nhánh (PUT)
    const handleEdit = async (id) => {
        try {
            const res = await axios.put(backEndURL + `/api/branch/update/${id}`, editingBranch, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.data) {
                toast.success('Cập nhật chi nhánh thành công')
                setEditingBranch(null) // thoát chế độ edit
                fetchBranches() // reload danh sách
            }
        } catch (e) {
            console.log(e)
            toast.error('Có lỗi xảy ra khi cập nhật chi nhánh')
        }
    }

    // bắt đầu sửa: copy object chi nhánh vào state `editingBranch`
    const startEditing = (branch) => {
        setEditingBranch({ ...branch })
    }

    // hủy sửa: reset `editingBranch` về null
    const cancelEditing = () => {
        setEditingBranch(null)
    }

    // gọi `fetchBranches` 1 lần khi component mount để load dữ liệu ban đầu
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
                            // liên kết field với state `newBranch.name` (controlled input)
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
                            // liên kết field vị trí với `newBranch.location`
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
                                {/* nếu đang ở chế độ edit cho chi nhánh này thì hiển thị form edit */}
                                {editingBranch?._id === branch._id ? (
                                    <div className='space-y-3 sm:space-y-0 sm:grid sm:grid-cols-[2fr_3fr_2fr] items-center gap-3'>
                                        <div>
                                            <label className='block text-xs text-gray-500 sm:hidden'>Tên Chi Nhánh</label>
                                            <input
                                                type="text"
                                                // input controlled bind tới `editingBranch.name`
                                                value={editingBranch.name}
                                                onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                                                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-xs text-gray-500 sm:hidden'>Vị Trí</label>
                                            <input
                                                type="text"
                                                // input controlled bind tới `editingBranch.location`
                                                value={editingBranch.location}
                                                onChange={(e) => setEditingBranch({ ...editingBranch, location: e.target.value })}
                                                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm'
                                            />
                                        </div>
                                        <div className='flex gap-2 justify-end sm:justify-center pt-2 sm:pt-0'>
                                            <button
                                                // gọi API cập nhật khi nhấn Lưu
                                                onClick={() => handleEdit(branch._id)}
                                                className='bg-green-400 hover:bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs'
                                            >
                                                Lưu
                                            </button>
                                            <button
                                                // hủy chỉnh sửa
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
                                                // bật chế độ edit cho chi nhánh này
                                                onClick={() => startEditing(branch)}
                                                className='bg-green-400 hover:bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs'
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                // hiển thị confirm và xóa khi xác nhận
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
