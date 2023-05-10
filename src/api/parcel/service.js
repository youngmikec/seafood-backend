import aqp from "api-query-params";
import _ from "lodash";
import moment from "moment";
import Parcel, {
  validateCreate,
  validateUpdate,
  validateEstimate,
} from "./model.js";

import {
  generateModelCode,
  setLimit,
  // loging,
} from "../../util/index.js";
import User from "../user/model.js";
import { PARCEL, PAYMENT, USER_TYPE } from "../../constant/index.js";


const module = "Parcel";

export async function fetchService({ query, user }) {
  try {
    const { filter, skip, sort, projection, population } = aqp(query);
    let { limit } = aqp(query);
    limit = setLimit(limit);
    if (!filter.deleted) filter.deleted = 0;
    if (user.userType !== USER_TYPE.ADMIN) {
      filter.$or = [{ senderEmail: user.email }, { dispatcher: user.id }];
    }
    const total = await Parcel.countDocuments(filter).exec();
    const result = await Parcel.find(filter)
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

const validateParcelDate = (parcel) => {
  const now = moment(new Date());
  const { pickupDate, deliveryDate } = parcel;
  const newPickupDate = moment(new Date(pickupDate));
  const newDeliveryDate = moment(new Date(deliveryDate));
  if (now.diff(newPickupDate) > 0) {
    throw new Error(`Invalid desired pickup date. ${newPickupDate} has past`);
  }
  if (now.diff(newDeliveryDate) > 0) {
    throw new Error(`Invalid desired delivery date. ${newDeliveryDate} has past`);
  }
  if (newPickupDate.add(2, "hours").diff(newDeliveryDate) > 0) {
    throw new Error(
      `Parcel delivery date ${newDeliveryDate} should be at least 2hrs later than  the pickup datetime ${newPickupDate}`
    );
  }
};

const generateAmountPayable = (data) => {
    let amount = 0;
    const defaultAmount = 2000;
    if(!data) return defaultAmount;
    let { mass, volume, worth, quantity } = data;

    if(worth < 10000) amount += (Math.ceil((worth * 0.1) * (mass / volume)) * (quantity));
    if(worth >= 10000 && worth < 50000 ) amount += (Math.ceil((worth * 0.08) * (mass / volume)) * (quantity / 2));
    if(worth >= 50000 && worth < 200000 ) amount += (Math.ceil((worth * 0.05) * (mass / volume)) * (quantity / 2));
    if(worth >= 200000 && worth < 1000000 ) amount += (Math.ceil((worth * 0.025) * (mass / volume)) * (quantity / 2));
    return amount;
}

const generateShippingFee = (data) => {
    let amount = 0;
    const defaultAmount = 500;
    if(!data) return defaultAmount;
    let { mass, volume, worth, quantity } = data;

    if(worth < 10000) amount = defaultAmount;
    if(worth >= 10000 && worth < 50000 ) amount = defaultAmount * 2;
    if(worth >= 50000 && worth < 100000 ) amount = defaultAmount * 3;
    if(worth >= 100000 && worth < 200000 ) amount = defaultAmount * 4;
    if(worth >= 200000 && worth < 1000000 ) amount += amount = defaultAmount * 6;
    return amount;
}

export async function billingService(data) {
  try {
    const { error } = validateEstimate.validate(data);
    if (error ) throw new Error(`Invalid Request  ${error.message}`);
    const { items } = data;
    let totalAmount = 0;
    let totalShippingFee = 0;
    for(let i = 0; i < items.length; i++){
      const amountPayable = generateAmountPayable(items[i]);
      totalAmount += amountPayable;
      totalShippingFee += generateShippingFee(items[i]);
    }
    return { 
      totalShippingFee,
      totalAmountPayable: totalAmount
    };
  }catch (err) {
    throw new Error(`Error getting billing ${err}`);
  }
}

export async function createService(data) {
  try {
    const { error } = validateCreate.validate(data);
    if (error) {
      throw new Error(`Invalid request. ${error.message}`);
    }
  
    data.code = await generateModelCode(Parcel);
    const senderObj = await User.findById(data.createdBy).exec();
    if (!senderObj) throw new Error(`Sender ${data.createdBy} not found`);
    data.amountPayable = generateAmountPayable(data);
    data.shippingFee = generateShippingFee(data);
    data.createdBy = senderObj.id;
    
    const newRecord = new Parcel(data);
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
    validateParcelDate(data);
    const parcel = await Parcel.findById(recordId).exec();
    if (!parcel) throw new Error(`${module} record not found.`);
    if (`${parcel.createdBy}` !== user.id) {
      throw new Error(`user ${user.email} is not the sender`);
    }
    if (`${parcel.paymentStatus}` !== PAYMENT.STATUS.PENDING) {
      throw new Error(`Payment Status is  ${parcel.paymentStatus}`);
    }
    if (
      ![
        PAYMENT.STATUS.PENDING,
        PARCEL.STATUS.CHECKOUT,
        PARCEL.STATUS.CHARGED,
      ].includes(`${parcel.status}`)
    ) {
      throw new Error(`Pickup Status is  ${parcel.status}`);
    }
    const result = await Parcel.findOneAndUpdate({ _id: recordId }, data, {
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
    const result = await Parcel.findOneAndRemove({ _id: recordId });
    if (!result) {
      throw new Error(`${module} record not found.`);
    }
    return result;
  } catch (err) {
    throw new Error(`Error deleting ${module} record. ${err.message}`);
  }
}

