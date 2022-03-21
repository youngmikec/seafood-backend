import express from 'express';
import { checkAuth, isValidAdmin } from "../../middleware/index.js";
import { 
    fetchHandler,
    createHandler,
    updateHandler,
    operationHandler,
    deleteHandler,
} from './controller.js';


const router = express.Router();

/**
 * @api {get} /shipment?id={recordId} Retrieve Shipment records
 * @apiName RetrieveShipments
 * @apiGroup Shipments
 * @apiHeader {String} Authorization Bearer token
 * @apiExample {curl} Example usage for retieving a single record:
 *      curl -i api/shipment?
 * @apiParam {Object} filter query condition (optional)
 * @apiParam {Number} skip Number of records to offset by (optional)
 * @apiParam {Number} limit Maximum Number of records to retrieve (optional)
 * @apiParam {String} sort how records would be arranged in alphabet (optional)
 * @apiParam {String} projection list of record's attributes to retrieve (optional)
 * @apiDescription Records  of permissible api routes admin can Shipments
 * @apiSuccess {Object[]} Array of Objects of records.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */

 router.get("/shipment", [checkAuth, isValidAdmin], fetchHandler);

/**
 * @api {post} /shipment Create Shipments
 * @apiName CreateShipments
 * @apiGroup Shipments
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {String} code Shipment code (required)
 * @apiParam {String} courierName Shipment courier Name (required)
 * @apiParam {String} courierPhone Shipment courier Phone (required)
 * @apiParam {Object} locationFrom Shipment orginating location (required)
 * @apiParam {Object} destination Shipment terminating location (required)
 * @apiParam {Object} currentLocation Shipment current location (required)
 * @apiParam {ObjectId} packages Shipment packages (required)
 * @apiParam {Date} departureDate Shipment departure date (required)
 * @apiParam {Date} expectedDate Shipment expected arrival date (required)
 * @apiParam {Number} mass Shipment mass (optional)
 * @apiParam {Number} volume Shipment volume (optional)
 * @apiParam {Boolean} isVehicleFull Shipment is vehicle filled up (required)
 * @apiParam {String} remark Shipment remark (required)
 * @apiSuccess {Object} Shipments data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Shipments not found.
 * @apiError 401 master Shipments only.
 */

 router.post("/shipment", [checkAuth, isValidAdmin], createHandler);
 
 /**
  * @api {put} /shipment Create Shipments
  * @apiName CreateShipments
  * @apiGroup Shipments
  * @apiHeader {String} Authorization Bearer token
  * @apiParam {String} code Shipment code (required)
  * @apiParam {String} courierName Shipment courier Name (required)
  * @apiParam {String} courierPhone Shipment courier Phone (required)
  * @apiParam {Object} locationFrom Shipment orginating location (required)
  * @apiParam {Object} destination Shipment terminating location (required)
  * @apiParam {Object} currentLocation Shipment current location (required)
  * @apiParam {ObjectId} packages Shipment packages (required)
  * @apiParam {Date} departureDate Shipment departure date (required)
  * @apiParam {Date} expectedDate Shipment expected arrival date (required)
  * @apiParam {Number} mass Shipment mass (optional)
  * @apiParam {Number} volume Shipment volume (optional)
  * @apiParam {Boolean} isVehicleFull Shipment is vehicle filled up (required)
  * @apiParam {String} remark Shipment remark (required)
  * @apiSuccess {Object} Shipments data.
  * @apiError {Object} 400 Some parameters may contain invalid values.
  * @apiError 404 Shipments not found.
  * @apiError 401 master Shipments only.
  */
 
  router.put("/shipment/:recordId", [checkAuth, isValidAdmin], updateHandler);
  router.put("/shipment/operation/:recordId", [checkAuth, isValidAdmin], operationHandler);

  /**
  * @api {delete} /shipment/{recordId} Delete Parcels
  * @apiName DeleteShipments
  * @apiGroup Parcels
  * @apiHeader {String} Authorization Bearer token
  * @apiParam {String} recordId required record ObjectId
  * @apiSuccess (Success 204) 204 No Content.
  * @apiError 404 Parcels not found.
  * @apiError 401 master Parcels only.
  */
 router.delete("/shipment/:recordId", [checkAuth, isValidAdmin], deleteHandler);


 export default router;