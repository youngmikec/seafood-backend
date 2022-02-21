import {
    fetchService,
    // adminCreateService,
    createService,
    updateService,
    // patchService,
    deleteService,
    // setPayableCharge,
    // updatePayment,
    // checkout,
    // estimateBilling,
  } from "./service.js";
  import { response, success, fail } from "../../util/response.js";
import router from "../user/routes.js";
//   import { REPORT } from "../../constant/index.js";
//   import { verifyPayment } from "./verify-payment";
//   import * as aggregateService from "./aggregate-service";
//   import * as operationService from "./operation-service";
  
  const module = "Parcel";
  
  export async function fetchHandler(req, res) {
    try {
      const entity = await fetchService({ query: req.query, user: req.user });
      return response(res, 200, entity);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
  }
  
//   export async function estimateBillingHandler(req, res) {
//     try {
//       const result = await estimateBilling(req.query);
//       return success(res, 200, result, "Estimating billing was successful!");
//     } catch (err) {
//     //   loging(module, req, err);
//       return fail(res, 400, `${err.message}`);
//     }
//   }
  
  export async function createHandler(req, res) {
    try {
      const result = await createService(req.body);
      return success(res, 201, result);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, err.message);
    }
  }

//   export async function adminCreateHandler(req, res) {
//     try {
//       const result = await adminCreateService(req.body);
//       return success(res, 201, result);
//     } catch (err) {
//     //   loging(module, req, err);
//       return fail(res, 400, err.message);
//     }
//   }
  
  export async function updateHandler(req, res) {
    try {
      const { recordId } = req.params;
      const result = await updateService(recordId, req.body, req.user);
      return success(res, 200, result);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
  }
  
//   export async function setPayableChargeHandler(req, res) {
//     try {
//       const { recordId, payableCharge } = req.params;
//       const result = await setPayableCharge(recordId, payableCharge, req.user);
//       return success(res, 200, result);
//     } catch (err) {
//     //   loging(module, req, err);
//       return fail(res, 400, `${err.message}`);
//     }
//   }
  
//   export async function checkoutHandler(req, res) {
//     try {
//       const { recordId } = req.params;
//       const result = await checkout(recordId, req.user);
//       return success(res, 200, result);
//     } catch (err) {
//     //   loging(module, req, err);
//       return fail(res, 400, `${err.message}`);
//     }
//   }
  
//   export async function verifyPayHandler(req, res) {
//     try {
//       const entity = await verifyPayment(req.params.code);
//       return success(res, 200, entity);
//     } catch (err) {
//     //   loging(module, req, err);
//       return fail(res, 400, err.message);
//     }
//   }
  
//   export async function updatePayHandler(req, res) {
//     try {
//       const entity = await updatePayment(req.params.code, req.body, req.user);
//       return success(res, 200, entity);
//     } catch (err) {
//     //   loging(module, req, err);
//       return fail(res, 400, err.message);
//     }
//   }
  
//   export async function patchHandler(req, res) {
//     try {
//       const { recordId } = req.params;
//       const result = await patchService(recordId, req.body);
//       return success(res, 200, result);
//     } catch (err) {
//     //   loging(module, req, err);
//       return fail(res, 400, `${err.message}`);
//     }
//   }
  
  export async function deleteHandler(req, res) {
    try {
      const { recordId } = req.params;
    //   const result = await deleteService(recordId, req.user);
      const result = await deleteService(recordId);
      return success(res, 200, result);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
  }
  
//   export async function operationHandler(req, res) {
//     try {
//       const { body, user } = req;
//       const result = await operationService.operation(
//         req.params.recordId,
//         body,
//         user
//       );
//       return success(res, 200, result);
//     } catch (err) {
//     //   loging(module, req, err);
//       return fail(res, 400, `${err.message}`);
//     }
//   }
  
//   export async function reportHandler(req, res) {
//     try {
//       let result;
//       const { report } = req.query;
//       switch (report) {
//         case REPORT.INCOME_SUMMARY.code:
//           result = await aggregateService.incomeSummary(req.query);
//           break;
//         case REPORT.INCOME_BY_SENDER.code:
//           result = await aggregateService.incomeBySender(req.query);
//           break;
//         case REPORT.INCOME_BY_DISPATCHER.code:
//           result = await aggregateService.incomeByDispatcher(req.query);
//           break;
//         case REPORT.INCOME_BY_VEHICLE.code:
//           result = await aggregateService.incomeByVehicle(req.query);
//           break;
//         case REPORT.INCOME_BY_CATEGORY.code:
//           result = await aggregateService.incomeByCategory(req.query);
//           break;
//         case REPORT.INCOME_BY_DEPARTURE.code:
//           result = await aggregateService.incomeByCategory(req.query);
//           break;
//         case REPORT.INCOME_BY_DESTINATION.code:
//           result = await aggregateService.incomeByCategory(req.query);
//           break;
//         default:
//           throw new Error(`Invalid report code ${report}`);
//       }
//       return success(res, 200, result);
//     } catch (err) {
//     //   loging(module, req, err);
//       return fail(res, 400, `${err.message}`);
//     }
//   }
  