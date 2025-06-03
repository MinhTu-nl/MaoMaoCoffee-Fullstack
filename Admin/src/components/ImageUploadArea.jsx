import React from 'react';
import { assets } from '../assets/assets';

const ImageUploadArea = ({ image, onChange, onRemove }) => (
    <div className="relative group w-24 aspect-square">
        <label className="block cursor-pointer w-full h-full">
            <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden hover:border-blue-400 transition-colors w-full h-full">
                {image ? (
                    <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <img src={assets.upload_area} alt="Upload" className="w-10 h-10 mb-2" />
                        <span className="text-sm">Upload</span>
                    </div>
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onChange}
            />
        </label>
        {onRemove && (
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition-colors"
                title="Remove"
            >
                &times;
            </button>
        )}
    </div>
);

export default ImageUploadArea; 