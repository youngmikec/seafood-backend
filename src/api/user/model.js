/* eslint-disable no-unused-vars */
/**
 * @author Ozor Michael
 * @property {ObjectId} id User primaryKey
 * @property {String} wallet User wallet Id
 * @property {String} userBVN User Bank Verification Number
 * @property {String} accountName User Bank User Name
 * @property {String} accountNumber User Bank User Number
 * @property {Number} balance User Wallet current balance
 * @property {Boolean} isActive User Manually set in if disposable for pickup
 * @property {String} title User title e.g Mr, Mrs etc
 * @property {String} type User User type SENDER|DISPATCHER (required)
 * @property {ObjectId} user User user owned User
 * @property {String} surname User surname
 * @property {String} firstName User first name
 * @property {String} middleName User middle name
 * @property {String} lastName User last name
 * @property {String} gender User GENDER M-MALE, F-FEMALE, O-OTHER
 * @property {Date} birthDate User date of birth (required)
 * @property {String} address User dormiciary address of origin (required)
 * @property {String} state User state of coverage ObjectId
 * @property {String} county User county of coverage ObjectId
 * @property {String} country User country of coverage
 * @property {Object} location User location current use location
 * @property {Enum} coverage  User coverage Enum "GLOBAL", "COUNTRY", "STATE", "COUNTY"
 * @property {String} password User password
 * @property {String} otp User one time password for accessing the App
 * @property {Number} otpCount Number of times OTP has been used without successful transaction
 * @property {Boolean} otpAccess OTP Access status
 * @property {String} email User email
 * @property {String} phone User phone number (required)
 * @property {String} phoneHome User phone number
 * @property {String} businessName User business Name
 * @property {String} kin User next of kin fullname, relationship, address
 * @property {String} kinPhone User next of kin phone number
 * @property {String} kinAddress User next of kin address
 * @property {String} guarantor User first guarantor
 * @property {String} guarantorAddress User first guarantor's address
 * @property {String} guarantorPhone User first guarantor's phone
 * @property {String} userNIN User National Identity Number
 * @property {String} userNINScan User Scanned National Identity Card
 * @property {String} userNINPhoto User Photo with National Identity Card
 * @property {String} guarantorNIN User guarantor National Identity Number
 * @property {String} guarantorNINScan User guarantor Scanned National Identity Card
 * @property {String} guarantorNINPhoto User guarantor Photo with National Identity Card
 * @property {String} guarantor User guarantor fullname
 * @property {String} guarantorAddress User guarantor Address
 * @property {String} guarantorPhone User guarantor Phone number
 * @property {String} notice User notification
 * @property {Array} ratings User ratings score ObjectId array  (Prohibited)
 * @property {String} remark User remark
 * @property {String} bonus  User reward
 * @property {Boolean} isDocumented User documentation completed?
 * @property {String} status User status status
 * @property {ObjectId} approvedBy User status admin
 * @property {Date} approvedDate User status date
 * @property {ObjectId} verifiedBy User verified ADMIN
 * @property {Date} verifiedDate User verified date
 * @property {String} status User status status
 * @property {ObjectId} disengagedBy User disengagement authority admin id
 * @property {Date} disengagedDate User disengagement date
 * @property {ObjectId} createdBy User record created by (Prohibited)
 * @property {ObjectId} updatedBy User record modified by (Prohibited)
 * @description User holds record of all admin, SEAFOOD Users
 */
  import Joi from "joi";
  import mongoose from "mongoose";
  import {
    DATABASE,
    GENDER,
    USER_TYPE,
    COVERAGE,
    ACCESS_LEVEL,
    USER_ROLE,
  } from "../../constant/index.js";

 import { Location } from "../common/index.js";
 import table from "./table.js";
 
 const { Schema } = mongoose;
 const { ObjectId } = Schema.Types;
 
 export const schemaLogin = Joi.object({
   email: Joi.string().trim().email().optional(),
   phone: Joi.string().trim().optional(),
   otp: Joi.string().trim().optional(),
   password: Joi.string().trim().optional(),
   currentIp: Joi.string().trim().optional(),
   type: Joi.string().valid("EMAIL", "PHONE", "OTP").optional(),
   userType: Joi.string()
     .valid(...Object.keys(USER_TYPE))
     .optional(),
 });
 
 export const validatePasswordUpdate = Joi.object({
   password: Joi.string()
     .required(),
   newPassword: Joi.string()
     .required(),
   updatedBy: Joi.string()
     .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
     .required(),
 });
 
