import React, { useContext } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from './Title'

const CartTotal = ({ items }) => {
    const { currency, delivery_fee, getCartAmount, products } = useContext(ShopContext)

    const getProductDisplayPrice = (productId, size) => {
        const product = products.find(p => p._id === productId);
        if (!product) return 0;
        if (typeof product.price === 'object' && product.price !== null) {
            return product.price[size] || 0;
        }
        return product.price;
    };

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={"TỔNG HOÁ ĐƠN"} text2={'Đây là hoá đơn của bạn:'} />
            </div>

            {items && items.length > 0 && (
                <div className='mt-4 mb-6 border-b pb-4'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-3'>Sản phẩm trong đơn hàng:</h3>
                    <div className='space-y-2'>
                        {items.map((item, index) => {
                            const productPrice = getProductDisplayPrice(item.productId, item.size);
                            const productName = products.find(p => p._id === item.productId)?.name || 'Unknown Product';
                            return (
                                <div key={index} className='flex justify-between text-xs text-gray-500'>
                                    <p>{productName} ({item.quantity} x {item.size}):</p>
                                    <p>{productPrice * item.quantity} {currency}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Tổng cộng sản phẩm: </p>
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
