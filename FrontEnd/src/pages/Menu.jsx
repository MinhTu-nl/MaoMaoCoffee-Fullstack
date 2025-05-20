import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import { assets } from '../assets/assets'
import ProductItem from '../conponents/ProductItem'
import Title from '../conponents/Title'

const Menu = () => {
    const { products, search, showSearch } = useContext(ShopContext)
    const [showFilter, setShowFilter] = useState(false)
    const [filterProducts, setFilterProduct] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 12

    const [category, setCategory] = useState([])
    const [subCategory, setSubCategory] = useState([])
    const [sortType, setSortType] = useState('relavent')

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item != e.target.value))
        } else {
            setCategory(prev => [...prev, e.target.value])
        }
    }

    const toggleSubCategory = (e) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter(item => item != e.target.value))
        } else {
            setSubCategory(prev => [...prev, e.target.value])
        }
    }

    const applyFilter = () => {
        let productCopy = products.slice();
        if (showSearch && search) {
            productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        }
        if (category.length > 0) {
            productCopy = productCopy.filter(item => category.includes(item.category));
        }
        if (subCategory.length > 0) {
            productCopy = productCopy.filter(item => subCategory.includes(item.subCategory));
        }
        setFilterProduct(productCopy)
    }

    const sortProducts = () => {
        let fpCopy = filterProducts.slice()

        switch (sortType) {
            case 'low-high':
                setFilterProduct(fpCopy.sort((a, b) => (a.price - b.price)))
                break
            case 'high-low':
                setFilterProduct(fpCopy.sort((a, b) => (b.price - a.price)))
                break
            default:
                applyFilter();
                break
        }
    }

    useEffect(() => {
        sortProducts()
    }, [sortType])

    useEffect(() => {
        applyFilter()
    }, [category, subCategory, search, showSearch])

    // Calculate pagination
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    const totalPages = Math.ceil(filterProducts.length / productsPerPage)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-[#0d1321]'>
            {/* Filter option */}
            <div className='min-w-60'>
                <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
                    <img className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`} src={assets.dropdown_icon} alt="" />
                </p>


                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>Loại</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <input
                                type="checkbox"
                                className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-[#0D1321] checked:border-[#0D1321] cursor-pointer'
                                onChange={toggleSubCategory}
                                value={"drink"}
                            /> Đồ Uống
                        </p>
                        <p className='flex gap-2'>
                            <input
                                type="checkbox"
                                className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-[#0D1321] checked:border-[#0D1321] cursor-pointer'
                                onChange={toggleSubCategory}
                                value={"dessert"}
                            /> Tráng Miệng
                        </p>
                    </div>
                </div>

                {/* Category */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>CÁC LOẠI NƯỚC UỐNG</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-[#0D1321]'>
                        <p className='flex gap-2'>
                            <input
                                type="checkbox"
                                onChange={toggleCategory}
                                className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-[#0D1321] checked:border-[#0D1321] cursor-pointer'
                                value={"coffee"}
                            /> Cà Phê
                        </p>
                        <p className='flex gap-2'>
                            <input
                                type="checkbox"
                                onChange={toggleCategory}
                                className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-[#0D1321] checked:border-[#0D1321] cursor-pointer'
                                value={"coldbrew"}
                            /> Cold Brew
                        </p>
                        <p className='flex gap-2'>
                            <input
                                type="checkbox"
                                onChange={toggleCategory}
                                className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-[#0D1321] checked:border-[#0D1321] cursor-pointer'
                                value={"tea"}
                            /> Trà
                        </p>
                        <p className='flex gap-2'>
                            <input
                                type="checkbox"
                                onChange={toggleCategory}
                                className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-[#0D1321] checked:border-[#0D1321] cursor-pointer'
                                value={"milk"}
                            /> Trà Sữa
                        </p>
                        <p className='flex gap-2'>
                            <input
                                type="checkbox"
                                onChange={toggleCategory}
                                className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-[#0D1321] checked:border-[#0D1321] cursor-pointer'
                                value={"ice"}
                            /> Đá Xay
                        </p>
                    </div>
                </div>
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>CÁC LOẠI BÁNH</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-[#0D1321]'>
                        <p className='flex gap-2'>
                            <input
                                type="checkbox"
                                onChange={toggleCategory}
                                className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-[#0D1321] checked:border-[#0D1321] cursor-pointer'
                                value={"croffle"}
                            />Bánh Croffle
                        </p>
                        <p className='flex gap-2'>
                            <input
                                type="checkbox"
                                onChange={toggleCategory}
                                className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-[#0D1321] checked:border-[#0D1321] cursor-pointer'
                                value={"toast"}
                            /> Bánh Mì Nướng
                        </p>
                    </div>
                </div>
            </div>
            {/* right side */}
            <div className='flex-1'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
                    <Title text1={"MENU"} />
                    <div className='flex items-center gap-2 bg-gray-100 p-2 rounded-lg'>
                        <span className='text-sm text-gray-600'>Sắp xếp theo:</span>
                        <select
                            onChange={(e) => setSortType(e.target.value)}
                            className='border border-gray-300 text-sm px-3 py-1 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            <option value="relavent">Liên quan</option>
                            <option value="low-high">Giá: Thấp đến cao</option>
                            <option value="high-low">Giá: Cao đến thấp</option>
                        </select>
                    </div>
                </div>

                {/* Map product */}
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                    {
                        currentProducts.map((item, index) => (
                            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} category={item.category} />
                        ))
                    }
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className='flex justify-center items-center gap-2 mt-8'>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md ${currentPage === 1
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-[#0D1321] text-white hover:bg-[#0D1321]'
                                }`}
                        >
                            Trước
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-3 py-1 rounded-md ${currentPage === index + 1
                                    ? 'bg-[#0D1321] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md ${currentPage === totalPages
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-[#0D1321] text-white hover:bg-[#0D1321]'
                                }`}
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Menu