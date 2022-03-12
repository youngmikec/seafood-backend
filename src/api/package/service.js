import aqp from 'api-query-params';

import Package, { 
    validateCheckout,
    validateCreate,
    validateAdminCreate,
    validateUpdate,

} from "./model.js";
import User from '../user/model.js';
import Parcel from '../parcel/model.js';
import {
  generateModelCode,
  isObjecId,
  safeGet,
  getSettings,
  setLimit,
  loging,
  calculateDistance,
} from "../../util/index.js";
import { PARCEL, PAYMENT, USER_TYPE } from "../../constant/index.js";

const module = 'Package';

export async function fetchService({ query, user }) {
    try {
      const { filter, skip, sort, projection, population } = aqp(query);
      let { limit } = aqp(query);
      limit = setLimit(limit);
      if (!filter.deleted) filter.deleted = false;
      if (user.userType !== USER_TYPE.ADMIN) {
        filter.$or = [{ senderPhone: user.phone }, { createdBy: user.id }];
      }
      const total = await Package.countDocuments(filter).exec();
      const result = await Package.find(filter)
        .populate(population)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .select(projection)
        .exec();
      if (!result) {
        throw new Error(`${module} record not found.`);
      }
      const count = result.length;
      const msg = `${count} ${module} record(s) retrieved successfully!`;
      return { payload: result, total, count, msg, skip, limit, sort };
    } catch (err) {
      throw new Error(`Error retrieving ${module} record. ${err.message}`);
    }
  }

  // const updateParcelStatus = (records) => {
  //   const result = await Parcel.updateMany({})
  // }

  const calculateCost = (records) => {
    const cummulativeAmount = records.map(item => item.amountPayable).reduce((a,b) => a + b);
    const cummulativeShippingFee = records.map(item => item.shippingFee).reduce((a,b) => a + b);
    return { amount: cummulativeAmount, shippingFee: cummulativeShippingFee };
  }

  export async function adminCreateService(data) {
    try {
      const { error } = validateAdminCreate.validate(data);
      if (error) {
        throw new Error(`Invalid request. ${error.message}`);
      }
      // validateParcelDate(data);
      // if (!data.sender) data.sender = data.createdBy;
      const { parcels } = data;
      const parcelRecords = await Parcel.find().where('_id').in(parcels).exec();
    
      if(parcelRecords){
        const { amount, shippingFee } = calculateCost(parcelRecords);
        data.totalAmount = amount;
        data.totalShipingFee = shippingFee;
        // updateParcelStatus(parcelRecords);
        const updatedParcels = await Parcel.updateMany({_id: parcels}, {$set: {"status": 'PACKAGED'}});
        if(!updatedParcels){
          throw new Error(`Error updating parcel status`);
        }

      }
      data.code = await generateModelCode(Package);
      const senderObj = await User.findById(data.createdBy).exec();
      if (!senderObj) throw new Error(`Sender ${data.createdBy} not found`);
      // data.amountPayable = generateAmountPayable(data);
      data.createdBy = senderObj.id;
      
      const newRecord = new Package(data);
      const result = await newRecord.save();
      if (!result) {
        throw new Error(`${module} record not found.`);
      }
      return result;
    } catch (err) {
      throw new Error(`Error creating ${module} record. ${err.message}`);
    }
  }
  export async function createService(data) {
    try {
      const { error } = validateCreate.validate(data);
      if (error) {
        throw new Error(`Invalid request. ${error.message}`);
      }
      // validateParcelDate(data);
      // if (!data.sender) data.sender = data.createdBy;
      const { parcels } = data;
      const parcelRecords = await Parcel.find().where('_id').in(parcels).exec();
      
      if(parcelRecords){
        const { amount, shippingFee } = calculateCost(parcelRecords);
        data.totalAmount = amount;
        data.totalShipingFee = shippingFee;
        // updateParcelStatus(parcelRecords);
        const updatedParcels = await Parcel.updateMany({_id: parcels}, {$set: {"status": 'PACKAGED'}});
        if(!updatedParcels){
          throw new Error(`Error updating parcel status`);
        }

      }
      data.code = await generateModelCode(Package);
      const senderObj = await User.findById(data.createdBy).exec();
      if (!senderObj) throw new Error(`Sender ${data.createdBy} not found`);
      // data.amountPayable = generateAmountPayable(data);
      data.createdBy = senderObj.id;
      
      const newRecord = new Package(data);
      const result = await newRecord.save();
      if (!result) {
        throw new Error(`${module} record not found.`);
      }
      return result;
    } catch (err) {
      throw new Error(`Error creating ${module} record. ${err.message}`);
    }
  }

  export async function updateService(recordId, data, user) {
    try {
      const { error } = validateUpdate.validate(data);
      if (error) {
        throw new Error(`Invalid request. ${error.message}`);
      }

      const returnedPackage = await Package.findById(recordId).exec();
      if (!returnedPackage) throw new Error(`${module} record not found.`);
      if (`${returnedPackage.createdBy}` !== user.id) {
        throw new Error(`user ${user.email} is not the sender`);
      }
      if (`${returnedPackage.paymentStatus}` !== PAYMENT.STATUS.PENDING) {
        throw new Error(`Payment Status is  ${returnedPackage.paymentStatus}`);
      }
     
      const result = await Package.findOneAndUpdate({ _id: recordId }, data, {
        new: true,
      }).exec();
      if (!result) {
        throw new Error(`${module} record not found.`);
      }
      return result;
    } catch (err) {
      throw new Error(`Error updating ${module} record. ${err.message}`);
    }

  }
  
  export async function deleteService(recordId) {
    try {
      const result = await Package.findOneAndRemove({ _id: recordId });
      if (!result) {
        throw new Error(`${module} record not found.`);
      }
      return result;
    } catch (err) {
      throw new Error(`Error deleting ${module} record. ${err.message}`);
    }
  }