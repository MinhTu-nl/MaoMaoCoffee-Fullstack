
import branchModel from '../model/branchModel.js';

// Create new branch
export const createBranch = async (req, res) => {
    try {
        const { name, location } = req.body
        const newBranch = new branchModel({
            name,
            location
        })
        await newBranch.save()
        res.status(201).json(newBranch)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get all branches
export const getAllBranches = async (req, res) => {
    try {
        const branches = await branchModel.find()
        res.status(200).json(branches)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update branch
export const updateBranch = async (req, res) => {
    try {
        const { id } = req.params
        const { name, location } = req.body
        const updatedBranch = await branchModel.findByIdAndUpdate(
            id,
            { name, location },
            { new: true }
        )
        if (!updatedBranch) {
            return res.status(404).json({ message: 'Branch not found' })
        }
        res.status(200).json(updatedBranch)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Delete branch
export const deleteBranch = async (req, res) => {
    try {
        const { id } = req.params
        const deletedBranch = await branchModel.findByIdAndDelete(id)
        if (!deletedBranch) {
            return res.status(404).json({ message: 'Branch not found' })
        }
        res.status(200).json({ message: 'Branch deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
