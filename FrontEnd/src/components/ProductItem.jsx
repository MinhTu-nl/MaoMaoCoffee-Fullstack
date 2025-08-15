import React, { useContext } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import { Link } from 'react-router-dom';
import '../../src/index.css'

const ProductItem = ({ id, images, name, price, category }) => {
    const { currency } = useContext(ShopContext);

    const getDisplayPrice = () => {
        if (typeof price === 'object') {
            // If price is an object, show the first available price
            const firstSize = Object.keys(price)[0];
            return price[firstSize];
        }
        return price;
    }

    // Kiểm tra images có tồn tại, là mảng, có phần tử và phần tử đầu tiên là chuỗi hợp lệ
    // Sử dụng ảnh placeholder nếu không
    const imageUrl = (images && Array.isArray(images) && images.length > 0 && typeof images[0] === 'string' && images[0].length > 0)
        ? images[0] // Sử dụng ảnh đầu tiên nếu hợp lệ
        : images; // Sử dụng ảnh placeholder. HÃY THAY THẾ ĐƯỜNG DẪN NÀY BẰNG ẢNH THẬT!

    return (
        <div className="group w-full sm:w-[220px]">
            <Link
                className="block w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden"
                to={`/products/${id}`}
            >
                <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
                    <img
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                        src={imageUrl}
                        alt={name}
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-2.5 sm:p-3.5">
                    <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                        <span className="text-xs font-medium text-blue-950 bg-gray-50 px-2 py-1 rounded-full border border-gray-100 truncate max-w-[60px] sm:max-w-none">
                            #{category}
                        </span>
                        <p className="text-sm font-bold text-blue-950 truncate ml-1">
                            {getDisplayPrice()} {currency}
                        </p>
                    </div>

                    <div className="min-h-[32px] sm:min-h-[40px] mb-2.5 sm:mb-3.5">
                        <h3 className="text-xs sm:text-sm font-medium text-blue-950 line-clamp-2 leading-tight">
                            {name}
                        </h3>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProductItem