/**
 * @author Nditah
 * @property {ObjectId} _id Parcel record Id (prohibited)
 * @property {String} name Parcel name (required)
 * @property {String} code Parcel code (required)
 * @property {ObjectId} sender Parcel Customer sender
 * @property {ObjectId} pickup Parcel pickup
 * @property {String} image Parcel image url string
 * @property {ObjectId} catgeory Parcel Customer catgeory
 * @property {Number} mass Parcel mass (optional)
 * @property {Number} volume Parcel volume (optional)
 * @property {Number} worth Parcel worth (required)
 * @property {Boolean} isInsured Parcel is insured (required)
 * @property {String} description Parcel description (required)
 * @description Parcel holds record of PARCEL Parcels
 */

import Joi from "joi";
import mongoose from 'mongoose';
import { DATABASE, PARCEL, PAYMENT, VEHICLE, COVERAGE } from "../../constant/index.js";
import { Location } from "../common/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const schemaFetch = Joi.object({
    id: Joi.string().optional(),
    skip: Joi.number().positive().optional(),
    limit: Joi.number().positive().optional(),
  });

  export const estimateObject = {
    items: Joi.array()
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

  export const validateEstimate = Joi.object(estimateObject);

export const validateAdminCreate = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().required(),
    quantity: Joi.number().integer().required(),
    volume: Joi.number().required(),
    mass: Joi.number().required(),
    worth: Joi.number().required(),
    parcelImage: Joi.string().optional(),
    deliveryAddress: Joi.string().required(),
    deliveryCoordinates: Joi.array().items(
        Joi.number()
    ).required(),
    senderName: Joi.string().required(),
    senderPhone: Joi.string().max(15).required(),
    senderEmail: Joi.string().email().required(),
    recipientName: Joi.string().required(),
    recipientPhone: Joi.string().max(15).required(),
    recipientEmail: Joi.string().email().required(),
    pickupAddress: Joi.string().required(),
    pickupCoordinates: Joi.array().items(
        Joi.number()
    ).required(),
    departureDate: Joi.date().required(),
    expectedDate:  Joi.date().required(),
    deliveryDate:  Joi.date().optional(),
    status: Joi.string().valid("PENDING", "PACKAGED", "SHIPPED", "ARRIVED", "DELIVERED", "CONFIRMED").optional(),
    isParcelPaid: Joi.boolean().required(),
    category: Joi.string().required(),
    amountPayable: Joi.number().min(1000).max(9999999999999).required(),
    shippingFee: Joi.number().min(100).required(),
    identification: Joi.string().valid("NATIONAL_ID", "VOTERS_CARD", "COMPANY_ID", "DRIVERS_LICENSE").required(),
    paymentMethod: Joi.string().valid(PAYMENT.PAYMENT_METHOD).required(),
    paymentGateway: Joi.string().valid(PAYMENT.GATEWAY).required(),
    paymentStatus: Joi.string().valid(PAYMENT.STATUS).default(PAYMENT.STATUS.PENDING).required(),
    remark: Joi.string().optional(),
    createdBy: Joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .required(),
})

export const validateCreate = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().required(),
    quantity: Joi.number().integer().required(),
    volume: Joi.number().required(),
    mass: Joi.number().required(),
    worth: Joi.number().required(),
    parcelImage: Joi.string().optional(),
    deliveryAddress: Joi.string().required(),
    deliveryCoordinates: Joi.array().items(
        Joi.number()
    ).required(),
    senderName: Joi.string().required(),
    senderPhone: Joi.string().max(15).required(),
    senderEmail: Joi.string().email().required(),
    recipientName: Joi.string().required(),
    recipientPhone: Joi.string().max(15).required(),
    recipientEmail: Joi.string().email().required(),
    pickupAddress: Joi.string().required(),
    pickupCoordinates: Joi.array().items(
        Joi.number()
    ).required(),
    departureDate: Joi.date().optional(),
    expectedDate:  Joi.date().optional(),
    deliveryDate:  Joi.date().optional(),
    status: Joi.string().valid("PENDING", "PACKAGED", "SHIPPED", "ARRIVED", "DELIVERED", "CONFIRMED").optional(),
    isParcelPaid: Joi.boolean().required(),
    category: Joi.string().required(),
    amountPayable: Joi.number().min(1000).max(9999999999999).optional(), // estimate billing and add to amountPayable
    shippingFee: Joi.number().min(100).optional(), // estimate shipping fee and add to shipping fee
    identification: Joi.string().valid("NATIONAL_ID", "VOTERS_CARD", "COMPANY_ID", "DRIVERS_LICENSE").required(),
    remark: Joi.string().optional(),
    createdBy: Joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .required(),
})

