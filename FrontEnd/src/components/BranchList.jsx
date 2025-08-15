import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '../contexts/ShopContext'

const BranchList = ({ onSelect, selectedBranch }) => {
    const { backendURL } = useContext(ShopContext)
    const [branches, setBranches] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [showAll, setShowAll] = useState(false)
    const ITEMS_PER_PAGE = 5

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get(backendURL + '/api/branch/list')
                if (Array.isArray(response.data)) {
                    setBranches(response.data)
                    setError(null)
                } else if (response.data.success && Array.isArray(response.data.branches)) {
                    setBranches(response.data.branches)
                    setError(null)
                } else if (response.data.success && Array.isArray(response.data.data)) {
                    setBranches(response.data.data)
                    setError(null)
                } else {
                    setError('Định dạng dữ liệu không hợp lệ')
                    setBranches([])
                }
            } catch (error) {
                setError(error.message || 'Lỗi kết nối đến server')
                setBranches([])
            } finally {
                setLoading(false)
            }
        }

        if (backendURL) {
            fetchBranches()
        } else {
            setError('URL server không hợp lệ')
            setLoading(false)
        }
    }, [backendURL])

    const filteredBranches = branches.filter(branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8 bg-red-50 rounded-lg">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Thử lại
                </button>
            </div>
        )
    }

    if (!Array.isArray(branches) || branches.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Không có chi nhánh nào</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Tìm kiếm chi nhánh..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Branch Table - Hidden on mobile, replaced with cards */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chi nhánh
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Địa chỉ
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chọn
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {(showAll ? filteredBranches : filteredBranches.slice(0, ITEMS_PER_PAGE)).map((branch) => (
                            <tr
                                key={branch._id}
                                className={`hover:bg-gray-50 transition-colors ${selectedBranch?._id === branch._id ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {branch.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-500">
                                        {branch.location}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => onSelect && onSelect(branch)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                                            ${selectedBranch?._id === branch._id
                                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {selectedBranch?._id === branch._id ? 'Đã chọn' : 'Chọn'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards - Visible only on mobile */}
            <div className="md:hidden space-y-3">
                {(showAll ? filteredBranches : filteredBranches.slice(0, ITEMS_PER_PAGE)).map((branch) => (
                    <div
                        key={branch._id}
                        className={`p-4 bg-white rounded-lg shadow-sm border ${selectedBranch?._id === branch._id ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-gray-900">{branch.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{branch.location}</p>
                            </div>
                            <button
                                onClick={() => onSelect && onSelect(branch)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
                                    ${selectedBranch?._id === branch._id
                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {selectedBranch?._id === branch._id ? 'Đã chọn' : 'Chọn'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Show More Button */}
            {filteredBranches.length > ITEMS_PER_PAGE && (
                <div className="text-center mt-4">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        {showAll ? 'Ẩn bớt' : `Xem thêm (${filteredBranches.length - ITEMS_PER_PAGE} chi nhánh)`}
                    </button>
                </div>
            )}

            {/* No Results Message */}
            {filteredBranches.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Không tìm thấy chi nhánh phù hợp</p>
                </div>
            )}
        </div>
    )
}

export default BranchList