import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from "../contexts/ShopContext"
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {
    const { products, currency, cartItems, updateQuantily, navigrate } = useContext(ShopContext)
    const [cartData, setCartData] = useState([])

    useEffect(() => {
        const tempData = []
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    tempData.push({
                        _id: items,
                        size: item,
                        quantily: cartItems[items][item],
                    })
                }
            }
        }
        setCartData(tempData)
    }, [cartItems])

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
                                    <img src={productData.image[0]} alt="" className='w-16 sm:w-20' />
                                    <div>
                                        <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                                        <div className='flex items-center gap-5 mt-2'>
                                            <p>{productData.price} {currency}</p>
                                            <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                                        </div>
                                    </div>
                                </div>
                                <input min={1} onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantily(item._id, item.size, Number(e.target.value))} type='number' defaultValue={item.quantily} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' />
                                <img onClick={() => updateQuantily(item._id, item.size, 0)} src={assets.bin_icon} className='w-2 mr-4 sm:w-5 cursor-pointer' />

                            </div>
                        )
                    })
                }
            </div>
            <div className='flex justify-center my-20'>
                <div className='w-full sm:w-[450px]'>
                    <CartTotal />
                    <div className='w-full text-end'>
                        <button onClick={() => navigrate('/Place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>Thanh Toán</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart;