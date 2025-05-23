import React, { useContext } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import { Link } from 'react-router-dom';
import '../../src/index.css'

const ProductItem = ({ id, image, name, price, category }) => {
    const { currency } = useContext(ShopContext);

    return (
        <div className="group w-[220px]">
            <Link
                className="block w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden"
                to={`/products/${id}`}
            >
                <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
                    <img
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                        src={image[0]}
                        alt={name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-3.5">
                    <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-medium text-[#0d1321] bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                            #{category}
                        </span>
                        <p className="text-sm font-bold text-[#0d1321]">
                            {price} {currency}
                        </p>
                    </div>

                    <div className="min-h-[40px] mb-3.5">
                        <h3 className="text-sm font-medium text-[#0d1321] line-clamp-2 leading-tight">
                            {name}
                        </h3>
                    </div>

                    <button className="w-full py-2 text-xs font-medium text-white bg-[#0d1321] rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#1d2d44] shadow-sm">
                        Xem chi tiết
                    </button>
                </div>
            </Link>
        </div>
    )
}

export default ProductItem