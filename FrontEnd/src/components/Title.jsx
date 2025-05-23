import React from 'react';

const Title = ({ text1, text2 }) => {
    return (
        <div className="text-left mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0d1321] mb-3">
                {text1}
            </h1>
            {text1 && (
                <p className="text-gray-600 dark:text-gray-500 text-base md:text-lg">
                    {text2}
                </p>
            )}
            <div className="w-20 h-0.5 bg-[#0d1321] mt-3 rounded-full"></div>
        </div>
    );
};

export default Title; 