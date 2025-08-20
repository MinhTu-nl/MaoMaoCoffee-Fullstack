import axios from 'axios'
import React, { useState } from 'react'
import { backEndURL } from '../App'
import { toast } from 'react-toastify'
import ImageUploadArea from '../components/ImageUploadArea'

const MAX_IMAGES = 4; // giới hạn số lượng ảnh upload

// Trang thêm sản phẩm mới. Xử lý upload ảnh, nhập thông tin, gửi dữ liệu lên server.
const Add = ({ token }) => {
    // State lưu danh sách ảnh sản phẩm (mảng file hoặc null cho ô rỗng)
    const [images, setImages] = useState([null]);
    // State lưu tên sản phẩm (controlled input)
    const [name, setName] = useState('')
    // State lưu mô tả sản phẩm
    const [description, setDescription] = useState('')
    // State lưu giá theo từng size (object: { S: 10000, M: 12000 })
    const [price, setPrice] = useState({})
    // State lưu loại sản phẩm
    const [category, setCategory] = useState('coffee')
    // State lưu nhóm sản phẩm
    const [subCategory, setSubCategory] = useState('drink')
    // State lưu các size sản phẩm (mảng string)
    const [sizes, setSizes] = useState([])
    // State đánh dấu sản phẩm bán chạy
    const [bestseller, setBestseller] = useState(false)

    // Xử lý khi chọn/chỉnh sửa ảnh
    // Khi người dùng chọn file ảnh cho ô thứ `idx` => cập nhật mảng `images`
    const handleImageChange = (idx, e) => {
        const file = e.target.files[0];
        if (file) {
            setImages(prev => {
                const arr = [...prev];
                arr[idx] = file;
                return arr;
            });
        }
    };

    // Thêm một ô upload ảnh mới
    // Thêm một ô upload mới (nếu chưa đạt MAX_IMAGES)
    const handleAddImage = () => {
        if (images.length < MAX_IMAGES) setImages(prev => [...prev, null]);
    };

    // Xoá một ảnh khỏi danh sách
    // Xoá ô ảnh theo chỉ số
    const handleRemoveImage = (idx) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
    };

    // Xử lý thay đổi giá cho từng size
    // Thay đổi giá theo size: chuyển value sang Number và lưu vào `price[size]`
    const handlePriceChange = (size, value) => {
        setPrice(prev => ({
            ...prev,
            [size]: Number(value)
        }))
    }

    // Xử lý submit form thêm sản phẩm
    // Kiểm tra dữ liệu, tạo FormData, gửi lên server
    // Submit form: validate, build FormData (có ảnh) và gọi API
    const onSumbitHandler = async (e) => {
        e.preventDefault()
        // Kiểm tra các trường bắt buộc
        if (!name || !description || !category || !subCategory || sizes.length === 0) {
            toast.error('Please fill in all required fields')
            return
        }
        // Kiểm tra đã upload ít nhất một ảnh
        if (!images.some(img => img !== null)) {
            toast.error('Please upload at least one image')
            return
        }
        // Kiểm tra đã nhập giá cho tất cả size
        const missingPrices = sizes.filter(size => !price[size])
        if (missingPrices.length > 0) {
            toast.error(`Please set prices for sizes: ${missingPrices.join(', ')}`)
            return
        }
        try {
            // Tạo FormData để gửi dữ liệu sản phẩm (bao gồm cả ảnh)
            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('price', JSON.stringify(price))
            formData.append('category', category)
            formData.append('subCategory', subCategory)
            formData.append('sizes', JSON.stringify(sizes))
            formData.append('bestseller', bestseller)
            // đính kèm từng file ảnh vào FormData nếu tồn tại
            images.forEach((img, idx) => {
                if (img) formData.append(`image${idx + 1}`, img)
            })
            // Gửi request thêm sản phẩm lên server. Header 'token' được dùng bởi backend để xác thực
            const res = await axios.post(backEndURL + `/api/product/add`, formData, {
                headers: {
                    token,
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (res.data.success) {
                toast.success(res.data.message)
                // reset form sau khi thêm thành công
                setName('')
                setDescription('')
                setPrice({})
                setSizes([])
                setBestseller(false)
                setImages([null])
            } else {
                toast.error(res.data.message || 'Failed to add product')
            }
        } catch (err) {
            console.error('Error adding product:', err)
            // Thông báo lỗi chi tiết nếu có response từ server, nếu không thì dò lỗi kết nối
            if (err.response) {
                toast.error(err.response.data.message || 'Server error occurred')
            } else if (err.request) {
                toast.error('No response from server. Please check your connection.')
            } else {
                toast.error(err.message || 'Something went wrong')
            }
        }
    }

    return (
        <div className="w-full min-h-[60vh] flex items-center justify-center">
            <form onSubmit={onSumbitHandler} className="w-full bg-white rounded-xl shadow flex flex-col md:flex-row gap-8 p-2 md:p-6">
                {/* Left: Image Upload */}
                <div className="flex flex-col items-center w-full md:w-1/3 gap-3">
                    <div className="w-full">
                        <h2 className="text-xs font-semibold mb-2 text-gray-700">Ảnh sản phẩm</h2>
                        <div className="flex gap-2 flex-wrap w-full">
                            {images.map((img, idx) => (
                                <ImageUploadArea
                                    key={idx}
                                    image={img}
                                    onChange={e => handleImageChange(idx, e)}
                                    onRemove={images.length > 1 ? () => handleRemoveImage(idx) : undefined}
                                />
                            ))}
                            {images.length < MAX_IMAGES && (
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    className="aspect-square w-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-2xl text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
                                    title="Thêm ảnh"
                                >
                                    +
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {/* Right: Form Fields */}
                <div className="flex-1 flex flex-col gap-3 w-full">
                    <div className="grid grid-cols-1 gap-2 w-full">
                        <label className="text-xs font-medium text-gray-600">Tên sản phẩm *</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Nhập tên sản phẩm"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-2 w-full">
                        <label className="text-xs font-medium text-gray-600">Mô tả *</label>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="2"
                            placeholder="Nhập mô tả sản phẩm"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full">
                        <div>
                            <label className="text-xs font-medium text-gray-600">Loại sản phẩm *</label>
                            <select
                                onChange={(e) => setCategory(e.target.value)}
                                value={category}
                                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value='coldbew'>Coldbrew</option>
                                <option value="coffee">Cà phê</option>
                                <option value="tea">Trà</option>
                                <option value='milk'>Trà sữa</option>
                                <option value="ice">Đá xay</option>
                                <option value="croffle">Croffle</option>
                                <option value="toast">Bánh nướng</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Nhóm *</label>
                            <select
                                onChange={(e) => setSubCategory(e.target.value)}
                                value={subCategory}
                                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="drink">Đồ uống</option>
                                <option value="food">Món ăn</option>
                                <option value="dessert">Tráng miệng</option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-medium text-gray-600">Kích cỡ có sẵn *</label>
                        <div className="flex flex-wrap gap-2 mt-1 w-full">
                            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() =>
                                        setSizes((prev) =>
                                            prev.includes(size)
                                                ? prev.filter((item) => item !== size)
                                                : [...prev, size]
                                        )
                                    }
                                    className={`px-3 py-1 rounded-lg text-xs transition-colors ${sizes.includes(size)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                    {sizes.length > 0 && (
                        <div className="w-full">
                            <label className="text-xs font-medium text-gray-600">Giá cho từng cỡ *</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-1 w-full">
                                {sizes.map((size) => (
                                    <div key={size}>
                                        <label className="block text-[10px] text-gray-600 mb-1">Giá cho cỡ {size}</label>
                                        <input
                                            type="number"
                                            value={price[size] || ''}
                                            onChange={(e) => handlePriceChange(size, e.target.value)}
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập giá"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-2 mt-2 w-full">
                        <input
                            type="checkbox"
                            id="bestseller"
                            checked={bestseller}
                            onChange={() => setBestseller((prev) => !prev)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="bestseller" className="text-xs font-medium text-gray-700">
                            Đánh dấu bán chạy
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-3 bg-blue-600 text-white text-base rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                    >
                        Thêm sản phẩm
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Add
