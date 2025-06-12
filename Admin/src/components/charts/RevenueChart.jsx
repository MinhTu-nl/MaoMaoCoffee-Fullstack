import React from 'react';
import { Line } from 'react-chartjs-2';

const RevenueChart = ({ data }) => {
    const chartData = {
        labels: data?.dailyRevenue?.map(item => item.date) || [],
        datasets: [
            {
                label: 'Doanh thu',
                data: data?.dailyRevenue?.map(item => item.amount) || [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Doanh thu theo thời gian</h2>
            {data.dailyRevenue.length > 0 ? (
                <Line data={chartData} />
            ) : (
                <p className="text-center text-gray-500">Không có dữ liệu</p>
            )}
        </div>
    );
};

export default RevenueChart;
