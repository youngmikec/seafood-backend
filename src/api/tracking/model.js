import mongoose from 'mongoose';
import Joi from 'joi';
import { DATABASE } from '../../constant/index.js';



const { Schema } = mongoose;
const { ObjectId } = Schema.Types;


export const validateCreate = Joi.object({
    trackingCode: Joi.string().required(),
    shipment: Joi.string().regex(DATABASE.OBJECT_ID_REGEX).optional(),
    createdBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX).optional(),
});

export const validateUpdate = Joi.object({
    trackingCode: Joi.string().optional(),
    shipment: Joi.string().regex(DATABASE.OBJECT_ID_REGEX).optional(),
    createdBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX).optional(),
});



export const schema = {
    code: { type: String, uppercase: true, index: true, required: true },
    trackingCode: { type: String, required: true },
    shipment: { type: ObjectId, ref: 'Shipment',  required: true },
    createdAt: { type: Date },
    createdBy: { type: ObjectId, ref: 'User', select: true },
    updatedBy: { type: ObjectId, ref: "User", select: false },
    deleted: { type: Boolean, default: false, select: false },
    deletedAt: { type: Date, select: false },
    deletedBy: { type: ObjectId, select: false },
}


const options = DATABASE.OPTIONS;

const newSchema = new Schema(schema, options);

newSchema.index({code: 1});

newSchema.set("collection", "tracking");

const Tracking = mongoose.model("Tracking", newSchema);

export default Tracking;