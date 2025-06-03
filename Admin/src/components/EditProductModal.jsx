import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backEndURL } from '../App';

const EditProductModal = ({ product, onClose, onSave, token }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [sizes, setSizes] = useState([]);
    const [price, setPrice] = useState({});
    const [bestseller, setBestseller] = useState(false);

    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setDescription(product.description || '');
            setCategory(product.category || '');
            setSubCategory(product.subCategory || '');
            setSizes(product.sizes || []);
            setPrice(product.price || {});
            setBestseller(product.bestseller || false);
        }
    }, [product]);

    const handlePriceChange = (size, value) => {
        setPrice(prev => ({
            ...prev,
            [size]: Number(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('subCategory', subCategory);
            formData.append('sizes', JSON.stringify(sizes));
            formData.append('price', JSON.stringify(price));
            formData.append('bestseller', bestseller);

            await axios.put(
                backEndURL + `/api/product/update/${product._id}`,
                formData,
                { headers: { token, 'Content-Type': 'multipart/form-data' } }
            );
            toast.success('Cập nhật thành công!');
            onSave(); // callback để reload lại danh sách
            onClose();
        } catch (err) {
            toast.error('Có lỗi khi cập nhật!');
        }
    };

    if (!product) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-xl">&times;</button>
                <h2 className="text-xl font-bold mb-4">Sửa sản phẩm</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input value={name} onChange={e => setName(e.target.value)} className="w-full border px-2 py-1 rounded" placeholder="Tên sản phẩm" required />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border px-2 py-1 rounded" placeholder="Mô tả" required />
                    <div className="flex gap-2">
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-1/2 border px-2 py-1 rounded">
                            <option value="coldbew">Coldbrew</option>
                            <option value="coffee">Cà phê</option>
                            <option value="tea">Trà</option>
                            <option value="milk">Trà sữa</option>
                            <option value="ice">Đá xay</option>
                            <option value="croffle">Croffle</option>
                            <option value="toast">Bánh nướng</option>
                        </select>
                        <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="w-1/2 border px-2 py-1 rounded">
                            <option value="drink">Đồ uống</option>
                            <option value="food">Món ăn</option>
                            <option value="dessert">Tráng miệng</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Sizes</label>
                        <div className="flex gap-2">
                            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                <button
                                    type="button"
                                    key={size}
                                    className={`px-2 py-1 rounded ${sizes.includes(size) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    onClick={() =>
                                        setSizes(prev =>
                                            prev.includes(size)
                                                ? prev.filter(s => s !== size)
                                                : [...prev, size]
                                        )
                                    }
                                >{size}</button>
                            ))}
                        </div>
                    </div>
                    {sizes.length > 0 && (
                        <div>
                            <label className="block mb-1">Giá theo size</label>
                            <div className="grid grid-cols-2 gap-2">
                                {sizes.map(size => (
                                    <input
                                        key={size}
                                        type="number"
                                        value={price[size] || ''}
                                        onChange={e => handlePriceChange(size, e.target.value)}
                                        className="border px-2 py-1 rounded"
                                        placeholder={`Giá cho size ${size}`}
                                        min="0"
                                        required
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={bestseller} onChange={() => setBestseller(b => !b)} />
                        <span>Bán chạy</span>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Lưu thay đổi</button>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
