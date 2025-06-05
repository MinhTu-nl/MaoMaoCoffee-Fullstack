import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../contexts/ShopContext'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'

const Product = () => {
    const { productId } = useParams()
    const { products, currency, addToCart } = useContext(ShopContext)
    const [productData, setProductData] = useState(null)
    const [images, setImages] = useState('')
    const [sizes, setSizes] = useState('')
    const [price, setPrice] = useState(0)

    /**
     * Lấy giá của sản phẩm dựa trên kích thước được chọn
     * @param {Object} product - Thông tin sản phẩm
     * @param {string} selectedSize - Kích thước được chọn (S, M, L)
     * @returns {number} Giá của sản phẩm theo kích thước
     */
    const getPriceForSize = (product, selectedSize) => {
        if (!product || !product.price) return 0;
        if (typeof product.price === 'object') {
            return product.price[selectedSize] || 0;
        }
        return product.price;
    }

    /**
     * Lấy thông tin sản phẩm và set giá trị mặc định
     * - Set ảnh đầu tiên
     * - Set kích thước mặc định (ưu tiên M, nếu không có thì lấy kích thước đầu tiên)
     * - Set giá tương ứng với kích thước
     */
    const fetchProductData = async () => {
        const foundProduct = products.find(item => item._id === productId);
        if (foundProduct) {
            setProductData(foundProduct);
            setImages(foundProduct.images[0]);

            // Set default size and price
            if (foundProduct.sizes && foundProduct.sizes.includes('M')) {
                setSizes('M');
                setPrice(getPriceForSize(foundProduct, 'M'));
            } else if (foundProduct.size && foundProduct.sizes.length > 0) {
                const firstSize = foundProduct.sizes[0];
                setSizes(firstSize);
                setPrice(getPriceForSize(foundProduct, firstSize));
            }
        }
    }

    useEffect(() => {
        fetchProductData();
    }, [productId]);

    /**
     * Xử lý khi người dùng thay đổi kích thước
     * - Cập nhật kích thước mới
     * - Cập nhật giá tương ứng với kích thước mới
     * @param {string} newSize - Kích thước mới được chọn
     */
    const handleSizeChange = (newSize) => {
        setSizes(newSize);
        setPrice(getPriceForSize(productData, newSize));
    }

    /**
     * Lấy giá hiển thị cho sản phẩm
     * - Nếu giá là object (có nhiều kích thước): lấy giá đầu tiên có sẵn
     * - Nếu giá là số: trả về giá đó
     * @returns {number} Giá hiển thị
     */
    const getDisplayPrice = () => {
        if (typeof price === 'object') {
            const firstSize = Object.keys(price)[0];
            return price[firstSize];
        }
        return price;
    }

    if (!productData) {
        return <div className='opacity-0'></div>;
    }

    const currentPrice = getPriceForSize(productData, sizes);

    return (
        <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 placeholder-opacity-100'>
            {/* product data */}
            <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
                <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                    <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
                        {
                            productData.images.map((item, index) => (
                                <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' />
                            ))
                        }
                    </div>
                    <div className='w-[100%] sm:w-[80%]'>
                        <img src={images} className='w-full h-auto' alt="" />
                    </div>
                </div>

                {/* product information */}
                <div className='flex-1'>
                    <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
                    <div className='flex items-center gap-1 mt-2'>
                        <img src={assets.star_icon} className='w-3 5' alt="" />
                        <img src={assets.star_icon} className='w-3 5' alt="" />
                        <img src={assets.star_icon} className='w-3 5' alt="" />
                        <img src={assets.star_icon} className='w-3 5' alt="" />
                        <img src={assets.star_dull_icon} className='w-3 5' alt="" />
                        <p className='pl-2'>122</p>
                    </div>
                    <p className='mt-5 text-3xl font-medium'>{currentPrice} {currency}</p>
                    <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
                    <div className='flex flex-col gap-4 my-8'>
                        <p>Chọn kích cỡ</p>
                        <div className='flex gap-2'>
                            {
                                productData.sizes.map((item, index) => (
                                    <button
                                        onClick={() => handleSizeChange(item)}
                                        className={`border py-2 px-4 bg-gray-100 ${item === sizes ? 'border-orange-500' : ''}`}
                                        key={index}
                                    >
                                        {item}
                                    </button>
                                ))
                            }
                        </div>
                    </div>

                    <button onClick={() => addToCart(productData._id, sizes)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>
                        Thêm vào giỏ hàng
                    </button>

                    <hr className='mt-8 sm:w-4/5' />
                    <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                        <p>100% Sản phẩm đúng với ảnh</p>
                        <p>ash on delivery is available on this product</p>
                        <p>Easay return and exchange policy within 7 days.</p>
                    </div>
                </div>
            </div>

            {/* ----------- Description & Review Section ------------- */}
            <div className='mt-20'>
                <div className='flex'>
                    <b className='border px-5 py-3 text-sm'>Description</b>
                    <p className='border px-5 py-3 text-sm'>Review</p>
                </div>
                <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
                    <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
                    <p>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
                </div>
            </div>

            <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
        </div>
    );
}

export default Product
