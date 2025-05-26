import { createContext, useEffect, useState } from "react";
import { products } from '../assets/assets'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export const ShopContext = createContext()

const ShopContextProvider = (props) => {
    const currency = 'VNĐ'
    const delivery_fee = 30000
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const navigrate = useNavigate()

    const addToCart = async (itemId, size) => {
        if (!size) {
            // toast.error('Please select product size');
            toast.error('Xin vui lòng chọn kích cỡ')
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);
    }

    const getCartCount = () => {
        let totalCount = 0
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item]
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }
        return totalCount
    }

    const getCartAmount = () => {
        let totalAmount = 0

        for (const items in cartItems) {
            let itemInfo = products.find((products) => products._id === items)
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        const price = typeof itemInfo.price === 'object' ? itemInfo.price[item] : itemInfo.price;
                        totalAmount += price * cartItems[items][item]
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }
        return totalAmount
    }

    const updateQuantily = async (itemId, size, quantily) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantily
        setCartItems(cartData)
    }

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart, getCartCount,
        updateQuantily, getCartAmount, navigrate
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;