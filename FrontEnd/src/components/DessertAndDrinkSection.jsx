import React from 'react';
import Title from './Title';
import ServiceCard from './ServiceCard';
import { assets } from '../assets/assets';

const DessertAndDrinkSection = () => {
    const items = [
        {
            title: "Desserts",
            description: "Khám phá bộ sưu tập bánh ngọt và tráng miệng đa dạng của chúng tôi, từ những chiếc bánh nướng mềm mại đến kem tươi mát.",
            iconSrc: assets.desert_icon, // Placeholder icon path
            buttonText: "Explore Desserts",
        },
        {
            title: "Drinks",
            description: "Thưởng thức các loại đồ uống phong phú từ cà phê đậm đà, trà thanh mát đến sinh tố trái cây tươi ngon.",
            iconSrc: assets.drink_icon, // Placeholder icon path
            buttonText: "Order Drinks",
        },
    ];

    return (
        <div className='my-6 md:my-10 px-4 md:px-6 lg:px-8'>
            <div className='text-center py-6 md:py-8'>
                <Title
                    text1={"Khám phá thực đơn của chúng tôi"}
                    text2={
                        "Khám phá các lựa chọn đa dạng từ món tráng miệng ngọt ngào đến đồ uống giải khát, phù hợp cho mọi sở thích."
                    }
                />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 justify-items-stretch max-w-7xl mx-auto'>
                {items.map((item, index) => (
                    <ServiceCard
                        key={index}
                        title={item.title}
                        description={item.description}
                        iconSrc={item.iconSrc}
                        buttonText={item.buttonText}
                    />
                ))}
            </div>
        </div>
    );
};

export default DessertAndDrinkSection; 