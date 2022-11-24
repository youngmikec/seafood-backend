import aqp from 'api-query-params';

import User from '../user/model.js';
import Deposit, { 
    validateCreate,
    validateUpdate,
    validateOperation,
} from './model.js'
import {
  generateModelCode,
  setLimit,
  // loging,
} from "../../util/index.js";
import { PAYMENT, USER_TYPE,  } from "../../constant/index.js";

const module = 'Deposit';


export async function fetchService({ query, user }) {
    try {
      const { filter, skip, sort, projection, population } = aqp(query);
      let { limit } = aqp(query);
      limit = setLimit(limit);
      if (!filter.deleted) filter.deleted = false;
      if (user.userType !== USER_TYPE.ADMIN) {
        filter.$or = [{ senderPhone: user.phone }, { createdBy: user.id }];
      }
      const total = await Deposit.countDocuments(filter).exec();
      const result = await Deposit.find(filter)
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


//   export async function adminCreateService(data) {
//     try {
//       const { error } = validateAdminCreate.validate(data);
//       if (error) {
//         throw new Error(`Invalid request. ${error.message}`);
//       }
     
//       const { parcels } = data;
//       const parcelRecords = await Parcel.find().where('_id').in(parcels).exec();
    
//       if(parcelRecords){
//         const { amount, shippingFee } = calculateCost(parcelRecords);
//         data.totalAmount = amount;
//         data.totalShipingFee = shippingFee;
//         // updateParcelStatus(parcelRecords);
//         const updatedParcels = await Parcel.updateMany({_id: parcels}, {$set: {"status": 'PACKAGED'}});
//         if(!updatedParcels){
//           throw new Error(`Error updating parcel status`);
//         }

//       }
//       data.code = await generateModelCode(Package);
//       const senderObj = await User.findById(data.createdBy).exec();
//       if (!senderObj) throw new Error(`Sender ${data.createdBy} not found`);
//       // data.amountPayable = generateAmountPayable(data);
//       data.createdBy = senderObj.id;
      
//       const newRecord = new Package(data);
//       const result = await newRecord.save();
//       if (!result) {
//         throw new Error(`${module} record not found.`);
//       }
      
//       const mailResponse = await sendMailService(
//         data,
//         'Package Created Successfully',
//         `
//         <b>
//           Dear customer ${data.senderName || ''}, your package with ${parcels.length || 0} parcel item(s) has been created successfully.
//           Package is currently awaiting shipment.
//           Your package Code: <h3>${data.code}</h3>
//           Thank you for trusting us.
//         </b>
//         `
//       );
//       return result;
//     } catch (err) {
//       throw new Error(`Error creating ${module} record. ${err.message}`);
//     }
//   }



export async function createService(data) {
const session = await Deposit.startSession();
session.startTransaction({
    readConcern: { level: "snapshot"},
    writeConcern: { w : 1},
});

try {
    const { error } = validateCreate.validate(data);
    if (error) {
    throw new Error(`Invalid request. ${error.message}`);
    }

    const senderObj = await User.findById(data.createdBy).exec();
    if (!senderObj) throw new Error(`User ${data.createdBy} not found`);

    data.code = await generateModelCode(Deposit);
    data.createdBy = senderObj.id;
    data.user = senderObj.id;
    
    let previousRecord = await Deposit.findOne({code: data.code}).exec();
    if(previousRecord){
    data.code = await generateModelCode(Deposit);
    previousRecord = await Deposit.findOne({code: data.code}).exec();
    if(previousRecord) throw new Error(`Record already exist for specifed name`);
    }
    
    const newRecord = new Deposit(data);
    const result = await newRecord.save();
    if (!result) {
    throw new Error(`${module} record not found.`);
    }
    
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

      const returnedDeposit = await Deposite.findById(recordId).exec();
      if (!returnedDeposit) throw new Error(`${module} record not found.`);
      if (`${returnedDeposit.createdBy}` !== user.id && user.userType !== 'ADMIN') {
        throw new Error(`user ${user.email} is not the account owner`);
      }
      
     
      const result = await Deposit.findOneAndUpdate({ _id: recordId }, data, {
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
      
      const returnedDeposit = await Deposite.findById(recordId).exec();
      if (!returnedDeposit) throw new Error(`${module} record not found.`);
      if (user.userType !== 'ADMIN') {
        throw new Error(`user ${user.email} cannot perform this action`);
      }
      if (`${returnedDeposit.STATUS}` !== DEPOSIT.STATUS.PENDING) {
        throw new Error(`Cannot perform ${status} on record with ${returnedDeposit.status}`);
      }
    
      const result = await Deposit.findOneAndUpdate({ _id: recordId }, data, {
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
      const result = await Deposit.findOneAndRemove({ _id: recordId });
      if (!result) {
        throw new Error(`${module} record not found.`);
      }
      return result;
    } catch (err) {
      throw new Error(`Error deleting ${module} record. ${err.message}`);
    }
  }