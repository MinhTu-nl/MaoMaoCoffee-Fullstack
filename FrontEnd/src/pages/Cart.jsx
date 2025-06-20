import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from "../contexts/ShopContext"
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {
    const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext)
    const [cartData, setCartData] = useState([])

    useEffect(() => {
        if (products.length > 0) {
            const tempData = []
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        tempData.push({
                            _id: items,
                            sizes: item,
                            quantity: cartItems[items][item],
                        })
                    }
                }
            }
            setCartData(tempData)
        }
    }, [cartItems, products])

    const getDisplayPrice = (product, sizes) => {
        if (!product || !product.price) return 0;
        if (typeof product.price === 'object') {
            return product.price[sizes] || 0;
        }
        return product.price;
    }

    return (
        <div className='min-h-screen bg-white'>
            <div className='max-w-6xl mx-auto px-4 py-12'>
                <div className='mb-10'>
                    <Title text1={'GIỎ HÀNG CỦA TÔI'} text2={''} />
                </div>

                {cartData.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-16'>
                        <div className='w-20 h-20 mb-4'>
                            <img src={assets.bin_icon} alt="Empty cart" className='w-full h-full opacity-20' />
                        </div>
                        <p className='text-lg text-gray-400 mb-6'>Giỏ hàng của bạn đang trống</p>
                        <button
                            onClick={() => navigate('/Menu')}
                            className='px-6 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300'
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        <div className='lg:col-span-2'>
                            {cartData.map((item, index) => {
                                const productData = products.find((products) => products._id === item._id);
                                return (
                                    <div
                                        key={index}
                                        className='group flex items-center gap-6 py-4 border-b border-gray-100 last:border-0'
                                    >
                                        <div className='relative w-20 h-20 overflow-hidden'>
                                            <img
                                                src={productData.images[0]}
                                                alt={productData.name}
                                                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                                            />
                                        </div>

                                        <div className='flex-1'>
                                            <h3 className='text-base font-light mb-1'>{productData.name}</h3>
                                            <div className='flex items-center gap-3 text-sm text-gray-500'>
                                                <span>{getDisplayPrice(productData, item.sizes)} {currency}</span>
                                                <span className='px-2 py-0.5 border border-gray-200 text-xs'>{item.sizes}</span>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-4'>
                                            <div className='flex items-center'>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.sizes, Math.max(1, item.quantity - 1))}
                                                    className='w-6 h-6 flex items-center justify-center border border-gray-200 hover:border-black transition-colors text-sm'
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type='number'
                                                    min={1}
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value);
                                                        if (!isNaN(value) && value > 0) {
                                                            updateQuantity(item._id, item.sizes, value);
                                                        }
                                                    }}
                                                    className='w-10 h-6 text-center border-y border-gray-200 focus:outline-none text-sm'
                                                />
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.sizes, item.quantity + 1)}
                                                    className='w-6 h-6 flex items-center justify-center border border-gray-200 hover:border-black transition-colors text-sm'
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.sizes, 0)}
                                                className='p-1.5 hover:opacity-50 transition-opacity'
                                            >
                                                <img src={assets.bin_icon} alt="Delete" className='w-4 h-4' />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className='lg:col-span-1'>
                            <div className='sticky top-8'>
                                <div className='bg-gray-50 p-6'>
                                    <CartTotal />
                                    <button
                                        onClick={() => navigate('/Place-order')}
                                        className='w-full mt-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-300'
                                    >
                                        Thanh Toán
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart;