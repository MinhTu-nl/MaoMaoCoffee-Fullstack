import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../contexts/ShopContext'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'
import { toast } from 'react-toastify'
import axios from 'axios'

const Product = () => {
    const { productId } = useParams()
    const { products, currency, addToCart, token, backendURL } = useContext(ShopContext)
    const [productData, setProductData] = useState(null)
    const [images, setImages] = useState('')
    const [sizes, setSizes] = useState('')
    const [price, setPrice] = useState(0)
    const [activeTab, setActiveTab] = useState('description')
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [reviewList, setReviewList] = useState([])
    const [loadingReview, setLoadingReview] = useState(false)

    // Danh sách đánh giá mẫu nếu chưa có đánh giá thực tế
    const sampleReviews = [
        {
            user: { name: 'Minh Tú' },
            rating: 5,
            comment: 'Sản phẩm rất tuyệt vời!',
            createdAt: new Date().toISOString()
        },
        {
            user: { name: 'Vi Danh' },
            rating: 4,
            comment: 'Ngon, sẽ ủng hộ tiếp.',
            createdAt: new Date().toISOString()
        },
        {
            user: { name: 'Nguyễn Văn A' },
            rating: 3,
            comment: 'Ổn, nhưng giao hơi lâu.',
            createdAt: new Date().toISOString()
        }
    ];

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

    // Lấy danh sách đánh giá từ backend (dùng axios)
    const fetchReviews = async () => {
        setLoadingReview(true)
        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const res = await axios.get(backendURL + `/api/review/product/${productId}`, config)
            setReviewList(res.data)
        } catch (err) {
            setReviewList([])
        } finally {
            setLoadingReview(false)
        }
    }

    // Gửi đánh giá (dùng axios)
    const handleSubmitReview = async () => {
        if (!token) {
            toast.error('Bạn cần đăng nhập để gửi đánh giá!')
            return
        }
        if (!rating || !comment) {
            toast.error('Vui lòng nhập đủ thông tin đánh giá!')
            return
        }
        try {
            const res = await axios.post(`${backendURL}/api/review/add`, {
                productId, rating, comment
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            setComment('')
            setRating(0)
            toast.success('Gửi đánh giá thành công!')
            fetchReviews()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gửi đánh giá thất bại')
        }
    }

    // Hàm kiểm tra ObjectId hợp lệ (24 ký tự hex)
    const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

    useEffect(() => {
        fetchProductData();
        // Chỉ fetch review nếu productId hợp lệ và sản phẩm tồn tại
        if (isValidObjectId(productId) && products.find(item => item._id === productId)) {
            fetchReviews();
        } else {
            setReviewList([]);
        }
    }, [productId, products]);

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
                                <img onClick={() => setImages(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' />
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
                                        className={`border py-2 px-4 bg-gray-100 ${item === sizes ? 'border-blue-500' : ''}`}
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
                        <p>Cam kết sản phẩm đúng như hình ảnh</p>
                        <p>Hỗ trợ thanh toán khi nhận hàng</p>
                        <p>Nếu có vấn đề về chất lượng, vui lòng liên hệ trong ngày nhận hàng để được hỗ trợ</p>
                    </div>
                </div>
            </div>

            {/* ----------- Description & Review Section ------------- */}
            <div className='mt-20'>
                <div className='flex border-b'>
                    <button
                        className={`px-5 py-3 text-sm font-bold focus:outline-none transition-colors duration-200 ${activeTab === 'description' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('description')}
                    >
                        Mô tả
                    </button>
                    <button
                        className={`px-5 py-3 text-sm font-bold focus:outline-none transition-colors duration-200 ${activeTab === 'review' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('review')}
                    >
                        Đánh giá
                    </button>
                </div>
                {activeTab === 'description' && (
                    <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500 rounded-b-xl bg-white'>
                        {productData.description ? (
                            <>
                                <p>{productData.description}</p>
                                <hr className='my-2' />
                                <p>Mọi sản phẩm tại MAOMAO đều được chọn lọc kỹ lưỡng, đảm bảo chất lượng và trải nghiệm tốt nhất cho khách hàng. Chúng tôi cam kết mang đến hương vị tuyệt vời và dịch vụ tận tâm trong từng sản phẩm.</p>
                                <hr className='my-2' />
                                <p>Chúng tôi luôn lắng nghe ý kiến đóng góp từ khách hàng để không ngừng hoàn thiện và phát triển sản phẩm, dịch vụ.</p>
                            </>
                        ) : (
                            <>
                                <p>Mọi sản phẩm tại MAOMAO đều được chọn lọc kỹ lưỡng, đảm bảo chất lượng và trải nghiệm tốt nhất cho khách hàng. Chúng tôi cam kết mang đến hương vị tuyệt vời và dịch vụ tận tâm trong từng sản phẩm.</p>
                                <hr className='my-2' />
                                <p>Chúng tôi luôn lắng nghe ý kiến đóng góp từ khách hàng để không ngừng hoàn thiện và phát triển sản phẩm, dịch vụ.</p>
                            </>
                        )}
                    </div>
                )}
                {activeTab === 'review' && (
                    <div className='border px-6 py-6 rounded-b-xl bg-white'>
                        {/* Số sao trung bình & tổng số đánh giá */}
                        <div className='flex items-center gap-2 mb-4'>
                            <span className='text-3xl font-bold text-blue-500'>
                                {(() => {
                                    const allReviews = [...sampleReviews, ...reviewList];
                                    return allReviews.length > 0 ?
                                        (allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / allReviews.length).toFixed(1) : '0';
                                })()}
                            </span>
                            <div className='flex'>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <img key={star} src={assets.star_icon} className='w-5' alt='' />
                                ))}
                            </div>
                            <span className='text-gray-500 ml-2'>({sampleReviews.length + reviewList.length} đánh giá)</span>
                        </div>
                        {/* Danh sách đánh giá */}
                        <div className='flex flex-col gap-4 max-h-60 overflow-y-auto mb-6'>
                            {loadingReview ? (
                                <p className='text-gray-400 italic'>Đang tải đánh giá...</p>
                            ) : (
                                [...sampleReviews, ...reviewList].map((review, idx) => (
                                    <div className='flex gap-3 items-start bg-gray-50 p-3 rounded-lg' key={idx}>
                                        <img src={'https://ui-avatars.com/api/?name=' + encodeURIComponent(review.user?.name || 'User')} className='w-10 h-10 rounded-full' alt='' />
                                        <div>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-semibold'>{review.user?.name || 'Ẩn danh'}</span>
                                                <div className='flex'>
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <img key={star} src={star <= review.rating ? assets.star_icon : assets.star_dull_icon} className='w-4' alt='' />
                                                    ))}
                                                </div>
                                                <span className='text-xs text-gray-400 ml-2'>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <p className='text-gray-700'>{review.comment}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {/* Form gửi đánh giá */}
                        <div className='border-t pt-4 mt-4'>
                            <p className='font-semibold mb-2'>Gửi đánh giá của bạn</p>
                            <div className='flex items-center gap-2 mb-2'>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button key={star} type='button' onClick={() => setRating(star)}>
                                        <img src={star <= rating ? assets.star_icon : assets.star_dull_icon} className='w-6' alt='' />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                className='w-full border rounded p-2 mb-2'
                                rows={3}
                                placeholder='Nhận xét của bạn...'
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            />
                            <button className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600' onClick={handleSubmitReview}>Gửi đánh giá</button>
                        </div>
                    </div>
                )}
            </div>

            <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
        </div>
    );
}

export default Product
