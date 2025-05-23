import React, { useContext } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from './Title'

const CartTotal = () => {
    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext)

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={"TỔNG HOÁ ĐƠN"} text2={'Đây là hoá đơn của bạn:'} />
            </div>

            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Tổng cộng: </p>
                    <p>{getCartAmount()} {currency}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Phí ship: </p>
                    <p>{delivery_fee} {currency}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Số tiền thanh toán: </p>
                    <p>{getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee} {currency}</p>
                </div>
            </div>
        </div>
    )
}
// còn order và place order
export default CartTotal
