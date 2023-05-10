import express from 'express';
import { checkAuth, isValidAdmin } from "../../middleware/index.js";
import { coordinateHandler } from './controller.js';

const router = express.Router();


router.post('/geocords', checkAuth, coordinateHandler);

export default router;