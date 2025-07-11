import React from 'react';
import { Line } from 'react-chartjs-2';

const RevenueChart = ({ data }) => {
    // Đảm bảo data là array
    const revenueData = Array.isArray(data) ? data : [];

    const chartData = {
        labels: revenueData.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        }),
        datasets: [
            {
                label: 'Doanh thu',
                data: revenueData.map(item => item.amount),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        return `Doanh thu: ${context.parsed.y.toLocaleString('vi-VN')} VNĐ`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#6B7280'
                }
            },
            y: {
                grid: {
                    color: '#E5E7EB'
                },
                ticks: {
                    color: '#6B7280',
                    callback: function (value) {
                        return value.toLocaleString('vi-VN') + ' VNĐ';
                    }
                }
            }
        }
    };

    return (
        <div className="w-full h-full">
            {revenueData.length > 0 ? (
                <Line data={chartData} options={options} />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <p className="text-gray-500">Không có dữ liệu doanh thu</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevenueChart;
