import express from 'express';
import { checkAuth, isValidAdmin } from '../../middleware';
import {
    fetchHandler,
    createHandler,
    deleteHandler,
} from './controller.js';

const router = express.Router();


/**
 * 
 */

router.get("/tracking", [checkAuth], fetchHandler);


/**
 * 
 */
router.post("/tracking", [checkAuth], createHandler);

/**
 * 
 */
router.delete("/tracking/:recordId", [checkAuth, isValidAdmin], deleteHandler);

export default router;