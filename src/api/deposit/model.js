import mongoose from 'mongoose';
import Joi from 'joi';
import { DATABASE, DEPOSIT } from '../../constant/index.js';


const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const validateCreate = Joi.object({
    amount: Joi.number().min(1000).max(500000).required(),
    pin: Joi.string().trim().min(5).max(5).required(),
    depositorBank: Joi.string().trim().required(),
    depositorAcctName: Joi.string().trim().required(), 
    depositorAcctNum: Joi.string().trim().required(),
    transactionStatus: Joi.string().valid(...Object.values(DEPOSIT.TRXNSTATUS)).required(),
    createdBy: Joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
})

export const validateUpdate = Joi.object({
    amount: Joi.number().min(1000).max(500000).optional(),
    depositorBank: Joi.string().trim().optional(),
    depositorAcctName: Joi.string().trim().optional(), 
    depositorAcctNum: Joi.string().trim().optional(),
    transactionStatus: Joi.string().valid(...Object.values(DEPOSIT.TRXNSTATUS)).optional(),
    updatedBy: Joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
})

export const validateOperation = Joi.object({
    status: Joi.string().valid(...Object.values(DEPOSIT.STATUS)).required(),
    remark: Joi.string().trim().required(),

})


export const schema = {
    code: { type: String, required: true, select: true },
    user: { type: ObjectId, ref: "User", select: true },
    pin: { type: String, required: true, select: false },
    amount: { type: Number, },
    depositorBank: { type: String, required: true},
    depositorAcctName: { type: String, required: true},
    depositorAcctNum: { type: String, required: true},
    transactionStatus: { type: String, enums: Object.values(DEPOSIT.TRXNSTATUS), select: true },
    status: { type: String, enums: Object.values(DEPOSIT.STATUS), default: DEPOSIT.STATUS.PENDING, select: true },
    createdBy: { type: ObjectId, ref: "User", required: true, select: true },
    updatedBy: { type: ObjectId, ref: "User", select: false },
    deleted: { type: Boolean, default: false, select: false },
    deletedAt: { type: Date, select: false },
    deletedBy: { type: ObjectId, select: false },
}

const options = DATABASE.OPTIONS;

const newSchema = new Schema(schema, options);

newSchema.index({ code: 1 });

newSchema.set('collection', 'deposit');

const Deposit = mongoose.model('Deposit', newSchema);

export default Deposit;