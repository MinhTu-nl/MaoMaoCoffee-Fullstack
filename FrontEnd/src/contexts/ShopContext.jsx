import { createContext, useEffect, useState } from "react";
import { products } from '../assets/assets'
import { toast } from 'react-toastify'

export const ShopContext = createContext()

const ShopContextProvider = (props) => {
    const currency = 'VNĐ'
    const devivery_fee = 30000
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})

    const getPriceBySize = (product, size) => {
        if (product.price && typeof product.price === 'object') {
            return product.price[size] || product.price.M; // Default to M size if size not found
        }
        return product.price; // Return original price if no size-based pricing
    }

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

    const value = {
        products, currency, devivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart, getCartCount,
        getPriceBySize,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;