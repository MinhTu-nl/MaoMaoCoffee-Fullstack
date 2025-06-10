import React from 'react';

const ServiceCard = ({ title, description, iconSrc, buttonText, onClick }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
                <img src={iconSrc} alt={title} className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 mb-4">{description}</p>
                <button
                    onClick={onClick}
                    className="bg-[#0D1321] text-white px-6 py-2 rounded-full hover:bg-[#1D2331] transition-colors duration-300"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default ServiceCard; 