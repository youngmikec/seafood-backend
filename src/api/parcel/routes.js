import express from "express";
import { checkAuth, isValidAdmin } from "../../middleware/index.js";
import {
    fetchHandler, 
    createHandler, 
    updateHandler, 
    deleteHandler,
    billingHandler,
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

 router.get("/parcel", [checkAuth], fetchHandler);
//  router.get("/parcel/report", [checkAuth], reportHandler);

 /**
 * @api {get} /parcel/cash-realized Parcel Cash Realized
 * @apiName ParcelCashRealized
 * @apiGroup Parcels
 * @apiParam {Date}  transactionDate PARCEL Parcel transaction date (required)
 * @apiParam {ObjectId}  locationId PARCEL Parcel transaction Location (required)
 * @apiDescription Return the sum of cash paid successfully
 * @apiSuccess {Object[]} Array of Objects of records.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */

// router.get("/parcel/estimate-billing", [checkAuth], estimateBillingHandler);
// router.get("/parcel/checkout/:recordId", [checkAuth], checkoutHandler);
// router.get("/parcel/payable/:recordId/:amountPayable", [checkAuth], setPayableChargeHandler);
// router.get("/parcel/payment/:code(^[a-zA-Z0-9]{10}$)", [checkAuth], verifyPayHandler);

/**
 * @api {post} /parcel Create Parcels
 * @apiName CreateParcels
 * @apiGroup Parcels
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {String} name Parcel name (required)
 * @apiParam {String} code Parcel code (required)
 * @apiParam {ObjectId} sender Parcel Customer sender
 * @apiParam {ObjectId} pickup Parcel pickup
 * @apiParam {String} image Parcel image url string
 * @apiParam {ObjectId} catgeory Parcel Customer catgeory
 * @apiParam {Number} mass Parcel mass (optional)
 * @apiParam {Number} volume Parcel volume (optional)
 * @apiParam {Number} worth Parcel worth (required)
 * @apiParam {Boolean} isInsured Parcel is insured (required)
 * @apiParam {String} description Parcel description (required)
 * @apiSuccess {Object} Parcels data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Parcels not found.
 * @apiError 401 master Parcels only.
 */

 router.post("/parcel", [checkAuth], createHandler);
 router.post("/parcel/billing", [checkAuth], billingHandler);
//  router.post("/parcel/admin", [checkAuth, isValidAdmin], adminCreateHandler);

 /**
 * @api {put} /parcel/{recordId} Update Parcels
 * @apiName UpdateParcels
 * @apiGroup Parcels
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {ObjectId} recordId Parcel recordId
 * @apiParam {String} name Parcel name (required)
 * @apiParam {String} code Parcel code (required)
 * @apiParam {ObjectId} sender Parcel Customer sender
 * @apiParam {ObjectId} pickup Parcel pickup
 * @apiParam {String} image Parcel image url string
 * @apiParam {ObjectId} catgeory Parcel Customer catgeory
 * @apiParam {Number} mass Parcel mass (optional)
 * @apiParam {Number} volume Parcel volume (optional)
 * @apiParam {Number} worth Parcel worth (required)
 * @apiParam {Boolean} isInsured Parcel is insured (required)
 * @apiParam {String} description Parcel description (required)
 * @apiSuccess {Object} Parcels Parcels's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Parcels not found.
 * @apiError 401 master Parcels only.
 */
router.put("/parcel/:recordId", [checkAuth], updateHandler);

/**
 * @api {put} /parcel/operation/{recordId}
 *  Update depature status Parcels operation
 * @apiName UpdateParcelsOperation
 * @apiGroup Parcels
 * @apiParam {ObjectId} package Parcel pml package (prohibited)
 * @apiParam {String} code Parcel code (required)
 * @apiSuccess {Object} Parcel record's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Parcel not found.
 * @apiError 401 master access only.
 */
//  router.put("/parcel/operation/:recordId", [checkAuth], operationHandler);
//  router.put("/parcel/payment/:code", [checkAuth], updatePayHandler);
 
 /**
  * @api {patch} /parcel/{recordId} Patch parcels
  * @apiName PatchParcels
  * @apiGroup Parcels
  * @apiHeader {String} Authorization Bearer token
  * @apiParam {String} recordId required record ObjectId
  * @apiSuccess (Success 204) 204 No Content.
  * @apiError 404 Parcels not found.
  * @apiError 401 master access only.
  */
//  router.patch("/parcel/:recordId", [checkAuth, isValidAdmin], patchHandler);
 
 /**
  * @api {delete} /parcel/{recordId} Delete Parcels
  * @apiName DeleteParcels
  * @apiGroup Parcels
  * @apiHeader {String} Authorization Bearer token
  * @apiParam {String} recordId required record ObjectId
  * @apiSuccess (Success 204) 204 No Content.
  * @apiError 404 Parcels not found.
  * @apiError 401 master Parcels only.
  */
 router.delete("/parcel/:recordId", [checkAuth, isValidAdmin], deleteHandler);
 
 export default router;
