import express from 'express'
import { createBranch, getAllBranches, updateBranch, deleteBranch } from '../controller/branchController.js'

const router = express.Router()

// Create branch
router.post('/create', createBranch)

// Get all branches
router.get('/list', getAllBranches)

// Update branch
router.put('/update/:id', updateBranch)

// Delete branch
router.delete('/delete/:id', deleteBranch)

export default router
