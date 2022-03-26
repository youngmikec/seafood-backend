import express from 'express'
import userRoute from './user/index.js';
import packageRoute from './package/index.js';
import parcelRoute from './parcel/index.js';
import shipmentRoute from './shipment/index.js';
import trackinigRoute from './tracking/index.js';
import walletRoute from './wallet/index.js';


const router = express.Router();

router.use(packageRoute);
router.use(parcelRoute);
router.use(shipmentRoute);
router.use(userRoute);
router.use(trackinigRoute);
router.use(walletRoute);


export default router;