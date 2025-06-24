import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const ShopContext = createContext()

const ShopContextProvider = (props) => {
    // Backend
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const [products, setProducts] = useState([])
    const [token, setToken] = useState('')

    // Frontend
    const currency = 'VNĐ'
    const delivery_fee = 30000
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState(() => {
        // Try to get cart items from localStorage first
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : {};
    });
    const navigate = useNavigate()

    // Update localStorage whenever cartItems changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // CART PAGE
    const addToCart = async (itemId, sizes) => {
        try {
            // Validate input
            if (!itemId || !sizes) {
                toast.error('Thông tin sản phẩm không hợp lệ');
                return;
            }

            // Check if product exists
            const productExists = products.find(product => product._id === itemId);
            if (!productExists) {
                toast.error('Sản phẩm không tồn tại');
                return;
            }

            // Check if size is valid for the product
            if (productExists.sizes && !productExists.sizes.includes(sizes)) {
                toast.error('Kích cỡ không hợp lệ cho sản phẩm này');
                return;
            }

            let cartData = structuredClone(cartItems);

            if (cartData[itemId]) {
                if (cartData[itemId][sizes]) {
                    cartData[itemId][sizes] += 1;
                } else {
                    cartData[itemId][sizes] = 1;
                }
            } else {
                cartData[itemId] = {};
                cartData[itemId][sizes] = 1;
            }

            setCartItems(cartData);

            // Only make API call if user is logged in
            if (token) {
                try {
                    const response = await axios.post(
                        backendURL + `/api/cart/add`,
                        { itemId, sizes },
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    if (response.data.success) {
                        toast.success('Đã thêm vào giỏ hàng');
                    } else {
                        toast.error(response.data.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
                    }
                } catch (error) {
                    console.error('Add to cart API error:', error);
                    if (error.response?.status === 401) {
                        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                    } else {
                        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
                    }
                }
            } else {
                toast.success('Đã thêm vào giỏ hàng');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
        }
    }

    const updateQuantity = async (itemId, sizes, quantity) => {
        try {
            // Validate input
            if (!itemId || !sizes || quantity === undefined) {
                toast.error('Thông tin cập nhật không hợp lệ');
                return;
            }

            // Validate quantity
            if (quantity < 0) {
                toast.error('Số lượng không thể âm');
                return;
            }

            // Check if product exists
            const productExists = products.find(product => product._id === itemId);
            if (!productExists) {
                toast.error('Sản phẩm không tồn tại');
                return;
            }

            // Check if item exists in cart
            if (!cartItems[itemId] || !cartItems[itemId][sizes]) {
                toast.error('Sản phẩm không có trong giỏ hàng');
                return;
            }

            let cartData = structuredClone(cartItems);

            // If quantity is 0, remove the item
            if (quantity === 0) {
                delete cartData[itemId][sizes];
                // If no more sizes for this item, remove the item completely
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            } else {
                cartData[itemId][sizes] = quantity;
            }

            setCartItems(cartData);

            // Only make API call if user is logged in
            if (token) {
                try {
                    const response = await axios.post(
                        backendURL + `/api/cart/update`,
                        { itemId, sizes, quantity },
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    if (response.data.success) {
                        toast.info('Đã cập nhật giỏ hàng');
                    } else {
                        toast.error(response.data.message || 'Có lỗi xảy ra khi cập nhật giỏ hàng');
                    }
                } catch (error) {
                    console.error('Update cart API error:', error);
                    if (error.response?.status === 401) {
                        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                    } else {
                        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật giỏ hàng');
                    }
                }
            } else {
                toast.success('Đã cập nhật giỏ hàng');
            }
        } catch (error) {
            console.error('Update cart error:', error);
            toast.error('Có lỗi xảy ra khi cập nhật giỏ hàng');
        }
    }

    const getCartCount = () => {
        try {
            let totalCount = 0;

            // Check if cartItems is valid
            if (!cartItems || typeof cartItems !== 'object') {
                console.warn('Invalid cart items data');
                return 0;
            }

            // Iterate through cart items
            for (const itemId in cartItems) {
                const itemSizes = cartItems[itemId];

                // Check if item exists in products
                const productExists = products.find(product => product._id === itemId);
                if (!productExists) {
                    continue;
                }

                // Sum up quantities for all sizes
                for (const size in itemSizes) {
                    const quantity = itemSizes[size];

                    // Validate quantity
                    if (typeof quantity === 'number' && quantity > 0) {
                        totalCount += quantity;
                    } else {
                        console.warn(`Invalid quantity for item ${itemId}, size ${size}`);
                    }
                }
            }

            return totalCount;
        } catch (error) {
            console.error('Error calculating cart count:', error);
            return 0;
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0

        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items)
            if (itemInfo) {
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
            } else {
                console.warn(`Product with ID ${items} not found in products list. Skipping calculation.`);
            }
        }
        return totalAmount
    }


    // USER
    const getUserCart = async () => {
        try {
            // Check if user is logged in
            if (!token) {
                return;
            }

            const response = await axios.get(
                backendURL + `/api/cart/get`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                // Validate cart data before setting
                const cartData = response.data.cartData;
                if (cartData && typeof cartData === 'object') {
                    // Verify each item in cart exists in products
                    const validCartData = {};
                    for (const itemId in cartData) {
                        const productExists = products.find(product => product._id === itemId);
                        if (productExists) {
                            validCartData[itemId] = cartData[itemId];
                        } else {
                            console.warn(`Product ${itemId} not found in products list`);
                        }
                    }
                    setCartItems(validCartData);
                    toast.success('Đã cập nhật giỏ hàng');
                } else {
                    console.warn('Invalid cart data received from server');
                    setCartItems({});
                }
            } else {
                toast.error(response.data.message || 'Có lỗi xảy ra khi lấy thông tin giỏ hàng');
            }
        } catch (error) {
            console.error('Get user cart error:', error);
            if (error.response?.status === 401) {
                toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                // Có thể thêm logic để redirect về trang login nếu cần
                // navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin giỏ hàng');
            }
            setCartItems({});
        }
    }

    const getProductData = async () => {
        try {
            const res = await axios.get(backendURL + `/api/product/list?limit=1000`)

            if (res.data.success) {
                setProducts(res.data.data);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    // Fetch products when component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                await getProductData();
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []); // Empty dependency array as we only want to fetch on mount

    // Handle token and cart initialization
    useEffect(() => {
        const initializeUserData = async () => {
            const storedToken = localStorage.getItem('token');

            if (storedToken) {
                try {
                    setToken(storedToken);
                    await getUserCart();
                    const bacXiuProduct = products.find(p => p.name === 'CÀ PHÊ BẠC XỈU');
                    if (bacXiuProduct) {
                        console.log('CÀ PHÊ BẠC XỈU product data:', bacXiuProduct);
                    }
                } catch (error) {
                    console.error('Error initializing user data:', error);
                    // Clear invalid token
                    localStorage.removeItem('token');
                    setToken('');
                    setCartItems({});
                }
            }
        };

        initializeUserData();
    }, []); // Empty dependency array as we only want to initialize on mount

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart, getCartCount,
        updateQuantity, getCartAmount, navigate, getUserCart,
        getProductData, backendURL, token, setToken,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;