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
import RevenueChart from './charts/RevenueChart';
import ProductsChart from './charts/ProductsChart';
import OrderStatusChart from './charts/OrderStatusChart';
import ProductCategoriesChart from './charts/ProductCategoriesChart';

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
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="day">Hôm nay</option>
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="year">Năm nay</option>
                </select>

                <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Tổng doanh thu</h3>
                        <p className="text-2xl font-bold">{revenueData.totalRevenue.toLocaleString()} {currency}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Số đơn hàng</h3>
                        <p className="text-2xl font-bold">{revenueData.orderCount}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RevenueChart data={revenueData} />
                <ProductsChart data={topProducts} />
                <OrderStatusChart data={orderStatus} />
                <ProductCategoriesChart data={productCategories} />
            </div>
        </div>
    );
};

export default Dashboard; 