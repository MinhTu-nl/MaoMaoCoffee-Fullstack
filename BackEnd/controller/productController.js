import { v2 as cloudinary } from "cloudinary";
import ProductModel from "../model/productsModel.js";

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        // Validate required fields
        if (!name || !description || !price || !category || !subCategory || !sizes) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        // Parse and validate price object
        let priceMap
        try {
            const priceObj = typeof price === 'string' ? JSON.parse(price) : price
            priceMap = new Map(Object.entries(priceObj))

            // Validate each price is a positive number
            for (const [size, value] of priceMap) {
                const numValue = Number(value)
                if (isNaN(numValue) || numValue <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid price for size ${size}`
                    })
                }
                priceMap.set(size, numValue)
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price format'
            })
        }

        // Handle images
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one image is required'
            })
        }

        const images = []
        for (const key in req.files) {
            if (req.files[key] && req.files[key][0]) {
                images.push(req.files[key][0])
            }
        }

        // Upload images to Cloudinary
        const imageUrls = await Promise.all(
            images.map(async (image) => {
                try {
                    const result = await cloudinary.uploader.upload(image.path, {
                        resource_type: 'image',
                        folder: 'products'
                    })
                    return result.secure_url
                } catch (error) {
                    console.error(`Error uploading image: ${error.message}`)
                    throw new Error('Failed to upload image')
                }
            })
        )

        // Parse sizes if it's a string
        let parsedSizes
        try {
            parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes
            if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
                throw new Error('Sizes must be a non-empty array')
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid sizes format'
            })
        }

        const productData = {
            name,
            description,
            price: priceMap,
            category,
            subCategory,
            bestseller: bestseller === 'true',
            sizes: parsedSizes,
            images: imageUrls,
            date: Date.now()
        }

        const product = new ProductModel(productData)
        await product.save()

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            data: {
                ...product.toObject(),
                price: Object.fromEntries(product.price)
            }
        })

    } catch (e) {
        console.error('Error adding product:', e)
        res.status(500).json({
            success: false,
            message: e.message || 'Error adding product'
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        // Find product by ID
        const product = await ProductModel.findById(id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        // Prepare update data
        const updateData = {}

        // Update basic fields if provided
        if (name) updateData.name = name
        if (description) updateData.description = description
        if (category) updateData.category = category
        if (subCategory) updateData.subCategory = subCategory
        if (bestseller !== undefined) updateData.bestseller = bestseller === 'true'

        // Handle price updates
        if (price) {
            try {
                const priceObj = typeof price === 'string' ? JSON.parse(price) : price
                const priceMap = new Map(Object.entries(priceObj))

                // Validate each price is a positive number
                for (const [size, value] of priceMap) {
                    const numValue = Number(value)
                    if (isNaN(numValue) || numValue <= 0) {
                        return res.status(400).json({
                            success: false,
                            message: `Invalid price for size ${size}`
                        })
                    }
                    priceMap.set(size, numValue)
                }
                updateData.price = priceMap
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid price format'
                })
            }
        }

        // Handle sizes updates
        if (sizes) {
            try {
                const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes
                if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
                    throw new Error('Sizes must be a non-empty array')
                }
                updateData.sizes = parsedSizes
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid sizes format'
                })
            }
        }

        // Handle image updates if new images are provided
        if (req.files && Object.keys(req.files).length > 0) {
            const images = []
            for (const key in req.files) {
                if (req.files[key] && req.files[key][0]) {
                    images.push(req.files[key][0])
                }
            }

            // Upload new images to Cloudinary
            const imageUrls = await Promise.all(
                images.map(async (image) => {
                    try {
                        const result = await cloudinary.uploader.upload(image.path, {
                            resource_type: 'image',
                            folder: 'products'
                        })
                        return result.secure_url
                    } catch (error) {
                        console.error(`Error uploading image: ${error.message}`)
                        throw new Error('Failed to upload image')
                    }
                })
            )

            // If new images are provided, replace all existing images
            if (imageUrls.length > 0) {
                updateData.images = imageUrls
            }
        }

        // Update the product
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        )

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: {
                ...updatedProduct.toObject(),
                price: Object.fromEntries(updatedProduct.price)
            }
        })

    } catch (e) {
        console.error('Error updating product:', e)
        res.status(500).json({
            success: false,
            message: e.message || 'Error updating product'
        })
    }
}

const listProduct = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            subCategory,
            bestseller,
            sortBy = 'date',
            sortOrder = 'desc',
            search
        } = req.query

        // Build query
        const query = {}

        // Add filters
        if (category) query.category = category
        if (subCategory) query.subCategory = subCategory
        if (bestseller !== undefined) query.bestseller = bestseller === 'true'

        // Add search
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit)

        // Build sort object
        const sort = {}
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1

        // Execute query with pagination and sorting
        const products = await ProductModel.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))

        // Get total count for pagination
        const total = await ProductModel.countDocuments(query)

        // Transform price Map to object in response
        const transformedProducts = products.map(product => ({
            ...product.toObject(),
            price: Object.fromEntries(product.price)
        }))

        res.json({
            success: true,
            data: transformedProducts,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        })

    } catch (e) {
        console.error('Error listing products:', e)
        res.status(500).json({
            success: false,
            message: e.message || 'Error listing products'
        })
    }
}

const removeProduct = async (req, res) => {
    try {
        const { id } = req.params

        // Validate ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format"
            })
        }

        // Find and delete product
        const product = await ProductModel.findByIdAndDelete(id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        // Delete images from Cloudinary if needed
        if (product.images && product.images.length > 0) {
            try {
                await Promise.all(
                    product.images.map(async (imageUrl) => {
                        const publicId = imageUrl.split('/').pop().split('.')[0]
                        await cloudinary.uploader.destroy(publicId)
                    })
                )
            } catch (error) {
                console.error('Error deleting images from Cloudinary:', error)
                // Continue with product deletion even if image deletion fails
            }
        }

        res.json({
            success: true,
            message: "Product removed successfully",
            data: {
                ...product.toObject(),
                price: Object.fromEntries(product.price)
            }
        })

    } catch (e) {
        console.error('Error removing product:', e)
        res.status(500).json({
            success: false,
            message: e.message || 'Error removing product'
        })
    }
}

const singleProduct = async (req, res) => {
    try {
        const { id } = req.params

        // Validate ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format"
            })
        }

        // Find product with error handling
        const product = await ProductModel.findById(id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        // Transform price Map to object
        const transformedProduct = {
            ...product.toObject(),
            price: Object.fromEntries(product.price)
        }

        res.json({
            success: true,
            data: transformedProduct
        })

    } catch (e) {
        console.error('Error fetching product:', e)
        res.status(500).json({
            success: false,
            message: e.message || 'Error fetching product'
        })
    }
}

export { addProduct, updateProduct, listProduct, removeProduct, singleProduct }