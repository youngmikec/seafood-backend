import express from "express";
import { checkAuth, isValidAdmin } from "../../middleware/index.js";
import {
  fetchHandler,
  fetchAnyHandler,
  fetchSelfHandler,
  createHandler,
  updateByAdminHandler,
  updateByUserHandler,
  updatePinHandler,
  updatePasswordHandler,
  deleteHandler,
  userLoginHandler,
  adminLoginHandler,
  patchHandler,
  sendOTPHandler,
} from "./controller.js";

const router = express.Router();

/**
 * @api {get} /api/user?id={recordId} Retrieve one or all records
 * @apiName RetrieveUser
 * @apiGroup User
 * @apiExample {curl} Example usage for retieving a single record:
 *      curl -i api/user?
 * @apiParam {Object} filter query condition (optional)
 * @apiParam {Number} skip Number of records to offset by (optional)
 * @apiParam {Number} limit Maximum Number of records to retrieve (optional)
 * @apiParam {String} sort how records would be arranged in alphabet (optional)
 * @apiParam {String} projection list of record's attributes to retrieve (optional)
 * @apiDescription Records of FREEXIT Users. Other users suchas patrol admin,
 * private users are on ADMIN record
 * @apiSuccess {Object[]} Array of Objects of records.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/user", [checkAuth, isValidAdmin], fetchHandler);
// router.get("/user", fetchHandler);

router.get("/user/me", [checkAuth], fetchSelfHandler);

router.get("/user/info/:variable", [checkAuth], fetchAnyHandler);

/**
 * @api {post} /api/user Create users
 * @apiName CreateUser
 * @apiGroup User
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {String} title User title e.g Mr, Mrs etc
 * @apiParam {String} surname User surname
 * @apiParam {String} firstName User first name
 * @apiParam {String} middleName User middle name
 * @apiParam {String} lastName User last name
 * @apiParam {String} gender User GENDER M-MALE, F-FEMALE, O-OTHER
 * @apiParam {Date} birthDate User date of birth (required)
 * @apiParam {String} address User dormiciary address of origin (required)
 * @apiParam {String} state User state of coverage ObjectId
 * @apiParam {String} county User county of coverage ObjectId
 * @apiParam {String} country User country of coverage
 * @apiSuccess {Object} User User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 User not found.
 * @apiError 401 master access only.
 */
router.post("/user", createHandler);

/**
 * @api {put} /api/user/admin/{recordId} Update user by Admin
 * @apiName UpdateUserByAdmin
 * @apiGroup User
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {ObjectId} recordId User record Id PrimaryKey
 * @apiParam {String} wallet User wallet Id
 * @apiParam {String} userBVN User Bank Verification Number
 * @apiParam {String} accountName User Bank User Name
 * @apiParam {String} accountNumber User Bank User Number
 * @apiParam {Number} balance User Wallet current balance
 * @apiParam {Boolean} isActive User Manually set in if disposable for pickup
 * @apiParam {String} title User title e.g Mr, Mrs etc
 * @apiParam {String} type User User type SENDER|DISPATCHER (required)
 * @apiParam {Array} vehicles User vehicles owned Array of ObjectId
 * @apiParam {ObjectId} user User user owned User
 * @apiParam {String} surname User surname
 * @apiParam {String} firstName User first name
 * @apiParam {String} middleName User middle name
 * @apiParam {String} lastName User last name
 * @apiParam {String} gender User GENDER M-MALE, F-FEMALE, O-OTHER
 * @apiParam {Date} birthDate User date of birth (required)
 * @apiParam {String} address User dormiciary address of origin (required)
 * @apiParam {String} state User state of coverage ObjectId
 * @apiParam {String} county User county of coverage ObjectId
 * @apiParam {String} country User country of coverage
 * @apiParam {Object} location User location current use location
 * @apiParam {Enum} coverage  User coverage Enum "GLOBAL", "COUNTRY", "STATE", "COUNTY"
 * @apiParam {String} password User password
 * @apiParam {String} otp User one time password for accessing the App
 * @apiParam {Number} otpCount Number of times OTP has been used without successful transaction
 * @apiParam {Boolean} otpAccess OTP Access status
 * @apiParam {String} email User email
 * @apiParam {String} phone User phone number (required)
 * @apiParam {String} phoneHome User phone number
 * @apiParam {String} kin User next of kin fullname, relationship, address
 * @apiParam {String} kinPhone User next of kin phone number
 * @apiParam {String} kinAddress User next of kin address
 * @apiParam {String} guarantor User first guarantor
 * @apiParam {String} guarantorAddress User first guarantor's address
 * @apiParam {String} guarantorPhone User first guarantor's phone
 * @apiParam {String} userNIN User National Identity Number
 * @apiParam {String} userNINScan User Scanned National Identity Card
 * @apiParam {String} userNINPhoto User Photo with National Identity Card
 * @apiParam {String} guarantorNIN User guarantor National Identity Number
 * @apiParam {String} guarantorNINScan User guarantor Scanned National Identity Card
 * @apiParam {String} guarantorNINPhoto User guarantor Photo with National Identity Card
 * @apiParam {String} guarantor User guarantor fullname
 * @apiParam {String} guarantorAddress User guarantor Address
 * @apiParam {String} guarantorPhone User guarantor Phone number
 * @apiParam {String} notice User notification
 * @apiParam {String} remark User remark
 * @apiParam {String} bonus  User reward
 * @apiParam {Boolean} isDocumented User documentation completed?
 * @apiParam {String} status User status status
 * @apiParam {ObjectId} approvedBy User status admin
 * @apiParam {Date} approvedDate User status date
 * @apiParam {ObjectId} verifiedBy User verified ADMIN
 * @apiParam {Date} verifiedDate User verified date
 * @apiParam {String} status User status status
 * @apiParam {ObjectId} disengagedBy User disengagement authority admin id
 * @apiParam {Date} disengagedDate User disengagement date
 * @apiSuccess {Object} User User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 User not found.
 * @apiError 401 master access only.
 */
