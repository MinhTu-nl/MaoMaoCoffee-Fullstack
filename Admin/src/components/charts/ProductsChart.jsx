import React from 'react';
import { Bar } from 'react-chartjs-2';

const ProductsChart = ({ data }) => {
    const chartData = {
        labels: data?.map(product => product.name) || [],
        datasets: [
            {
                label: 'Số lượng bán',
                data: data?.map(product => product.quantity) || [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }
        ]
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Top sản phẩm bán chạy</h2>
            {data.length > 0 ? (
                <Bar data={chartData} />
            ) : (
                <p className="text-center text-gray-500">Không có dữ liệu</p>
            )}
        </div>
    );
};

export default ProductsChart;
