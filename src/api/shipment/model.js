import Joi from 'joi';
import mongoose from 'mongoose';
import { DATABASE } from "../../constant/index.js";


const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const validateOperation = Joi.object({
    status: Joi.string().valid("LOADING", "DEPARTED", "ARRIVED").required(),
    remark: Joi.string().required(),
    updatedBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
})


export const validateCreate = Joi.object({
    packages: Joi.array().items(
        Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    ).required(),
    locationFrom: Joi.object().keys({
        point: Joi.string().valid("point").optional(),
        address: Joi.string().trim().required(),
        coordinates: Joi.array().items(
            Joi.number()
        ).required()
    }).required(),
    destination: Joi.object().keys({
        point: Joi.string().valid("point").optional(),
        address: Joi.string().trim().required(),
        coordinates: Joi.array().items(
            Joi.number()
        ).required()
    }).required(),
    currentLocation: Joi.object().keys({
        point: Joi.string().valid("point").optional(),
        address: Joi.string().trim().required(),
        coordinates: Joi.array().items(
            Joi.number()
        ).required()
    }).required(),
    status: Joi.string().valid("LOADING").required(),
    departureDate: Joi.date().required(),
    expectedDate: Joi.date().required(),
    courierName: Joi.string().required(),
    courierPhone: Joi.string().required(),
    vehicleType: Joi.string().valid("BUS", "BIKE", "SHIP", "AIRCRAFT").required(),
    vehicleDetail: Joi.string().required(),
    isVehicleFull: Joi.boolean().required(),
    remark: Joi.string().required(),
    createdBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").required(),
});

export const validateUpdate = Joi.object({
    packages: Joi.array().items(
        Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    ).optional(),
    locationFrom: Joi.object().keys({
        point: Joi.string().valid("point").optional(),
        address: Joi.string().trim().required(),
        coordinates: Joi.array().items(
            Joi.number()
        ).required()
    }).optional(),
    destination: Joi.object().keys({
        point: Joi.string().valid("point").optional(),
        address: Joi.string().trim().required(),
        coordinates: Joi.array().items(
            Joi.number()
        ).required()
    }).optional(),
    currentLocation: Joi.object().keys({
        point: Joi.string().valid("point").optional(),
        address: Joi.string().trim().required(),
        coordinates: Joi.array().items(
            Joi.number()
        ).required()
    }).optional(),
    departureDate: Joi.date().optional(),
    expectedDate: Joi.date().optional(),
    courierName: Joi.string().optional(),
    courierPhone: Joi.string().optional(),
    vehicleType: Joi.string().valid("BUS", "BIKE", "SHIP", "AIRCRAFT").optional(),
    vehicleDetail: Joi.string().optional(),
    isVehicleFull: Joi.boolean().optional(),
    remark: Joi.string().optional(),
    createdBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
    updatedBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
});

export const schema = {
    code: { type: String, uppercase: true, index: true, required: true },
    packages: [{ type: String, ref: "Package" }],
    locationFrom: { type: Object, required: true},
    destination: { type: Object, required: true},
    currentLocation: { type: Object, required: true},
    courierName: { type: String, required: true }, 
    courierPhone: { type: String, required: true }, 
    vehicleType: { type: String, required: true }, 
    vehicleDetail: { type: String, required: true }, 
    isVehicleFull: { type: Boolean, required: true }, 
    remark: { type: String },
    status: { type: String, required: true, default: "LOADING"},
    departureDate: { type: Date },
    expectedDate: { type: Date },
    createdBy: { type: ObjectId, ref: "User", required: true, select: true },
    updatedBy: { type: ObjectId, ref: "User", select: true },
    deleted: { type: Boolean, default: false, select: false },
    deletedAt: { type: Date, select: false },
    deletedBy: { type: ObjectId, select: false },
};



const options = DATABASE.OPTIONS;

const newSchema =  new Schema(schema, options);

newSchema.index({code: 1});

newSchema.set("collection", "shipment");

const Shipment = mongoose.model("Shipment", newSchema);

export default Shipment;

