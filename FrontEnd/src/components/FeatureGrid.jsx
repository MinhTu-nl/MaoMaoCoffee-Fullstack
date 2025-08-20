import React from 'react';

const features = [
    {
        icon: (
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mx-auto text-blue-100"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
        ),
        title: 'Giao hàng miễn phí tận nơi',
        desc: 'Với đơn hàng trên 200.000đ',
        bg: 'bg-blue-600',
    },
    {
        icon: (
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mx-auto text-blue-100"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z" /></svg>
        ),
        title: 'Giao nhanh 1-3 ngày',
        desc: 'Đóng gói cẩn thận, yêu thương',
        bg: 'bg-blue-800',
    },
    {
        icon: (
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mx-auto text-blue-100"><path d="M12 2C12 2 7 7 7 12C7 16.4183 10.5817 20 15 20C19.4183 20 23 16.4183 23 12C23 7 18 2 12 2Z" /><circle cx="12" cy="12" r="3" /></svg>
        ),
        title: 'Từ hạt đến ly',
        desc: 'Chất lượng từ nguyên liệu tốt nhất',
        bg: 'bg-blue-700',
    },
    {
        icon: (
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mx-auto text-blue-100"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg>
        ),
        title: 'Hỗ trợ tận tâm',
        desc: 'Gọi: 0123 456 789',
        bg: 'bg-blue-900',
    },
];

// FeatureGrid: dữ liệu features được định nghĩa trên file và render bằng map (tĩnh, không side-effect)
const FeatureGrid = () => (
    <section className="w-full grid grid-cols-1 md:grid-cols-4 text-center">
        {features.map((f, i) => (
            <div key={i} className={`${f.bg} px-6 py-10 flex flex-col items-center justify-center min-h-[220px]`}>
                {f.icon}
                <h3 className="mt-4 mb-2 font-bold text-lg text-blue-100">{f.title}</h3>
                <p className="text-blue-100 text-sm opacity-90">{f.desc}</p>
            </div>
        ))}
    </section>
);

export default FeatureGrid;
