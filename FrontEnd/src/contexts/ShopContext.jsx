import { createContext } from "react";
import { products } from '../assets/assets'

export const ShopContext = createContext()

const ShopContextProvider = (props) => {
    const currency = 'VNĐ'
    const devivery_fee = 30000

    const value = {
        products, currency, devivery_fee
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;