import aqp from 'api-query-params';

import Package, { 
    // validateCheckout,
    validateCreate,
    validateAdminCreate,
    validateUpdate,
    validateOperation,
} from "./model.js";
import User from '../user/model.js';
import Parcel from '../parcel/model.js';
import Shipment from '../shipment/model.js';
import * as ParcelService from '../parcel/service.js';
// import Wallet from '../wallet/model.js';
import {
  generateModelCode,
  setLimit,
  computeBalance,
  // loging,
} from "../../util/index.js";
import { PAYMENT, USER_TYPE,  } from "../../constant/index.js";
import { sendMail } from "../../services/index.js";

const module = 'Package';

// send mail function
const sendMailService = async (data, subject, message) => {
  try{
    const result = await sendMail(
      'michaelozor15@seafood.com',
      data.senderEmail,
      subject,
      message
    );
    console.log('Mail sent successfully');
  }catch (err){
    console.error(err);
  }
}

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
      
      const mailResponse = await sendMailService(
        data,
        'Package Created Successfully',
        `
        <b>
          Dear customer ${data.senderName || ''}, your package with ${parcels.length || 0} parcel item(s) has been created successfully.
          Package is currently awaiting shipment.
          Your package Code: <h3>${data.code}</h3>
          Thank you for trusting us.
        </b>
        `
      );
      return result;
    } catch (err) {
      throw new Error(`Error creating ${module} record. ${err.message}`);
    }
  }

  export async function createService(data) {
    const session = await Package.startSession();
    session.startTransaction({
      readConcern: { level: "snapshot"},
      writeConcern: { w : 1},
    });

    try {
      const { error } = validateCreate.validate(data);
      if (error) {
        throw new Error(`Invalid request. ${error.message}`);
      }
      
      const { paymentMethod, amountPayable } = data;
      let { parcels } = data;
      let newParcels = [];
      let parcelIds = [];

      const senderObj = await User.findById(data.createdBy).exec();
      if (!senderObj) throw new Error(`Sender ${data.createdBy} not found`);

      for(let i = 0; i < parcels.length; i ++ ){
        const payload = { ...parcels[i], createdBy: data.createdBy };
        const newParcel = await ParcelService.createService(payload);
        if(! newParcel ){
          throw new Error(`Error creating parcel`);
          break;
        }
        parcelIds.push(newParcel['_id']);
        newParcels.push(newParcel);
      }
      // const parcelRecords = await Parcel.find().where('_id').in(parcelsId).exec();
      
      if(newParcels.length > 0){
        const { amount, shippingFee } = calculateCost(newParcels);
        data.totalAmount = amount;
        data.totalShipingFee = shippingFee;
        if(paymentMethod === 'WALLET'){
          const computedAmount = computeBalance(senderObj.balance, amountPayable, 'sub');
          const updatedUserWalletBalance = await User.findOneAndUpdate({_id: senderObj.id}, {balance: computedAmount},  {new: true}).exec();
          if(!updatedUserWalletBalance){
            data.paymentStatus = "FAIL";
            data.isCheckedOut = false;
            throw new Error("Error is handling transaction");
          }
          data.paymentStatus = "SUCCESS";
          data.isCheckedOut = true;

        }
        data.status = 'CHECKEDOUT';

        // updateParcelStatus(parcelRecords);
        const updatedParcels = await Parcel.updateMany({_id: parcelIds}, {$set: {"status": 'PACKAGED'}});
        if(!updatedParcels){
          throw new Error(`Error updating parcel status`);
        }

      }

      data.code = await generateModelCode(Package);
      data.shippingCode = await generateModelCode(Shipment);
      data.createdBy = senderObj.id;

      const previousRecord = await Package.findOne({name: data.name}).exec();
      if(previousRecord) throw new Error(`Record already exist for specifed name`);
      
      data.parcels = parcelIds;
      
      const newRecord = new Package(data);
      const result = await newRecord.save();
      if (!result) {
        throw new Error(`${module} record not found.`);
      }
      const mailResponse = await sendMailService(
        data,
        'Package Created Successfully',
        `
        <b>
          Dear customer ${data.senderName || ''}, your package with ${parcels.length || 0} parcel item(s) has been created successfully.
          Package is currently awaiting shipment.
          Your package Code: <h3>${data.code}</h3>
          Thank you for trusting us.
        </b>
        `
      );
      await session.commitTransaction();
      session.endSession();
      return result;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
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
      if (`${returnedPackage.createdBy}` !== user.id && user.userType !== 'ADMIN') {
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

  export async function operationService(recordId, data, user) {
    try {
      const { error } = validateOperation.validate(data);
      if (error) {
        throw new Error(`Invalid request. ${error.message}`);
      }
      const { status } = data;
      
      const returnedPackage = await Package.findById(recordId).populate('parcels').exec();
      if (!returnedPackage) throw new Error(`${module} record not found.`);
      if (`${returnedPackage.createdBy}` !== user.id && user.userType !== 'ADMIN') {
        throw new Error(`user ${user.email} is not the sender`);
      }
      // if (`${returnedPackage.paymentStatus}` !== PAYMENT.STATUS.PENDING) {
      //   console.log(returnedPackage);
      //   throw new Error(`Payment Status is  ${returnedPackage.paymentStatus}`);
      // }
      const { parcels } = returnedPackage;
      const parcelsArray = parcels.map(item => item.id);
      
      if(parcels.length > 0){
        if(status === 'DELIVERED'){
          const updatedParcels = await Parcel.updateMany({_id: parcelsArray}, {$set: {"status": 'DELIVERED'}});
          if(!updatedParcels){
            throw new Error(`Error updating Package status`);
          }
          const mailResponse = await sendMailService(
            returnedPackage,
            'Turah Logistics Delivery Mail',
            `
            <p>
              Dear customer ${returnedPackage.senderName || ''}, your package(s) <b>${returnedPackage.code ? `with package Code ` + returnedPackage.code : ''}</b> has been delivered successfully.
              Thank you for trusting us.
            </p>
            `
          );

          if(!mailResponse) console.error('error sending Email');
        }

        if(status === 'CONFIRMED'){
          const updatedParcels = await Parcel.updateMany({_id: parcelsArray}, {$set: {"status": 'CONFIRMED'}});
          if(!updatedParcels){
            throw new Error(`Error updating Package status`);
          }
        }
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