export const validateUpdate = Joi.object({
    name: Joi.string().trim().optional(),
    description: Joi.string().optional(),
    quantity: Joi.number().integer().optional(),
    category: Joi.string().optional(),
    volume: Joi.number().optional(),
    mass: Joi.number().optional(),
    worth: Joi.number().optional(),
    parcelImage: Joi.string().optional(),
    deliveryAddress: Joi.string().optional(),
    deliveryCoordinates: Joi.array().items(
        Joi.number()
    ).optional(),
    senderName: Joi.string().optional(),
    senderPhone: Joi.string().max(15).optional(),
    senderEmail: Joi.string().email().optional(),
    recipientName: Joi.string().optional(),
    recipientPhone: Joi.string().max(15).optional(),
    recipientEmail: Joi.string().email().optional(),
    pickupAddress: Joi.string().optional(),
    pickupCoordinates: Joi.array().items(
        Joi.number()
    ).optional(),
    departureDate: Joi.date().optional(),
    expectedDate:  Joi.date().optional(),
    deliveryDate:  Joi.date().optional(),
    shippedDate:   Joi.date().optional(),
    confirmDate:   Joi.date().optional(),
    status: Joi.string().valid("PENDING", "PACKAGED", "SHIPPED", "ARRIVED", "DELIVERED", "CONFIRMED").optional(),
    isParcelPaid: Joi.boolean().optional(),
    amountPayable: Joi.number().min(1000).max(9999999999999).optional(),
    shippingFee: Joi.number().min(100).optional(),
    identification: Joi.string().valid("NATIONAL_ID", "VOTERS_CARD", "COMPANY_ID", "DRIVERS_LICENSE").optional(),
    paymentGateway: Joi.string().optional(),
    paymentMethod: Joi.string().optional(),
    paymentStatus: Joi.string().optional(),
    remark: Joi.string().optional(),
    updatedBy: Joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
})

export const schema = {
    name: { type: String, trim: true },
    code: { type: String, uppercase: true, index: true, required: true },
    quantity: { type: Number, min: 0, deafult: 1 },
    mass: { type: Number, min: 0, max: 9_000_000, deafult: 1, comment: "Kg" },
    // sender: { type: ObjectId, ref: "User", required: true, index: true },
    volume: {
      type: Number,
      min: 0,
      max: 9_000_000_000,
      deafult: 1,
      comment: "Cm3",
    },
    worth: {
      type: Number,
      min: 0,
      max: 9_000_000_000,
      deafult: 1,
      comment: "NGN",
    },
    category: { type: String, required: true },
    distance: {
      type: Number,
      min: 0,
      max: 50_000,
      comment: "Km",
    //   required: true,
    },
    description: { type: String },
    
    parcelImage: { type: String },
    deliveryAddress: { type: String, required: true },
    deliveryCoordinates: { type: Array, required: true },
    senderName: { type: String, required: true },
    senderPhone: { type: String, required: true },
    senderEmail: { type: String, required: true },
    recipientName: { type: String, required: true },
    recipientPhone: { type: String, required: true },
    recipientEmail: { type: String, required: true },
    pickupAddress: { type: String, required: true },
    pickupCoordinates: { type: Array, required: true },
    status: { type: String, required: true, default: "PENDING"},
    isParcelPaid: { type: Boolean },
    category: { type: String },
    amountPayable: { type: Number, default: 1000, required: true },
    shippingFee: { type: Number, default: 500, required: true },
    identification: { type: String },

    depatureDate: { type: Date }, // Parcel Departure date
    expectedDate: { type: Date }, // Parcel Departure date
    remark: { type: String },
    amountPayable: {
      type: Number,
      default: PARCEL.MIN_CHARGE,
      min: PARCEL.MIN_CHARGE,
      max: PARCEL.MAX_CHARGE,
    },
    paymentMethod: { type: String, enum: Object.values(PAYMENT.PAYMENT_METHOD) },
    paymentGateway: { type: String, enum: Object.values(PAYMENT.GATEWAY) },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT.STATUS),
      default: PAYMENT.STATUS.PENDING,
    },
    
    pickupDate: { type: Date },
    shippedDate: { type: Date },
    deliveryDate: { type: Date },
    confirmDate: { type: Date },
    createdBy: { type: ObjectId, ref: "User", required: true, select: true },
    updatedBy: { type: ObjectId, ref: "User", select: false },
    deleted: { type: Number, enum: [0, 1], default: 0, select: false },
    deletedAt: { type: Date, select: false },
    deletedBy: { type: ObjectId, select: false },
};

const options = DATABASE.OPTIONS;

const newSchema = new Schema(schema, options);

newSchema.index({ code: 1 });

newSchema.set("collection", "parcel");

// /**
//  * 
//  * @param {Array} coordinates [lng, lat] 
//  * @param {Number} maxDistance max distance in meters
//  * @returns 
//  */
//  newSchema.statics.findByParcelCoordinates = function({ coordinates, maxDistance }) {
//     return this.aggregate([{
//       $geoNear: {
//         near: {
//           type: "Point",
//           coordinates: coordinates
//         },
//         maxDistance: maxDistance,
//         distanceField: "dist.calculated",
//         spherical: true,
//         limit: 100,
//         query: {}
//       }
//     }]);
//   };

const Parcel = mongoose.model("Parcel", newSchema);

export default Parcel;