// router.put(
//   "/user/admin/:recordId",
//   updateByAdminHandler
// );
router.put(
  "/user/admin/:recordId",
  [checkAuth, isValidAdmin],
  updateByAdminHandler
);

/**
 * @api {put} /api/user/me Update User by Self
 * @apiName UpdateUserByMe
 * @apiGroup User
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {String} userBVN User Bank Verification Number
 * @apiParam {String} accountName User Bank User Name
 * @apiParam {String} accountNumber User Bank User Number
 * @apiParam {String} title User title e.g Mr, Mrs etc
 * @apiParam {String} surname User surname
 * @apiParam {String} firstName User first name
 * @apiParam {String} middleName User middle name
 * @apiParam {String} lastName User last name
 * @apiParam {String} gender User GENDER M-MALE, F-FEMALE, O-OTHER
 * @apiParam {Date} birthDate User date of birth (required)
 * @apiParam {String} address User dormiciary address of origin (required)
 * @apiParam {String} state User state of coverage ObjectId
 * @apiParam {String} county User county of coverage ObjectId
 * @apiParam {String} country User country of coverage
 * @apiParam {Object} location User location current use location
 * @apiParam {Enum} coverage  User coverage Enum "GLOBAL", "COUNTRY", "STATE", "COUNTY"
 * @apiParam {String} password User password
 * @apiParam {String} email User email
 * @apiParam {String} phone User phone number (required)
 * @apiParam {String} phoneHome User phone number
 * @apiParam {String} kin User next of kin fullname, relationship, address
 * @apiParam {String} kinPhone User next of kin phone number
 * @apiParam {String} kinAddress User next of kin address
 * @apiParam {String} guarantor User first guarantor
 * @apiParam {String} guarantorAddress User first guarantor's address
 * @apiParam {String} guarantorPhone User first guarantor's phone
 * @apiParam {String} userNIN User National Identity Number
 * @apiParam {String} userNINScan User Scanned National Identity Card
 * @apiParam {String} userNINPhoto User Photo with National Identity Card
 * @apiParam {String} guarantorNIN User guarantor National Identity Number
 * @apiParam {String} guarantorNINScan User guarantor Scanned National Identity Card
 * @apiParam {String} guarantorNINPhoto User guarantor Photo with National Identity Card
 * @apiParam {String} guarantor User guarantor fullname
 * @apiParam {String} guarantorAddress User guarantor Address
 * @apiParam {String} guarantorPhone User guarantor Phone number
 * @apiSuccess {Object} User User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 User not found.
 * @apiError 401 master access only.
 */
router.put("/user/me", [checkAuth], updateByUserHandler);
router.put("/user/pin-reset", [checkAuth], updatePinHandler);
router.put("/user/password-reset", [checkAuth], updatePasswordHandler);

/**
 * @api {patch} /api/user/{recordId} Patch users
 * @apiName PatchUser
 * @apiGroup User
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {String} recordId required record ObjectId
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 User not found.
 * @apiError 401 master access only.
 */
router.patch("/user/:recordId", [checkAuth, isValidAdmin], patchHandler);

/**
 * @api {delete} /api/user/{recordId} Delete users
 * @apiName DeleteUser
 * @apiGroup User
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {String} recordId required record ObjectId
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 User not found.
 * @apiError 401 master access only.
 */
router.delete("/user/:recordId", [checkAuth, isValidAdmin], deleteHandler);

/**
 * @api {post} /api/user/login Login User
 * @apiName LoginUser
 * @apiGroup User
 * @apiParam {String} email User email address (optional)
 * @apiParam {String} password User password (optional)
 * @apiParam {String} phone User official mobile phone number (optional)
 * @apiParam {String} otp User One-Time-Password sent to phone (optional)
 * @apiParam {String} type Login type "EMAIL", "PHONE", "OTP" (required)
 * @apiSuccess (Success 200) 200 Login Successful.
 * @apiError 404 User not found.
 */
router.post("/user/login", userLoginHandler);
router.post("/admin/login", adminLoginHandler);

/**
 * @api {post} /api/user/otp ForgotPassword User
 * @apiName ForgotUser
 * @apiGroup User
 * @apiParam {String} email User email address (required)
 * @apiParam {String} phone User official phone # (required)
 * @apiSuccess (Success 200) 200 Login Successful.
 * @apiError 404 User not found.
 */
router.post("/user/otp", sendOTPHandler);

export default router;
