import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import ProductItem from './ProductItem'
import Title from './Title'
import { useNavigate } from 'react-router-dom'

const RelatedProducts = ({ category, subCategory }) => {
    const { products } = useContext(ShopContext)
    const [related, setRelated] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (products.length > 0) {
            let productCopy = products.slice()
            productCopy = productCopy.filter((item) => category === item.category)
            productCopy = productCopy.filter((item) => subCategory === item.subCategory)
            setRelated(productCopy.slice(0, 5));
        }
    }, [products])

    const handleProductClick = (id) => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        navigate(`/Products/${id}`)
    }

    return (
        <div className='my-24'>
            <div className='text-center text-3xl py-2'>
                <Title text1={'SẢN PHẨM LIÊN QUAN'} text2={'Đây là một số sản phẩm liên quan với sản phẩm đang xem'} />
            </div>

            {/* Render products */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    related.map((item, index) => (
                        <div key={index} onClick={() => handleProductClick(item._id)}>
                            <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} category={item.category} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default RelatedProducts
