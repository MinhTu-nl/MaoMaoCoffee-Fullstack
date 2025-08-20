/*
 * Page: NotFoundPage.jsx
 * Purpose: Trang 404 — hiển thị khi route không khớp.
 * Main behavior: Hiển thị message, link quay về trang chủ hoặc trang trước.
 * Inputs: Optional attempted route.
 * Outputs: Giao diện 404.
 * Edge cases: Giữ layout nhất quán, server-side render trả status 404 nếu cần.
 */

import React, { useContext } from 'react';
import { ShopContext } from '../contexts/ShopContext';

const NotFoundPage = () => {
    const { navigate } = useContext(ShopContext);
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
            <div className="text-7xl font-extrabold text-blue-950 mb-4">404</div>
            <div className="text-lg text-gray-700 mb-6 text-center">
                Không tìm thấy trang / Page Not Found
            </div>
            <button
                onClick={() => navigate('/')}
                className="px-5 py-2 bg-blue-950 text-white rounded font-semibold hover:bg-blue-800 transition-colors"
            >
                Quay về Trang Chủ
            </button>
        </div>
    );
};

export default NotFoundPage;
