import mongoose from 'mongoose';
import { DATABASE, WALLET } from "../../constant/index.js";
import Joi from 'joi';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;


export const validateCreate = Joi.object({
    balance: Joi.number().optional(),
    pin: Joi.string().trim().min(4).max(4).optional(),
    user: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").required(),
    createdBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
});

export const validateUpdate = Joi.object({
    walletId: Joi.string().optional(),
    balance: Joi.number().optional(),
    pin: Joi.string().trim().min(4).max(4).optional(),
    createdBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
});

export const validateFundWallet = Joi.object({
    walletId: Joi.string().required(),
    amount: Joi.number().min(10).max(999999999999).required(),
    transactionRef: Joi.string().required(),
    createdBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
    updatedBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
});

export const validateTransfer = Joi.object({
    walletFrom: Joi.string().required(),
    walletTo: Joi.string().required(),
    amount: Joi.number().min(10).max(999999999999).required(),
    pin: Joi.string().trim().min(4).max(4).required(),
    createdBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
    updatedBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
});

export const schema = {
    walletId: { type: String, uppercase: true, index: true, required: true },
    pin: { type: String, index: true, select: false },
    balance: { type: Number, max: 9_000_000, default: 0.00, select: true },
    status: { type: String,  enum: Object.values(WALLET.STATUS), default: "PENDING"},
    transactionRef: { type: String },
    user: { type: ObjectId, ref: "User", required: true, select: true },
    createdBy: { type: ObjectId, ref: "User", required: true, select: true },
    updatedBy: { type: ObjectId, ref: "User", select: false },
    deleted: { type: Boolean, default: false, select: false },
    deletedAt: { type: Date, select: false },
    deletedBy: { type: ObjectId, select: false },
};
 
 const options = DATABASE.OPTIONS;
 
 const newSchema = new Schema(schema, options);
 
 newSchema.index({ walletId: 1 });
 
 newSchema.set("collection", "wallet");
 

 
 const Wallet = mongoose.model("Wallet", newSchema);
 
 export default Wallet;