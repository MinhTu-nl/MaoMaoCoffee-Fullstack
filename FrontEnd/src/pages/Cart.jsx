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
        <div className='border-t pt-14'>
            <div className='text-2xl md-3'>
                <Title text1={'GIỎ HÀNG CỦA TÔI'} text2={''} />
            </div>

            <div>
                {
                    cartData.map((item, index) => {
                        const productData = products.find((products) => products._id === item._id);
                        return (
                            <div className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4' key={index}>
                                <div className='flex items-start gap-6'>
                                    <img src={productData.images[0]} alt="" className='w-16 sm:w-20' />
                                    <div>
                                        <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                                        <div className='flex items-center gap-5 mt-2'>
                                            <p>{getDisplayPrice(productData, item.sizes)} {currency}</p>
                                            <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.sizes}</p>
                                        </div>
                                    </div>
                                </div>
                                <input min={1} onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.sizes, Number(e.target.value))} type='number' defaultValue={item.quantity} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' />
                                <img onClick={() => updateQuantity(item._id, item.sizes, 0)} src={assets.bin_icon} className='w-2 mr-4 sm:w-5 cursor-pointer' />
                            </div>
                        )
                    })
                }
            </div>
            <div className='flex justify-center my-20'>
                <div className='w-full sm:w-[450px]'>
                    <CartTotal />
                    <div className='w-full text-end'>
                        <button onClick={() => navigate('/Place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>Thanh Toán</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart;