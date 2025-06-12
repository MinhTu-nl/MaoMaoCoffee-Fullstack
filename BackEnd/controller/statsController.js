import orderModel from '../model/orderModel.js';
import ProductModel from '../model/productsModel.js';

// Lấy dữ liệu doanh thu theo thời gian
export const getRevenue = async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        const now = new Date();
        let startDate;

        switch (period) {
            case 'day':
                startDate = new Date(now.setHours(0, 0, 0, 0)).getTime();
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7)).getTime();
                break;
            case 'month':
                startDate = new Date(now.setDate(1)).getTime();
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1).getTime();
                break;
            default:
                startDate = new Date(now.setDate(1)).getTime();
        }

        const orders = await orderModel.find({
            date: { $gte: startDate },
            status: 'Delivered'
        });

        const revenue = orders.reduce((total, order) => total + order.amount, 0);
        const orderCount = orders.length;

        const dailyRevenue = orders.reduce((acc, order) => {
            const date = new Date(order.date).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + order.amount;
            return acc;
        }, {});

        res.json({
            success: true,
            data: {
                totalRevenue: revenue,
                orderCount,
                dailyRevenue: Object.entries(dailyRevenue).map(([date, amount]) => ({
                    date,
                    amount
                }))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy dữ liệu top sản phẩm bán chạy
export const getTopProducts = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const { period = 'month' } = req.query;

        const now = new Date();
        let startDate;

        switch (period) {
            case 'day':
                startDate = new Date(now.setHours(0, 0, 0, 0)).getTime();
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7)).getTime();
                break;
            case 'month':
                startDate = new Date(now.setDate(1)).getTime();
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1).getTime();
                break;
            default:
                startDate = new Date(now.setDate(1)).getTime();
        }

        const orders = await orderModel.find({
            date: { $gte: startDate },
            status: 'Delivered'
        });

        const productSales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!productSales[item.name]) {
                    productSales[item.name] = {
                        name: item.name,
                        quantity: 0,
                        revenue: 0
                    };
                }
                productSales[item.name].quantity += item.quantity;
                productSales[item.name].revenue += item.price * item.quantity;
            });
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, parseInt(limit));

        res.json({
            success: true,
            data: topProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy dữ liệu phân loại sản phẩm
export const getCategories = async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        const now = new Date();
        let startDate;

        switch (period) {
            case 'day':
                startDate = new Date(now.setHours(0, 0, 0, 0)).getTime();
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7)).getTime();
                break;
            case 'month':
                startDate = new Date(now.setDate(1)).getTime();
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1).getTime();
                break;
            default:
                startDate = new Date(now.setDate(1)).getTime();
        }

        const orders = await orderModel.find({
            date: { $gte: startDate },
            status: 'Delivered'
        });

        const categoryRevenue = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const category = item.category;
                if (!categoryRevenue[category]) {
                    categoryRevenue[category] = {
                        category,
                        revenue: 0,
                        orderCount: 0
                    };
                }
                categoryRevenue[category].revenue += item.price * item.quantity;
                categoryRevenue[category].orderCount += 1;
            });
        });

        const categoryStats = Object.values(categoryRevenue);

        res.json({
            success: true,
            data: categoryStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy dữ liệu trạng thái đơn hàng
export const getOrderStatus = async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        const now = new Date();
        let startDate;

        switch (period) {
            case 'day':
                startDate = new Date(now.setHours(0, 0, 0, 0)).getTime();
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7)).getTime();
                break;
            case 'month':
                startDate = new Date(now.setDate(1)).getTime();
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1).getTime();
                break;
            default:
                startDate = new Date(now.setDate(1)).getTime();
        }

        const orders = await orderModel.find({
            date: { $gte: startDate }
        });

        const statusCount = {};
        orders.forEach(order => {
            if (!statusCount[order.status]) {
                statusCount[order.status] = 0;
            }
            statusCount[order.status]++;
        });

        const statusStats = Object.entries(statusCount).map(([status, count]) => ({
            status,
            count
        }));

        res.json({
            success: true,
            data: statusStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 