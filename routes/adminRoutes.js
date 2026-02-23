import express from 'express';
import { createUser, getUsers, deactivateUser } from '../controllers/adminController.js';

const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);
router.delete('/users/:userId', deactivateUser);

export default router;