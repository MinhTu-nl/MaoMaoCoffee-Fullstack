import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import { assets } from '../assets/assets'
import ProductItem from '../components/ProductItem'
import Title from '../components/Title'
import { useLocation } from 'react-router-dom'
import MarqueeStrip from '../components/MarqueeStrip'

const Menu = () => {
    // Lấy dữ liệu từ ShopContext
    const { products, search, showSearch } = useContext(ShopContext)
    const location = useLocation();

    // State quản lý hiển thị filter và sản phẩm đã lọc
    const [showFilter, setShowFilter] = useState(false)
    const [filterProducts, setFilterProduct] = useState([])

    // State quản lý phân trang
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 20

    // State quản lý filter
    const [category, setCategory] = useState([]) // Lọc theo danh mục chính
    const [subCategory, setSubCategory] = useState([]) // Lọc theo danh mục phụ
    const [sortType, setSortType] = useState('relavent') // Sắp xếp sản phẩm

    // Đọc query string để setCategory khi vào trang
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('category');
        if (cat) {
            setCategory([cat]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location.search]);

    // Hàm xử lý chọn/bỏ chọn danh mục chính
    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item != e.target.value))
        } else {
            setCategory(prev => [...prev, e.target.value])
        }
    }


    // Hàm xử lý chọn/bỏ chọn danh mục phụ
    const toggleSubCategory = (e) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter(item => item != e.target.value))
        } else {
            setSubCategory(prev => [...prev, e.target.value])
        }
    }

    // Hàm áp dụng bộ lọc cho sản phẩm
    const applyFilter = () => {
        let productCopy = products.slice();
        // Lọc theo từ khóa tìm kiếm
        if (showSearch && search) {
            productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        }
        // Lọc theo danh mục chính
        if (category.length > 0) {
            productCopy = productCopy.filter(item => category.includes(item.category));
        }
        // Lọc theo danh mục phụ
        if (subCategory.length > 0) {
            productCopy = productCopy.filter(item => subCategory.includes(item.subCategory));
        }
        setFilterProduct(productCopy)
    }

    // Hàm sắp xếp sản phẩm
    const sortProducts = () => {
        let fpCopy = filterProducts.slice()

        const getPriceForSort = (product) => {
            if (!product || !product.price) return 0;
            if (typeof product.price === 'object') {
                // Lấy giá thấp nhất nếu có nhiều kích thước
                return Math.min(...Object.values(product.price));
            }
            return product.price;
        }

        switch (sortType) {
            case 'low-high':
                setFilterProduct(fpCopy.sort((a, b) => getPriceForSort(a) - getPriceForSort(b)))
                break
            case 'high-low':
                setFilterProduct(fpCopy.sort((a, b) => getPriceForSort(b) - getPriceForSort(a)))
                break
            default:
                applyFilter();
                break
        }
    }

    // Effect để sắp xếp sản phẩm khi thay đổi kiểu sắp xếp
    useEffect(() => {
        sortProducts()
    }, [sortType])

    // Effect để áp dụng bộ lọc khi thay đổi danh mục hoặc từ khóa tìm kiếm
    useEffect(() => {
        applyFilter()
    }, [category, subCategory, search, showSearch, products])

    // Tính toán phân trang
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    const totalPages = Math.ceil(filterProducts.length / productsPerPage)

    // Hàm xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
            <MarqueeStrip />
            <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-blue-950'>
                {/* Phần bộ lọc bên trái */}
                <div className='min-w-60'>
                    <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>BỘ LỌC
                        <img className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`} src={assets.dropdown_icon} alt="" />
                    </p>

                    {/* Bộ lọc danh mục phụ */}
                    <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
                        <p className='mb-3 text-sm font-medium'>Loại</p>
                        <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                            <p className='flex gap-2'>
                                <input
                                    type="checkbox"
                                    className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-blue-950 checked:border-blue-950 cursor-pointer'
                                    onChange={toggleSubCategory}
                                    value={"drink"}
                                /> Đồ Uống
                            </p>
                            <p className='flex gap-2'>
                                <input
                                    type="checkbox"
                                    className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-blue-950 checked:border-blue-950 cursor-pointer'
                                    onChange={toggleSubCategory}
                                    value={"dessert"}
                                /> Tráng Miệng
                            </p>
                        </div>
                    </div>

                    {/* Bộ lọc danh mục chính - Đồ uống */}
                    <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
                        <p className='mb-3 text-sm font-medium'>CÁC LOẠI NƯỚC UỐNG</p>
                        <div className='flex flex-col gap-2 text-sm font-light text-blue-950'>
                            <p className='flex gap-2'>
                                <input
                                    type="checkbox"
                                    onChange={toggleCategory}
                                    className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-blue-950 checked:border-blue-950 cursor-pointer'
                                    value={"coffee"}
                                    checked={category.includes('coffee')}
                                /> Cà Phê
                            </p>
                            <p className='flex gap-2'>
                                <input
                                    type="checkbox"
                                    onChange={toggleCategory}
                                    className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-blue-950 checked:border-blue-950 cursor-pointer'
                                    value={"coldbew"}
                                    checked={category.includes('coldbew')}
                                /> Cold Brew
                            </p>
                            <p className='flex gap-2'>
                                <input
                                    type="checkbox"
                                    onChange={toggleCategory}
                                    className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-blue-950 checked:border-blue-950 cursor-pointer'
                                    value={"tea"}
                                    checked={category.includes('tea')}
                                /> Trà
                            </p>
                            <p className='flex gap-2'>
                                <input
                                    type="checkbox"
                                    onChange={toggleCategory}
                                    className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-blue-950 checked:border-blue-950 cursor-pointer'
                                    value={"milk"}
                                    checked={category.includes('milk')}
                                /> Trà Sữa
                            </p>
                            <p className='flex gap-2'>
                                <input
                                    type="checkbox"
                                    onChange={toggleCategory}
                                    className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-blue-950 checked:border-blue-950 cursor-pointer'
                                    value={"ice"}
                                    checked={category.includes('ice')}
                                /> Đá Xay
                            </p>
                        </div>
                    </div>

                    {/* Bộ lọc danh mục chính - Bánh */}
                    <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
                        <p className='mb-3 text-sm font-medium'>CÁC LOẠI BÁNH</p>
                        <div className='flex flex-col gap-2 text-sm font-light text-blue-950'>
                            <p className='flex gap-2'>
                                <input
                                    type="checkbox"
                                    onChange={toggleCategory}
                                    className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-blue-950 checked:border-blue-950 cursor-pointer'
                                    value={"croffle"}
                                />Bánh Croffle
                            </p>
                            <p className='flex gap-2'>
                                <input
                                    type="checkbox"
                                    onChange={toggleCategory}
                                    className='w-4 h-4 rounded-full appearance-none border-2 border-gray-300 checked:bg-blue-950 checked:border-blue-950 cursor-pointer'
                                    value={"toast"}
                                /> Bánh Mì Nướng
                            </p>
                        </div>
                    </div>
                </div>

                {/* Phần hiển thị sản phẩm bên phải */}
                <div className='flex-1'>
                    {/* Tiêu đề và bộ sắp xếp */}
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

                    {/* Hiển thị danh sách sản phẩm - Đã chỉnh sửa grid cho mobile */}
                    <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 justify-items-center max-w-7xl mx-auto'>
                        {
                            currentProducts.map((item, index) => (
                                <div key={index} className="w-full max-w-[180px] sm:max-w-none">
                                    <ProductItem id={item._id} images={item.images} name={item.name} price={item.price} category={item.category} />
                                </div>
                            ))
                        }
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className='flex justify-center items-center gap-2 mt-8'>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md ${currentPage === 1
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-950 text-white hover:bg-blue-950'
                                    }`}
                            >
                                Trước
                            </button>

                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-3 py-1 rounded-md ${currentPage === index + 1
                                        ? 'bg-blue-950 text-white'
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
                                    : 'bg-blue-950 text-white hover:bg-blue-950'
                                    }`}
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Menu