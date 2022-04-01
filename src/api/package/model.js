/**
 * @author Ozor Michael Chisom
 * @property {ObjectId} _id Package record Id (prohibited)
 * @property {String} name Package name (required)
 * @property {String} code Package code (required)
 * @property {ObjectId} sender Package Customer sender
 * @property {ObjectId} pickup Package pickup
 * @property {String} image Package image url string
 * @property {ObjectId} catgeory Package Customer catgeory
 * @property {Number} mass Package mass (optional)
 * @property {Number} volume Package volume (optional)
 * @property {Number} worth Package worth (required)
 * @property {Boolean} isInsured Package is insured (required)
 * @property {String} description Package description (required)
 * @description Package holds record of PARCEL Packages
 */

 import Joi, { boolean } from "joi";
 import mongoose from 'mongoose';
 import { DATABASE, PAYMENT, PACKAGE } from "../../constant/index.js";
 
 const { Schema } = mongoose;
 const { ObjectId } = Schema.Types;
 
 export const schemaFetch = Joi.object({
     id: Joi.string().optional(),
     skip: Joi.number().positive().optional(),
     limit: Joi.number().positive().optional(),
   });
 
export const estimateObject = {
    parcels: Joi.array()
    .items(
        Joi.object().keys({
        _id: Joi.any().optional(),
        code: Joi.string().optional(),
        name: Joi.string().optional(),
        images: Joi.array().items(Joi.string().required()).optional(),
        quantity: Joi.number().integer().min(1).required(),
        mass: Joi.number().min(0).max(1000000000).required(),
        volume: Joi.number().min(0).max(1000000000).required(),
        worth: Joi.number().positive().required(),
        })
    )
    .required(),
};

export const validateOperation = Joi.object({
    status: Joi.string().valid("CHECKEDOUT", "SHIPPED", "PICKEDUP", "CANCELLED", "ARRIVED", "DELIVERED", "CONFIRMED").required(),
    remark: Joi.string().required(),
    updatedBy: Joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
}) 
 
export const validateEstimate = Joi.object(estimateObject);
 
export const validateAdminCreate = Joi.object({
    name: Joi.string().trim().required(),
    parcels: Joi.array().items(
        Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    ).required(),
    amountPayable: Joi.number().min(0).required(),
    totalAmount: Joi.number().min(0).optional(),
    totalShipingFee: Joi.number().min(0).optional(),
    senderName:Joi.string().trim().required(),
    senderPhone: Joi.string().required(),
    senderEmail: Joi.string().email().required(),
    recipientName:Joi.string().trim().required(),
    recipientPhone: Joi.string().required(),
    recipientEmail: Joi.string().email().required(),
    pickupAddress: Joi.string().required(),
    pickupCoordinates: Joi.array().items(
        Joi.number()
    ).required(),
    deliveryAddress: Joi.string().required(),
    deliveryCoordinates: Joi.array().items(
        Joi.number()
    ).required(),
    status: Joi.string().valid("PENDING", "CHECKEDOUT", "SHIPPED", "PICKEDUP", "CANCELLED", "ARRIVED", "DELIVERED", "CONFIRMED").optional(),
    remark: Joi.string().required(),
    transactionRef: Joi.string().optional(),
    isCheckedOut: Joi.boolean().required(),
    paymentMethod: Joi.string().required(),
    paymentGateway: Joi.string().optional(),
    paymentStatus: Joi.string().required(),
    pickupDate: Joi.date().optional(),
    deliveryDate: Joi.date().optional(),
    createdBy: Joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .required()
 })
 
 export const validateCreate = Joi.object({
    name: Joi.string().trim().required(),
    parcels: Joi.array().items(
        Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    ).required(),
    amountPayable: Joi.number().min(0).required(), 
    totalAmount: Joi.number().min(0).optional(),
    totalShipingFee: Joi.number().min(0).optional(),
    senderName:Joi.string().trim().required(),
    senderPhone: Joi.string().required(),
    senderEmail: Joi.string().email().required(),
    recipientName:Joi.string().trim().required(),
    recipientPhone: Joi.string().required(),
    recipientEmail: Joi.string().email().required(),
    pickupAddress: Joi.string().required(),
    pickupCoordinates: Joi.array().items(
        Joi.number()
    ).required(),
    deliveryAddress: Joi.string().required(),
    deliveryCoordinates: Joi.array().items(
        Joi.number()
    ).required(),
    status: Joi.string().valid("PENDING", "CHECKEDOUT", "SHIPPED", "PICKEDUP", "CANCELLED", "ARRIVED", "DELIVERED", "CONFIRMED").optional(),
    remark: Joi.string().required(),
    isCheckedOut: Joi.boolean().required(),
    paymentMethod: Joi.string().required(),
    paymentGateway: Joi.string().optional(),
    paymentStatus: Joi.string().valid("PENDING", "SUCCESS", "FAIL").optional(),
    pickupDate: Joi.date().optional(),
    transactionRef: Joi.string().optional(),
    deliveryDate: Joi.date().optional(),
    createdBy: Joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
 })
 
 export const validateUpdate = Joi.object({
    code: Joi.string().optional(),
    name: Joi.string().trim().optional(),
    parcels: Joi.array().items(
        Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    ).optional(),
    amountPayable: Joi.number().min(0).optional(),
    totalAmount: Joi.number().min(0).optional(),
    totalShipingFee: Joi.number().min(0).optional(),
    senderName:Joi.string().trim().optional(),
    senderPhone: Joi.string().optional(),
    recipientName:Joi.string().trim().optional(),
    recipientPhone: Joi.string().optional(),
    pickupAddress: Joi.string().optional(),
    pickupCoordinates: Joi.array().items(
        Joi.number()
    ).optional(),
    deliveryAddress: Joi.string().optional(),
    deliveryCoordinates: Joi.array().items(
        Joi.number()
    ).optional(),
    status: Joi.string().optional(),
    remark: Joi.string().optional(),
    isCheckedOut: Joi.boolean().optional(),
    paymentMethod: Joi.string().optional(),
    paymentGateway: Joi.string().optional(),
    paymentStatus: Joi.string().optional(),
    pickupDate: Joi.date().optional(),
    transactionRef: Joi.string().optional(),
    deliveryDate: Joi.date().optional(),
    createdBy: Joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
    updatedBy: Joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
    deleted: Joi.boolean().optional(),
    deletedAt: Joi.date().optional(),
    deletedBy: Joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
 })
 
