import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { backEndURL, currency } from '../App.jsx';
import RevenueChart from '../components/charts/RevenueChart';
import ProductsChart from '../components/charts/ProductsChart';
import OrderStatusChart from '../components/charts/OrderStatusChart';
import ProductCategoriesChart from '../components/charts/ProductCategoriesChart';

// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [revenueData, setRevenueData] = useState({
        totalRevenue: 0,
        orderCount: 0,
        dailyRevenue: []
    });
    const [topProducts, setTopProducts] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);
    const [productCategories, setProductCategories] = useState([]);
    const [period, setPeriod] = useState('month');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [period]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [revenueRes, productsRes, statusRes, categoriesRes] = await Promise.all([
                axios.get(backEndURL + `/api/stats/revenue?period=${period}`),
                axios.get(backEndURL + `/api/stats/top-products?period=${period}`),
                axios.get(backEndURL + `/api/stats/order-status?period=${period}`),
                axios.get(backEndURL + `/api/product/list?limit=1000`)
            ]);

            setRevenueData(revenueRes.data.data || {
                totalRevenue: 0,
                orderCount: 0,
                dailyRevenue: []
            });
            setTopProducts(productsRes.data.data || []);
            setOrderStatus(statusRes.data.data || []);

            // Tính toán số lượng sản phẩm theo category
            const products = categoriesRes.data.data || [];
            const categoryCount = products.reduce((acc, product) => {
                const category = product.category || 'Không phân loại';
                acc[category] = (acc[category] || 0) + 1;
                return acc;
            }, {});

            const categoryData = Object.entries(categoryCount).map(([category, count]) => ({
                category,
                count
            }));
            setProductCategories(categoryData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                <p className="text-lg font-semibold">{error}</p>
                <button
                    onClick={fetchData}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            {/* Period Selector */}
            <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Tổng Quan</h1>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="day">Hôm nay</option>
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="year">Năm nay</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
                <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Tổng doanh thu</h3>
                    <p className="text-lg sm:text-2xl font-bold text-gray-800">
                        {revenueData.totalRevenue.toLocaleString('vi-VN')} {currency}
                    </p>
                </div>
                <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Số đơn hàng</h3>
                    <p className="text-lg sm:text-2xl font-bold text-gray-800">{revenueData.orderCount}</p>
                </div>
                <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Sản phẩm bán chạy</h3>
                    <p className="text-lg sm:text-2xl font-bold text-gray-800">{topProducts.length}</p>
                </div>
                <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Danh mục sản phẩm</h3>
                    <p className="text-lg sm:text-2xl font-bold text-gray-800">{productCategories.length}</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                {/* Revenue Chart */}
                <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-4">Doanh Thu</h3>
                    <div className="h-[250px] sm:h-[300px] md:h-[400px]">
                        <RevenueChart data={revenueData.dailyRevenue} />
                    </div>
                </div>

                {/* Top Products Chart */}
                <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-4">Sản Phẩm Bán Chạy</h3>
                    <div className="h-[250px] sm:h-[300px] md:h-[400px]">
                        <ProductsChart data={topProducts} />
                    </div>
                </div>

                {/* Order Status Chart */}
                <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-4">Trạng Thái Đơn Hàng</h3>
                    <div className="h-[250px] sm:h-[300px] md:h-[400px]">
                        <OrderStatusChart data={orderStatus} />
                    </div>
                </div>

                {/* Product Categories Chart */}
                <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-4">Danh Mục Sản Phẩm</h3>
                    <div className="h-[250px] sm:h-[300px] md:h-[400px]">
                        <ProductCategoriesChart data={productCategories} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
