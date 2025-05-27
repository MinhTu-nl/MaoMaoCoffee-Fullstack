import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10
    },
    price: {
        type: Map,
        of: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v.size > 0;
            },
            message: 'At least one price is required'
        }
    },
    images: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'At least one image is required'
        }
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    subCategory: {
        type: String,
        required: true,
        trim: true
    },
    sizes: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'At least one size is required'
        }
    },
    bestseller: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Number,
        required: true,
        default: () => Date.now()
    },
}, {
    timestamps: true
});

// Add method to get price by size
productSchema.methods.getPriceBySize = function (size) {
    return this.price.get(size) || this.price.get('M'); // Default to M size if size not found
};

const ProductModel = mongoose.models.product || mongoose.model('product', productSchema);
export default ProductModel; 