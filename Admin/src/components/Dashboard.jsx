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
import OrderStatusChart from './charts/OrderStatusChart';
import ProductCategoriesChart from './charts/ProductCategoriesChart';

// Card tổng quan không icon
const Card = ({ title, value, subtitle }) => (
    <div className="bg-white border-b border-gray-200 px-2 py-2 flex flex-col items-center justify-center min-h-[44px]">
        <div className="text-[11px] text-gray-500 font-semibold mb-0.5">{title}</div>
        <div className="text-base font-bold text-blue-950 mb-0.5">{value}</div>
        {subtitle && <div className="text-[10px] text-gray-400">{subtitle}</div>}
    </div>
);

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
    const [orderStatus, setOrderStatus] = useState([]);
    const [productCategories, setProductCategories] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
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

            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [revenueRes, statusRes, categoriesRes, productsRes, usersRes] = await Promise.all([
                axios.get(backEndURL + `/api/stats/revenue?period=${period}`, { headers }),
                axios.get(backEndURL + `/api/stats/order-status?period=${period}`, { headers }),
                axios.get(backEndURL + `/api/product/list?limit=1000`, { headers }),
                axios.get(backEndURL + `/api/product/list?limit=1`, { headers }),
                axios.get(backEndURL + `/api/user/list`, { headers })
            ]);

            setRevenueData(revenueRes.data.data || {
                totalRevenue: 0,
                orderCount: 0,
                dailyRevenue: []
            });
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

            // Lấy tổng số sản phẩm
            setTotalProducts(productsRes.data.pagination?.total || 0);

            // Lấy tổng số người dùng
            setTotalUsers(usersRes.data.users?.length || 0);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh mục nhiều sản phẩm nhất
    const topCategory = productCategories.length > 0 ? productCategories.reduce((a, b) => a.count > b.count ? a : b) : null;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                <div className="text-gray-400 text-lg">Đang tải dữ liệu...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <div className="text-red-500 text-2xl font-bold mb-2">{error}</div>
                <button
                    onClick={fetchData}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            {/* Bộ lọc & Card tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
                <div className="bg-white border-b border-gray-200 px-2 py-2 flex flex-col items-center justify-center min-h-[44px]">
                    <div className="text-[11px] text-gray-500 font-semibold mb-0.5">Chọn thời gian</div>
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="mt-1 px-2 py-1 border border-gray-200 rounded text-[13px] font-semibold text-blue-950 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-400 text-center"
                    >
                        <option value="day">Hôm nay</option>
                        <option value="week">Tuần này</option>
                        <option value="month">Tháng này</option>
                        <option value="year">Năm nay</option>
                    </select>
                </div>
                <Card title="Tổng doanh thu" value={revenueData.totalRevenue.toLocaleString('vi-VN') + ' ' + currency} />
                <Card title="Số đơn hàng" value={revenueData.orderCount} />
                <Card title="Tổng sản phẩm" value={totalProducts} />
                <Card title="Tổng người dùng" value={totalUsers} />
                <Card title="Danh mục nhiều SP" value={topCategory ? topCategory.category : 'Không có'} subtitle={topCategory ? topCategory.count + ' sản phẩm' : ''} />
            </div>
            {/* Biểu đồ doanh thu */}
            <div className="bg-white rounded-xl shadow p-6 mb-8">
                <div className="text-lg font-semibold mb-4">Doanh thu theo thời gian</div>
                <div className="h-80">
                    <RevenueChart data={revenueData.dailyRevenue} />
                </div>
            </div>
            {/* 2 biểu đồ nhỏ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow p-4 h-80 flex flex-col">
                    <div className="font-semibold mb-2">Trạng thái đơn hàng</div>
                    <div className="flex-1"><OrderStatusChart data={orderStatus} /></div>
                </div>
                <div className="bg-white rounded-xl shadow p-4 h-80 flex flex-col">
                    <div className="font-semibold mb-2">Danh mục sản phẩm</div>
                    <div className="flex-1"><ProductCategoriesChart data={productCategories} /></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 