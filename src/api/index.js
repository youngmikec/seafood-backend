import express from 'express'
import userRoute from './user/index.js';
import packageRoute from './package/index.js';
import parcelRoute from './parcel/index.js';


const router = express.Router();

router.use(packageRoute);
router.use(parcelRoute);
router.use(userRoute);


export default router;