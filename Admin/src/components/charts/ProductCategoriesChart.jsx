import React from 'react';
import { Pie } from 'react-chartjs-2';

const ProductCategoriesChart = ({ data }) => {
    const chartData = {
        labels: data?.map(item => item.category) || [],
        datasets: [
            {
                data: data?.map(item => item.count) || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(199, 199, 199, 0.5)',
                    'rgba(83, 102, 255, 0.5)'
                ]
            }
        ]
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Số lượng sản phẩm theo loại</h2>
            {data.length > 0 ? (
                <Pie data={chartData} />
            ) : (
                <p className="text-center text-gray-500">Không có dữ liệu</p>
            )}
        </div>
    );
};

export default ProductCategoriesChart; 