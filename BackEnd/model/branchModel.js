
import mongoose from 'mongoose'

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const branchModel = mongoose.models.branch || mongoose.model('branch', branchSchema)

export default branchModel
