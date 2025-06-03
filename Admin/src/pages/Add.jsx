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
    const [category, setCategory] = useState('Coffee')
    const [subCategory, setSubCategory] = useState('Drink')
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
                toast.error(res.data.message)
            }
        } catch (err) {
            console.log(err)
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-6 md:px-8 py-8">
            <form onSubmit={onSumbitHandler} className="w-full flex flex-col gap-8">
                <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow w-full space-y-4">
                    {/* Image Upload Area */}
                    <div>
                        <h2 className="text-base font-semibold mb-4">Product Images</h2>
                        <div className="flex gap-4 flex-wrap">
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
                                    className="aspect-square w-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-4xl text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
                                    title="Add image"
                                >
                                    +
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className="w-full px-3 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter product name"
                            required
                        />
                    </div>
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            className="w-full px-3 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            placeholder="Enter product description"
                            required
                        />
                    </div>
                    {/* Category & SubCategory */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select
                                onChange={(e) => setCategory(e.target.value)}
                                value={category}
                                className="w-full px-3 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Coffee">Coffee</option>
                                <option value="Tea">Tea</option>
                                <option value="Cake">Cake</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category *</label>
                            <select
                                onChange={(e) => setSubCategory(e.target.value)}
                                value={subCategory}
                                className="w-full px-3 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Drink">Drink</option>
                                <option value="Food">Food</option>
                                <option value="Dessert">Dessert</option>
                            </select>
                        </div>
                    </div>
                    {/* Sizes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Available Sizes *</label>
                        <div className="flex flex-wrap gap-2">
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
                                    className={`px-4 py-2 rounded-lg transition-colors ${sizes.includes(size)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Prices */}
                    {sizes.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prices for Selected Sizes *</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {sizes.map((size) => (
                                    <div key={size}>
                                        <label className="block text-xs text-gray-600 mb-1">Price for {size}</label>
                                        <input
                                            type="number"
                                            value={price[size] || ''}
                                            onChange={(e) => handlePriceChange(size, e.target.value)}
                                            className="w-full px-3 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter price"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Bestseller */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="bestseller"
                            checked={bestseller}
                            onChange={() => setBestseller((prev) => !prev)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="bestseller" className="text-sm font-medium text-gray-700">
                            Mark as Bestseller
                        </label>
                    </div>
                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full px-4 py-3 bg-blue-600 text-white text-base rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                    >
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Add
