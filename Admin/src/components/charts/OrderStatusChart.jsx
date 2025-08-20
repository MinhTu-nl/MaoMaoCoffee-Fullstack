import React from 'react';
import { Doughnut } from 'react-chartjs-2';

// Biểu đồ trạng thái đơn hàng, nhận dữ liệu từ server (có thể từ file hoặc database phía backend)
const OrderStatusChart = ({ data }) => {
    // Đảm bảo data là array
    const statusData = Array.isArray(data) ? data : [];

    const statusColors = {
        'Pending': '#FCD34D',
        'Processing': '#3B82F6',
        'Shipped': '#8B5CF6',
        'Delivered': '#10B981',
        'Cancelled': '#EF4444'
    };

    const chartData = {
        labels: statusData.map(item => item.status),
        datasets: [
            {
                data: statusData.map(item => item.count),
                backgroundColor: statusData.map(item => statusColors[item.status] || '#6B7280'),
                borderColor: '#fff',
                borderWidth: 2,
                hoverOffset: 4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                callbacks: {
                    label: function (context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return `${context.label}: ${context.parsed} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className="w-full h-full">
            {statusData.length > 0 ? (
                <Doughnut data={chartData} options={options} />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <p className="text-gray-500">Không có dữ liệu đơn hàng</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderStatusChart;
