import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { ShopContext } from '../contexts/ShopContext'
import ProductItem from './ProductItem'

const NewDrink = () => {
    const { products } = useContext(ShopContext)
    const [newDrink, setNewDrink] = useState([])

    useEffect(() => {
        // Create a copy of products array and shuffle it
        const shuffledProducts = [...products]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10)
        setNewDrink(shuffledProducts)
    }, [products])

    return (
        <div className='my-6 md:my-10 px-4 md:px-6 lg:px-8'>
            <div className='text-center py-6 md:py-8'>
                <Title text1={'NEW DRINK'}
                    text2={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus optio quisquam dicta maxime, perferendis veniam!'} />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 justify-items-center max-w-7xl mx-auto'>
                {
                    newDrink.map((item, index) => (
                        <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} category={item.category} />
                    ))
                }
            </div>
        </div>
    )
}

export default NewDrink
