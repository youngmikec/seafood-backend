import express from 'express';
import { checkAuth, isValidAdmin } from '../../middleware/authorization.js';
import {
    fetchHandler,
    createHandler,
    updateHandler,
    operationHandler,
    deleteHandler
} from './controller.js';

const router = express.Router();


router.get('/deposits', [checkAuth], fetchHandler );


router.post('/deposits', [checkAuth], createHandler);

router.put('/deposits/:recordId', [checkAuth], updateHandler);
router.put('/deposits/operation/:recordId', [checkAuth, isValidAdmin], operationHandler);

router.delete('/deposits/:recordId', [checkAuth, isValidAdmin], deleteHandler);

export default router;