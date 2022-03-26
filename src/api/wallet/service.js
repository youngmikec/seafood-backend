import aqp from 'api-query-params';
import bcrypt from 'bcrypt'
import Wallet, { 
    validateCreate,
    validateUpdate,
    validateFundWallet,
    validateTransfer,

} from "./model.js";
import User from '../user/model.js';

import {
  generateModelCode,
  isObjecId,
  safeGet,
  getSettings,
  setLimit,
  loging,
  calculateDistance,
} from "../../util/index.js";
import { PAYMENT, USER_TYPE, WALLET, JWT } from "../../constant/index.js";

const module = 'Wallet';


export async function fetchService({ query, user }) {
    try {
      const { filter, skip, sort, projection, population } = aqp(query);
      let { limit } = aqp(query);
      limit = setLimit(limit);
      if (!filter.deleted) filter.deleted = false;
      if (user.userType !== USER_TYPE.ADMIN) {
        // filter.$or = [{ senderPhone: user.phone }, { createdBy: user.id }];
        filter.createdBy = user.id;
      }
      const total = await Wallet.countDocuments(filter).exec();
      const result = await Wallet.find(filter)
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
//       // validateParcelDate(data);
//       // if (!data.sender) data.sender = data.createdBy;
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
//       const userObj = await User.findById(data.createdBy).exec();
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

const hashPin = (pin) => {
    let result = '';
    bcrypt.hash(pin, JWT.saltRounds, (err, hash) => {
        // Store hash in your password DB.
        result = hash;
    });
    return result;
}

const decryptPin = async (pin, hash) => {
    const result = await bcrypt.compare(pin, hash);
    return result;
}

export async function createService(data) {
    try {
      const { error } = validateCreate.validate(data);
      if (error) {
        throw new Error(`Invalid request. ${error.message}`);
      }
      
      data.walletId = await generateModelCode(Wallet);
      const { pin } = data;
      if(pin){
        data.status = 'APPROVED'
        bcrypt.hash(pin, JWT.saltRounds, async (err, hash) => {
            // Store hash in data.pin.
            data.pin = hash;
        });
      }
      const userObj = await User.findById(data.user).exec();
      if (!userObj) throw new Error(`User ${data.createdBy} not found`);
      // data.amountPayable = generateAmountPayable(data);
      data.createdBy = userObj.id;
      
      const newRecord = new Wallet(data);
      const result = await newRecord.save();
      if (!result) {
        throw new Error(`${module} record not found.`);
      }

      //Update user to have wallet
      const updatedUser = await User.findOneAndUpdate({_id: userObj.id}, {wallet: result.id}, {new: true}).exec();
      if(!updatedUser){
          throw new Error("Error Assigning wallet to user");
      }
      return result;
    } catch (err) {
      throw new Error(`Error creating ${module} record. ${err.message}`);
    }
  }

// update Wallet service
export async function updateService(recordId, data, user) {
    try {
      const { error } = validateUpdate.validate(data);
      if (error) {
        throw new Error(`Invalid request. ${error.message}`);
      }

      const returnedWallet = await Wallet.findById(recordId).exec();
      if (!returnedWallet) throw new Error(`${module} record not found.`);
      if (`${returnedWallet.createdBy}` !== user.id) {
        throw new Error(`user ${user.email} is not the owner of this wallet`);
      }
     
      const result = await Wallet.findOneAndUpdate({ _id: recordId }, data, {
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
  
  // delete wallet service
  export async function deleteService(recordId) {
    try {
      const result = await Wallet.findOneAndRemove({ _id: recordId });
      if (!result) {
        throw new Error(`${module} record not found.`);
      }
      return result;
    } catch (err) {
      throw new Error(`Error deleting ${module} record. ${err.message}`);
    }
  }