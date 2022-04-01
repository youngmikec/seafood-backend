import express from "express";
import { checkAuth, isValidAdmin } from "../../middleware/index.js";
import {
    fetchHandler, 
    createHandler, 
    updateHandler, 
    deleteHandler,
    adminCreateHandler,
    operationHandler,
    // estimateBillingHandler,  
    // checkoutHandler, adminCreateHandler,
    // verifyPayHandler, updatePayHandler, setPayableChargeHandler,
    // patchHandler, reportHandler,
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

 router.get("/package", [checkAuth], fetchHandler);


 /**
 * @api {post} /package Create Package
 * @apiName CreatePackage
 * @apiGroup Package
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {String} name Package name (required)
 * @apiParam {String} code Package code (required)
 * @apiParam {ObjectId} sender Package Customer sender
 * @apiParam {ObjectId} pickup Package pickup
 * @apiParam {String} image Package image url string
 * @apiParam {ObjectId} catgeory Package Customer catgeory
 * @apiParam {Number} mass Package mass (optional)
 * @apiParam {Number} volume Package volume (optional)
 * @apiParam {Number} worth Package worth (required)
 * @apiParam {Boolean} isInsured Package is insured (required)
 * @apiParam {String} description Package description (required)
 * @apiSuccess {Object} Packages data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Packages not found.
 * @apiError 401 master Packages only.
 */
  router.post("/package", [checkAuth], createHandler);
  router.post("/package/admin", [checkAuth, isValidAdmin], adminCreateHandler);

   /**
 * @api {put} /parcel/{recordId} Update Packages
 * @apiName UpdatePackages
 * @apiGroup Packages
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {ObjectId} recordId Package recordId
 * @apiParam {String} name Package name (required)
 * @apiParam {String} code Package code (required)
 * @apiParam {ObjectId} sender Package Customer sender
 * @apiParam {ObjectId} pickup Package pickup
 * @apiParam {String} image Package image url string
 * @apiParam {ObjectId} catgeory Package Customer catgeory
 * @apiParam {Number} mass Package mass (optional)
 * @apiParam {Number} volume Package volume (optional)
 * @apiParam {Number} worth Package worth (required)
 * @apiParam {Boolean} isInsured Package is insured (required)
 * @apiParam {String} description Package description (required)
 * @apiSuccess {Object} Packages Packages's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Packages not found.
 * @apiError 401 master Packages only.
 */
router.put("/package/:recordId", [checkAuth], updateHandler);
router.put("/package/operation/:recordId", [checkAuth, isValidAdmin], operationHandler);

/**
  * @api {delete} /parcel/{recordId} Delete Packages
  * @apiName DeletePackages
  * @apiGroup Packages
  * @apiHeader {String} Authorization Bearer token
  * @apiParam {String} recordId required record ObjectId
  * @apiSuccess (Success 204) 204 No Content.
  * @apiError 404 Packages not found.
  * @apiError 401 master Packages only.
  */
 router.delete("/package/:recordId", [checkAuth, isValidAdmin], deleteHandler);
 




 export default router;