export const schema = {
    code: { type: String, uppercase: true, index: true, required: true },
    name: { type: String, trim: true },
    parcels: [{ type: String, ref: "Parcel" }],
    amountPayable: { type: Number, min: 1000, max: 9_000_000, deafult: 1 },
    totalAmount: { type: Number, max: 9_000_000, deafult: 1 },
    totalShipingFee: { type: Number, min: 500, max: 9_000_000, deafult: 1 },
     senderName: { type: String, required: true},
     senderPhone: { type: String, required: true},
     senderEmail: { type: String, required: true},
     recipientName: { type: String, required: true},
     recipientPhone: { type: String, required: true},
     recipientEmail: { type: String, required: true},
     pickupAddress: { type: String, required: true },
     pickupCoordinates: { type: Array, required: true },
     deliveryAddress: { type: String, required: true },
     deliveryCoordinates: { type: Array, required: true },
     status: { type: String,  enum: Object.values(PACKAGE.STATUS), default: "PENDING"},
     remark: { type: String },
     transactionRef: { type: String },
     isCheckedOut: { type: Boolean, required: true, default: false },
     paymentMethod: { type: String, enum: Object.values(PAYMENT.PAYMENT_METHOD) },
     paymentGateway: { type: String, enum: Object.values(PAYMENT.GATEWAY) },
     paymentStatus: {
       type: String,
       enum: Object.values(PAYMENT.STATUS),
       default: PAYMENT.STATUS.PENDING,
     },
     
     pickupDate: { type: Date },
     deliveryDate: { type: Date },
     createdBy: { type: ObjectId, ref: "User", required: true, select: true },
     updatedBy: { type: ObjectId, ref: "User", select: false },
     deleted: { type: Boolean, default: false, select: false },
     deletedAt: { type: Date, select: false },
     deletedBy: { type: ObjectId, select: false },
};
 
 const options = DATABASE.OPTIONS;
 
 const newSchema = new Schema(schema, options);
 
 newSchema.index({ code: 1 });
 
 newSchema.set("collection", "package");
 

 
 const Package = mongoose.model("Package", newSchema);
 
 export default Package;