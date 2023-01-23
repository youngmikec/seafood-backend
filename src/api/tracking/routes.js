import express from 'express';
import { checkAuth, isValidAdmin } from '../../middleware/index.js';
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
router.post("/tracking", createHandler);

/**
 * 
 */
router.delete("/tracking/:recordId", [checkAuth, isValidAdmin], deleteHandler);

export default router;