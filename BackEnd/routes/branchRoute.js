import express from 'express'
import { createBranch, getAllBranches, updateBranch, deleteBranch } from '../controller/branchController.js'
import adminAuth from '../middleware/adminAuth.js'

const router = express.Router()

// Create branch (chỉ admin)
// POST /create - body: { name, location }
router.post('/create', adminAuth, createBranch)

// Get all branches (public)
// GET /list - không cần token
router.get('/list', getAllBranches)

// Update branch (chỉ admin)
// PUT /update/:id - params: id (branch id), body: fields to update
router.put('/update/:id', adminAuth, updateBranch)

// Delete branch (chỉ admin)
// DELETE /delete/:id - params: id (branch id)
router.delete('/delete/:id', adminAuth, deleteBranch)

export default router
