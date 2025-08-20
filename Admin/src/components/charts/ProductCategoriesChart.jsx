import React from 'react';
import { Bar } from 'react-chartjs-2';

// Biểu đồ danh mục sản phẩm, nhận dữ liệu từ server (có thể từ file hoặc database phía backend)
const ProductCategoriesChart = ({ data }) => {
    // Đảm bảo data là array
    const categoriesData = Array.isArray(data) ? data : [];

    const colors = [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 146, 60, 0.8)'
    ];

    const chartData = {
        labels: categoriesData.map(item => item.category?.substring(0, 12) + (item.category?.length > 12 ? '...' : '')),
        datasets: [
            {
                label: 'Số lượng sản phẩm',
                data: categoriesData.map(item => item.count),
                backgroundColor: categoriesData.map((_, index) => colors[index % colors.length]),
                borderColor: categoriesData.map((_, index) => colors[index % colors.length].replace('0.8', '1')),
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
                callbacks: {
                    label: function (context) {
                        const category = categoriesData[context.dataIndex];
                        return `${category.category}: ${context.parsed} sản phẩm`;
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
            {categoriesData.length > 0 ? (
                <Bar data={chartData} options={options} />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="text-4xl mb-2">📂</div>
                        <p className="text-gray-500">Không có dữ liệu danh mục</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCategoriesChart; 