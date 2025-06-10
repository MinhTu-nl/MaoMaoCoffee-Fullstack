import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {items.map((item, index) => (
                    <li key={index} className="inline-flex items-center">
                        {index > 0 && (
                            <svg
                                className="w-3 h-3 text-gray-400 mx-1"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 9 4-4-4-4"
                                />
                            </svg>
                        )}
                        {index === items.length - 1 ? (
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                to={item.path}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-white"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb; 