//  export const validatePinUpdate = Joi.object({
//    pin: Joi.string()
//      .regex(/^\d{5}$/)
//      .required(),
//    newPin: Joi.string()
//      .regex(/^\d{5}$/)
//      .required(),
//    updatedBy: Joi.string()
//      .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
//      .required(),
//  });
 
 export const validateCreate = Joi.object({
   email: Joi.string().trim().email().required(),
   phone: Joi.string().required(),
   password: Joi.string().required(),
   title: Joi.string().trim().valid("MR", "MRS", "MS", "DR", "ENGR").optional(),
   surname: Joi.string().trim().required(),
   firstName: Joi.string().trim().required(),
   middleName: Joi.string().trim().optional(),
   lastName: Joi.string().trim().optional(),
   isProfileComplete: Joi.boolean().optional(),
   createdBy: Joi.string()
     .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
     .optional(),
 });
 
 export const validateUserUpdate = Joi.object({
  //  pin: Joi.string().length(5).regex(/^\d+$/).optional(),
  //  businessName: Joi.string().trim().optional(),
  //  accountName: Joi.string().trim().uppercase().optional(),
  //  accountNumber: Joi.string().trim().uppercase().optional(),
  //  bankName: Joi.string().trim().uppercase().optional(),
  //  userBVN: Joi.string().trim().optional(),
  balance: Joi.number().optional(),
  title: Joi.string().optional(),
  surname: Joi.string().trim().optional(),
  firstName: Joi.string().trim().optional(),
  middleName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  gender: Joi.string().trim().optional(),
  birthDate: Joi.date().optional(),
  address: Joi.string().optional(),
  coverage: Joi.number()
  .valid(...Object.values(COVERAGE))
  .optional(),
  location: Joi.any().optional(),
  state: Joi.string()
  .optional(),
   county: Joi.string()
   .optional(),
   country: Joi.string()
   .optional(),
   password: Joi.string().optional(),
   email: Joi.string().trim().email().optional(),
   phone: Joi.string().optional(),
   phone2: Joi.string().optional(),
   kin: Joi.string().optional(),
   kinPhone: Joi.string().optional(),
   kinAddress: Joi.string().optional(),
   //  userNIN: Joi.string().trim().optional(),
   //  userNINScan: Joi.string().trim().optional(),
   //  userNINPhoto: Joi.string().trim().optional(),
   //  guarantorNIN: Joi.string().trim().optional(),
   //  guarantorNINScan: Joi.string().trim().optional(),
   //  guarantorNINPhoto: Joi.string().trim().optional(),
   //  guarantor: Joi.string().trim().optional(),
   //  guarantorAddress: Joi.string().trim().optional(),
   //  guarantorPhone: Joi.string().trim().optional(),
   updatedBy: Joi.string()
   .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
   .required(),
  });
  
  export const validateAdminUpdate = Joi.object({
    title: Joi.string().optional(),
    accessLevel: Joi.number().optional(),
    balance: Joi.number().optional(),
  //  businessName: Joi.string().trim().optional(),
   surname: Joi.string().trim().optional(),
   firstName: Joi.string().trim().optional(),
   middleName: Joi.string().trim().optional(),
   lastName: Joi.string().trim().optional(),
   gender: Joi.string().trim().optional(),
   birthDate: Joi.date().optional(),
   address: Joi.string().optional(),
   coverage: Joi.number()
     .valid(...Object.values(COVERAGE))
     .optional(),
   state: Joi.string()
     .optional(),
   county: Joi.string()
     .optional(),
   country: Joi.string()
     .optional(),
   password: Joi.string().optional(),
   otp: Joi.string().optional(),
   otpCount: Joi.number().optional(),
   email: Joi.string().trim().email().optional(),
   isEmailVerified: Joi.boolean().optional(),
   phone: Joi.string().optional(),
   phone2: Joi.string().optional(),
   kin: Joi.string().optional(),
   kinPhone: Joi.string().optional(),
   kinAddress: Joi.string().optional(),
  //  notice: Joi.string().optional(),
  //  remark: Joi.string().optional(),
  //  bonus: Joi.string().optional(),
  //  userBVN: Joi.string().trim().optional(),
  //  userNIN: Joi.string().trim().optional(),
  //  userNINScan: Joi.string().trim().optional(),
  //  userNINPhoto: Joi.string().trim().optional(),
  //  guarantorNIN: Joi.string().trim().optional(),
  //  guarantorNINScan: Joi.string().trim().optional(),
  //  guarantorNINPhoto: Joi.string().trim().optional(),
  //  guarantor: Joi.string().trim().optional(),
  //  guarantorAddress: Joi.string().trim().optional(),
  //  guarantorPhone: Joi.string().trim().optional(),
  //  isDocumented: Joi.number().valid(0, 1).optional(),
  //  status: Joi.number()
  //    .valid(...Object.values(DATABASE.RECORD_STATUS))
  //    .optional(),
   userType: Joi.string()
     .valid(...Object.values(USER_TYPE))
     .optional(),
  //  role: Joi.string()
  //    .valid(...Object.values(USER_ROLE))
  //    .optional(),
   approvedBy: Joi.string().optional(),
   approvedDate: Joi.date().optional(),
   verifiedBy: Joi.string().optional(),
   verifiedDate: Joi.date().optional(),
   disengagedBy: Joi.number().optional(),
   disengagedDate: Joi.date().optional(),
   updatedBy: Joi.string()
     .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
     .required(),
 });
 
 export const schema = {
   title: { type: String },
   userType: {
     type: String,
     enum: Object.values(USER_TYPE),
     default: USER_TYPE.SENDER,
   },
   wallet: { type: String, select: true },
   balance: { type: Number, default: 5000, select: true },
   walletPin: { type: String, default: "0000", select: false},
   surname: { type: String, trim: true },
   firstName: { type: String, trim: true },
   middleName: { type: String, trim: true },
   lastName: { type: String, trim: true },
   gender: { type: String, enum: Object.values(GENDER) },
   birthDate: { type: Date },
   address: { type: String },
   location: { type: Location },
   coverage: { type: Number, enum: Object.values(COVERAGE), default: COVERAGE.REGION },
   country: { type: String },
   state: { type: String },
   county: { type: String },
   password: { type: String, trim: true, required: true, select: false },
   email: {
     type: String,
     trim: true,
     lowercase: true,
     unique: true,
     // eslint-disable-next-line no-useless-escape
     match: [
       /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
       "Please fill a valid email address",
     ],
     required: true,
   },
   phone: { type: String, trim: true, required: true, unique: true },
   phone2: { type: String },
   kin: { type: String },
   kinPhone: { type: String },
   kinAddress: { type: String },
 
  //  guarantorPhone: { type: String },
   isProfileComplete: { type: Boolean, default: false },
   approvedBy: { type: ObjectId },
   approvedDate: { type: Date },
   verifiedBy: { type: ObjectId },
   verifiedDate: { type: Date },
   disengagedBy: { type: ObjectId },
   disengagedDate: { type: Date },
   otp: { type: String },
   otpCount: { type: Number, default: 0 },
   otpAccess: { type: Number, enum: [0, 1], default: 0 },
   otpTimeout: { type: Date },
   accessLevel: { type: Number, default: ACCESS_LEVEL.DELETE, min: 0, max: 10 },
   isEmailVerified: { type: Boolean, default: false },
   emailNotification: { type: Boolean, default: true },
   smsNotification: { type: Boolean, default: false },
   //* Authentication
   lastLogin: { type: Date },
   currentLogin: { type: Date },
   lastIp: { type: String },
   currentIp: { type: String },
   createdBy: { type: ObjectId, select: false },
   updatedBy: { type: ObjectId, select: false },
   deleted: { type: Number, enum: [0, 1], default: 0, select: false },
   deletedAt: { type: Date, select: false },
   deletedBy: { type: ObjectId, select: false },
 };
 
 const options = DATABASE.OPTIONS;
 
 const newSchema = new Schema(schema, options);
 newSchema.index({ location: "2dsphere" });
 newSchema.index({ phone: 1, email: 1 }, { unique: true });
//  newSchema.index({ wallet: 1 }, { unique: true });
//  newSchema.index({ accountNumber: 1 });
 newSchema.index({ surname: 1 });
 newSchema.index({ surname: "text", email: "text", phone: "text" });
 
 newSchema.set("collection", "user");
 
//  newSchema.statics.findByDispatcherCoordinates = function({ coordinates, maxDistance }) {
//    return this.aggregate([{
//      $geoNear: {
//        near: {
//          type: "Point",
//          coordinates: coordinates
//        },
//        maxDistance: maxDistance,
//        distanceField: "dist.calculated",
//        spherical: true
//      }
//    }]);
//  };
 
 const User = mongoose.model("User", newSchema);
 
//  User.countDocuments({})
//    .then((total) => {
//      if (total < 2) User.insertMany(table).then((result) => console.log(result));
//    })
//    .catch((err) => console.log(err.message));
 
 
   
export default User; 