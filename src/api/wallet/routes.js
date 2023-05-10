import express from 'express';
import { checkAuth, isValidAdmin } from "../../middleware/index.js";

import {
    fetchHandler, 
    createHandler, 
    updateHandler, 
    deleteHandler,
    // transferHandler,
    // fundWalletHandler,
    // adminCreateHandler,
} from "./controller.js";

const router = express.Router();

/**
 * @api {get} /parcel?id={recordId} Retrieve Parcel records
 * @apiName RetrieveParcels
 * @apiGroup Parcels
 * @apiHeader {String} Authorization Bearer token
 * @apiExample {curl} Example usage for retieving a single record:
 *      curl -i api/parcel?
 * @apiParam {Object} filter query condition (optional)
 * @apiParam {Number} skip Number of records to offset by (optional)
 * @apiParam {Number} limit Maximum Number of records to retrieve (optional)
 * @apiParam {String} sort how records would be arranged in alphabet (optional)
 * @apiParam {String} projection list of record's attributes to retrieve (optional)
 * @apiDescription Records  of permissible api routes admin can Parcels
 * @apiSuccess {Object[]} Array of Objects of records.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */

 router.get("/wallet", [checkAuth, isValidAdmin], fetchHandler);


 /**
 * @api {post} /wallet Create Wallet
 * @apiName CreateWallet
 * @apiGroup Wallet
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {String} name Wallet Id (required)
 * @apiSuccess {Object} Wallets data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Wallets not found.
 * @apiError 401 master Wallets only.
 */
  router.post("/wallet", [checkAuth], createHandler);
//   router.post("/wallet/fund", [checkAuth], fundWalletHandler);
//   router.post("/wallet/transfer", [checkAuth], transferHandler);
//   router.post("/wallet/admin", [checkAuth, isValidAdmin], adminCreateHandler);

   /**
 * @api {put} /parcel/{recordId} Update Wallets
 * @apiName UpdateWallets
 * @apiGroup Wallets
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {ObjectId} recordId Wallet recordId
 * @apiSuccess {Object} Wallets Wallets's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Wallets not found.
 * @apiError 401 master Wallets only.
 */
router.put("/wallet/:recordId", [checkAuth], updateHandler);

/**
  * @api {delete} /wallet/{recordId} Delete wallet
  * @apiName DeleteWallets
  * @apiGroup Wallets
  * @apiHeader {String} Authorization Bearer token
  * @apiParam {String} recordId required record ObjectId
  * @apiSuccess (Success 204) 204 No Content.
  * @apiError 404 Wallets not found.
  * @apiError 401 master Wallets only.
  */
router.delete("/wallet/:recordId", [checkAuth, isValidAdmin], deleteHandler);
 




 export default router;