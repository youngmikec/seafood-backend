import express from 'express'
import route from './user/index.js';


const router = express.Router();


router.use(route);


export default router;