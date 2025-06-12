import React from 'react';
import { Pie } from 'react-chartjs-2';

const OrderStatusChart = ({ data }) => {
    const chartData = {
        labels: data?.map(status => status.status) || [],
        datasets: [
            {
                data: data?.map(status => status.count) || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)'
                ]
            }
        ]
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Trạng thái đơn hàng</h2>
            {data.length > 0 ? (
                <Pie data={chartData} />
            ) : (
                <p className="text-center text-gray-500">Không có dữ liệu</p>
            )}
        </div>
    );
};

export default OrderStatusChart;
