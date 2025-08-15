import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
    try {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            console.warn('Cloudinary configuration incomplete. Some features may not work.');
            return;
        }

        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });

        console.log('Cloudinary configured successfully!');
    } catch (error) {
        console.error('Cloudinary configuration error:', error);
        // Don't exit process in production
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
}

export default connectCloudinary;