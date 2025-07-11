import React from 'react';
import { Bar } from 'react-chartjs-2';

const ProductsChart = ({ data }) => {
    // Đảm bảo data là array
    const productsData = Array.isArray(data) ? data : [];

    const chartData = {
        labels: productsData.map(item => item.name?.substring(0, 15) + (item.name?.length > 15 ? '...' : '')),
        datasets: [
            {
                label: 'Số lượng bán',
                data: productsData.map(item => item.quantity),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1,
                borderRadius: 4
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
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        const product = productsData[context.dataIndex];
                        return [
                            `Sản phẩm: ${product.name}`,
                            `Số lượng: ${product.quantity}`,
                            `Doanh thu: ${product.revenue?.toLocaleString('vi-VN')} VNĐ`
                        ];
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
                    color: '#6B7280',
                    maxRotation: 45
                }
            },
            y: {
                grid: {
                    color: '#E5E7EB'
                },
                ticks: {
                    color: '#6B7280',
                    beginAtZero: true
                }
            }
        }
    };

    return (
        <div className="w-full h-full">
            {productsData.length > 0 ? (
                <Bar data={chartData} options={options} />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="text-4xl mb-2">📈</div>
                        <p className="text-gray-500">Không có dữ liệu sản phẩm</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsChart;
