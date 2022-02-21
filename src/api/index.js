import express from 'express'
import userRoute from './user/index.js';
import parcelRoute from './parcel/index.js';


const router = express.Router();

router.use(parcelRoute);
router.use(userRoute);


export default router;