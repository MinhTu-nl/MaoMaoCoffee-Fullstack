
import branchModel from '../model/branchModel.js';

// Controller quản lý chi nhánh
// Các hàm sau được gọi từ route tương ứng (Create, Read, Update, Delete)

// Create new branch
export const createBranch = async (req, res) => {
    try {
        // Lấy dữ liệu từ body (name, location)
        const { name, location } = req.body
        const newBranch = new branchModel({
            name,
            location
        })
        // Lưu document mới vào MongoDB
        await newBranch.save()
        // Trả về chi nhánh vừa tạo (status 201)
        res.status(201).json(newBranch)
    } catch (error) {
        // Trả lỗi chung (server error)
        res.status(500).json({ message: error.message })
    }
}

// Get all branches
export const getAllBranches = async (req, res) => {
    try {
        // Lấy tất cả chi nhánh (không có phân trang ở đây)
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
        // findByIdAndUpdate trả về document mới khi { new: true }
        const updatedBranch = await branchModel.findByIdAndUpdate(
            id,
            { name, location },
            { new: true }
        )
        if (!updatedBranch) {
            // Nếu không tìm thấy id tương ứng -> 404
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
        // Xóa theo id
        const deletedBranch = await branchModel.findByIdAndDelete(id)
        if (!deletedBranch) {
            return res.status(404).json({ message: 'Branch not found' })
        }
        res.status(200).json({ message: 'Branch deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
