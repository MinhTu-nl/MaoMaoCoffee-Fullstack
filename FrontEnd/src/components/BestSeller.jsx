import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import ProductItem from './ProductItem'
import Title from './Title'

const BestSeller = () => {
    const { products } = useContext(ShopContext)
    const [bestseller, setBestSeller] = useState([])

    useEffect(() => {
        const bestProduct = products.filter((item) => (item.bestseller));
        setBestSeller(bestProduct.slice(0, 5))
    }, [products])
    return (
        <div className='my-6 md:my-10 px-4 md:px-6 lg:px-8'>
            <div className='text-center py-6 md:py-8'>
                <Title text1={'BEST SELLER'}
                    text2={'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maxime officiis magni numquam soluta harum accusamus perferendis mollitia assumenda nam esse nesciunt unde atque amet, eos ex ullam, voluptas culpa officia.'} />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 justify-items-center max-w-7xl mx-auto'>
                {
                    bestseller.map((item, index) => (
                        <ProductItem key={index} id={item._id} images={item.images} name={item.name} price={item.price} category={item.category} />
                    ))
                }
            </div>
        </div>
    )
}

export default BestSeller
