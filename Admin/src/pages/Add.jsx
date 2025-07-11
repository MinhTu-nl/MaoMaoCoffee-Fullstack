import axios from 'axios'
import React, { useState } from 'react'
import { backEndURL } from '../App'
import { toast } from 'react-toastify'
import ImageUploadArea from '../components/ImageUploadArea'

const MAX_IMAGES = 4;

const Add = ({ token }) => {
    const [images, setImages] = useState([null]);
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState({})
    const [category, setCategory] = useState('coffee')
    const [subCategory, setSubCategory] = useState('drink')
    const [sizes, setSizes] = useState([])
    const [bestseller, setBestseller] = useState(false)

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

    const handleAddImage = () => {
        if (images.length < MAX_IMAGES) setImages(prev => [...prev, null]);
    };

    const handleRemoveImage = (idx) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
    };

    const handlePriceChange = (size, value) => {
        setPrice(prev => ({
            ...prev,
            [size]: Number(value)
        }))
    }

    const onSumbitHandler = async (e) => {
        e.preventDefault()
        if (!name || !description || !category || !subCategory || sizes.length === 0) {
            toast.error('Please fill in all required fields')
            return
        }
        if (!images.some(img => img !== null)) {
            toast.error('Please upload at least one image')
            return
        }
        const missingPrices = sizes.filter(size => !price[size])
        if (missingPrices.length > 0) {
            toast.error(`Please set prices for sizes: ${missingPrices.join(', ')}`)
            return
        }
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('price', JSON.stringify(price))
            formData.append('category', category)
            formData.append('subCategory', subCategory)
            formData.append('sizes', JSON.stringify(sizes))
            formData.append('bestseller', bestseller)
            images.forEach((img, idx) => {
                if (img) formData.append(`image${idx + 1}`, img)
            })
            const res = await axios.post(backEndURL + `/api/product/add`, formData, {
                headers: {
                    token,
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (res.data.success) {
                toast.success(res.data.message)
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
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                toast.error(err.response.data.message || 'Server error occurred')
            } else if (err.request) {
                // The request was made but no response was received
                toast.error('No response from server. Please check your connection.')
            } else {
                // Something happened in setting up the request that triggered an Error
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
