import aqp from "api-query-params";
import _ from "lodash";
import moment from "moment";
import Parcel, {
  validateCreate,
  validateAdminCreate,
  validateUpdate,
  estimateObject,
  validateEstimate,
} from "./model.js";

import {
  generateModelCode,
  isObjecId,
  safeGet,
  getSettings,
  setLimit,
  // loging,
  calculateDistance,
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
    // validateParcelDate(data);
    // if (!data.sender) data.sender = data.createdBy;
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
    // data.status = PAYMENT.STATUS.PENDING;
    // const fieldsArr = [
    //   "locationFrom",
    //   "locationTo",
    //   "desiredPickupDate",
    //   "desiredDeliveryDate",
    // ];
    // const record = { ...parcel, ...data };
    // if (!_.isEmpty(_.intersection(Object.keys(data), fieldsArr))) {
    //   const {
    //     locationFrom,
    //     locationTo,
    //     desiredPickupDate,
    //     desiredDeliveryDate,
    //   } = record;
    //   const { distance, duration } = await getShipmentDistance({
    //     locationFrom,
    //     locationTo,
    //   });
    //   data.distance = parseFloat(Math.ceil(distance * 0.001).toFixed(5));
    //   data.travelHour = parseFloat(
    //     Math.ceil(duration * 0.00027777777).toFixed(5)
    //   );
    //   data.urgency = getUrgency(
    //     data.travelHour,
    //     desiredPickupDate,
    //     desiredDeliveryDate
    //   );
    //   data.urgency = parseFloat(data.urgency.toFixed(5));
    // }
    // data.coverage = 1;
    // if (`${record.countryFrom}` == `${record.countryTo}`) {
    //   data.coverage = 2;
    // }
    // if (`${record.regionFrom}` == `${record.regionTo}`) {
    //   data.coverage = 3;
    // }
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

// /**
//  * @description At this STAGE, the parcel distance, urgency, minCharge, maxCharge,
//  *  payableCharge are calculated and set. The Next STAGE is setPayableChrage by User.
//  * @param {ObjectId} recordId parcel record
//  * @param {Object} user data
//  */
// export async function checkout(recordId, user) {
//   try {
//     const parcel = await Parcel.findOne({ _id: recordId }).lean().exec();
//     if (!parcel) throw new Error(`${module} record not found.`);
//     if (`${parcel.sender}` !== user.id) {
//       throw new Error(`user ${user.id} is not the sender`);
//     }
//     if (parcel.paymentStatus !== PAYMENT.STATUS.PENDING) {
//       throw new Error(`Payment Status is  ${parcel.paymentStatus}`);
//     }
//     if (parcel.status != PARCEL.STATUS.PENDING) {
//       throw new Error(`Pickup Status is  ${parcel.status}`);
//     }
//     const data = { status: PARCEL.STATUS.CHECKOUT };
//     const bill = await estimateBilling(parcel);
//     console.log({ bill });
//     data.payableCharge = bill.payableCharge;
//     data.minCharge = bill.payableCharge;
//     data.maxCharge = bill.payableCharge * 2;
//     const result = await Parcel.findOneAndUpdate({ _id: recordId }, data, {
//       new: true,
//     }).exec();
//     if (!result) {
//       throw new Error(`${module} record not found.`);
//     }
//     return result;
//   } catch (err) {
//     throw new Error(`Error checkout. ${err.message}`);
//   }
// }

// /**
//  * @description This Stage is executed after Checkout. The user set
//  *  payableCharge within the minCharge and maxCharge and ready for assignment
//  * @param {ObjectId} recordId parcel record
//  * @param {Number} payableCharge amount set by user as shipment charge
//  * @param {Object} user sender info
//  */
// export async function setPayableCharge(recordId, payableCharge, user) {
//   try {
//     const parcel = await Parcel.findOne({ _id: recordId }).lean().exec();
//     if (!parcel) throw new Error(`${module} record not found.`);
//     if (`${parcel.sender}` !== user.id) {
//       throw new Error(`user ${user.id} is not the sender`);
//     }
//     if (`${parcel.paymentStatus}` !== PAYMENT.STATUS.PENDING) {
//       throw new Error(`Payment Status is  ${parcel.paymentStatus}`);
//     }
//     if (
//       ![PARCEL.STATUS.CHECKOUT, PARCEL.STATUS.CHARGED].includes(parcel.status)
//     ) {
//       throw new Error(`Pickup Status is  ${parcel.status}`);
//     }
//     if (
//       !(
//         Number(payableCharge) >= parcel.minCharge &&
//         Number(payableCharge) <= parcel.maxCharge
//       )
//     ) {
//       throw new Error(
//         `Cost Payable ${payableCharge} should be between ${parcel.minCharge} - ${parcel.maxCharge}`
//       );
//     }
//     const result = await Parcel.findOneAndUpdate(
//       { _id: recordId },
//       { payableCharge, status: PARCEL.STATUS.CHARGED },
//       { new: true }
//     ).exec();
//     if (!result) {
//       throw new Error(`${module} record not found.`);
//     }
//     return result;
//   } catch (err) {
//     throw new Error(`Error setting Payabale Charge. ${err.message}`);
//   }
// }

// export async function updatePayment(code, data, user) {
//   try {
//     const { error } = validateUpdate.validate(data);
//     if (error) throw new Error(`Invalid ${module} data. ${error.message}`);
//     if (code.length !== 10) throw new Error(`Incorrect code. ${code}`);
//     const parcel = await Parcel.findOne({ code }).lean().exec();
//     if (!parcel) throw new Error(`Parcel not found: ${code}`);
//     if (`${user.id}` !== `${parcel.createdBy}`)
//       throw new Error(`Wrong owner: ${user.id}`);
//     if (parcel.paymentStatus !== PAYMENT.STATUS.PENDING) {
//       throw new Error(`Parcel payment status is ${parcel.paymentStatus}`);
//     }
//     const { gateway, trxref, paymentGateway } = data;
//     const update = { gateway, trxref, paymentGateway };
//     const result = await Parcel.findOneAndUpdate({ code }, update, {
//       new: true,
//     }).exec();
//     if (!result) {
//       throw new Error(`${module} record not found.`);
//     }
//     await verifyPayment(code);
//     return result;
//   } catch (err) {
//     throw new Error(`updatePayment: ${err.message}`);
//   }
// }

// export async function patchService(recordId, data) {
//   try {
//     const result = await Parcel.findOneAndUpdate({ _id: recordId }, data, {
//       new: true,
//     }).exec();
//     if (!result) {
//       throw new Error(`${module} record not found.`);
//     }
//     return result;
//   } catch (err) {
//     throw new Error(`Error updating ${module} record. ${err.message}`);
//   }
// }

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

// /**
//  * getShipmentDistance calculate distance and duration btween 2 points
//  * @param {Object} data { terminalFrom, terminalTo, locationFrom, locationTo }
//  * @returns {Object} { distance: number, duration: number } Distance: Km, Duration: Sec
//  */
// const getShipmentDistance = async (data) => {
//   try {
//     let { locationFrom, locationTo } = data;
//     let distance1 = 0;
//     let distance2 = 0;
//     const origins = `${locationFrom.coordinates[1]},${locationFrom.coordinates[0]}`;
//     const destinations = `${locationTo.coordinates[1]},${locationTo.coordinates[0]}`;

//     const mapApi = await distanceMatrix(
//       `&origins=${origins}&destinations=${destinations}`
//     );
//     if (!mapApi || !mapApi.rowsArr || !Array.isArray(mapApi.rowsArr) || mapApi.rowsArr.length == 0) {
//       loging(
//         "getShipmentDistance",
//         null,
//         new Error(safeGet(mapApi, "error_message"))
//       );
//       distance1 = calculateDistance(
//         locationFrom.coordinates,
//         locationTo.coordinates
//       ); // Meters
//       data.duration = distance1 / 16; // distance / speed (meters/sec) 60Km/h = 16m/s
//     } else {
//       const [
//         {
//           elements: [{ distance, duration, status }],
//         },
//       ] = mapApi.rowsArr;
//       if (status === "OK") {
//         distance2 = distance.value;
//         data.duration = duration.value;
//       }
//     }
//     if (!(distance1 > 0 || distance2 > 0)) {
//       throw new Error(
//         `Distance must be greater than 0 ${distance1} ${distance1}`
//       );
//     }
//     data.distance = distance1 > distance2 ? distance1 : distance2;
//     return data;
//   } catch (err) {
//     throw new Error(`${err.message}`);
//   }
// };

// const calculateSum = (obj, field) =>
//   obj.map((items) => items[field]).reduce((prev, curr) => prev + +curr, 0);

// export async function estimateBilling(data) {
//   try {
//     data.items.map((item) => {
//       item.category = `${item.category}`;
//       return item;
//     });
//     const parcel = _.pick(data, Object.keys(estimateObject));
//     const { error } = validateEstimate.validate(parcel);
//     if (error) {
//       throw new Error(`Invalid data. ${error.message}`);
//     }
//     const billing = await Setting.find({ type: "BILLING" })
//       .select("name value")
//       .lean()
//       .exec();
//     if (!billing) throw new Error(`Billing settings not found`);
//     const baseCharge = Number(getSettings(billing, "BASE_CHARGE"));
//     const iIndexCoef = Number(getSettings(billing, "INDEX_COEFFICIENT"));
//     const worthIndex = Number(getSettings(billing, "WORTH"));
//     const urgencyIndex = Number(getSettings(billing, "URGENCY"));
//     const distanceIndex = Number(getSettings(billing, "DISTANCE"));
//     const massIndex = Number(getSettings(billing, "MASS"));
//     const volumeIndex = Number(getSettings(billing, "VOLUME"));

//     //*3 Determine Unit Charge per Item

//     const items = await Promise.all(
//       data.items.map(async (item) => {
//         const category = await Category.findById(item.category).lean().exec();
//         if (!category) {
//           throw new Error(`Parcel Category ${item.category} not found`);
//         }
//         const worthCharge = 0.1 * worthIndex * item.worth;
//         const massCharge = 2 ** massIndex * item.mass;
//         const volumeCharge = 2 ** volumeIndex * item.volume;
//         item.categoryCharge = Number(category.shipmentCost);
//         const charge =
//           worthCharge + category.shipmentCost * (massCharge + volumeCharge);
//         item.charge = charge * item.quantity;
//         return item;
//       })
//     );

//     const itemsCharge = calculateSum(items, "charge");
//     const urgencyCharge =
//       iIndexCoef * Math.ceil(urgencyIndex * itemsCharge * data.urgency);
//     const distanceCharge =
//       iIndexCoef *
//       Math.ceil(distanceIndex * itemsCharge * Math.log(data.distance));
//     const payableCharge = Math.ceil(
//       baseCharge + itemsCharge + urgencyCharge + distanceCharge
//     );
//     return {
//       baseCharge,
//       itemsCharge,
//       urgencyCharge,
//       distanceCharge,
//       payableCharge,
//       parcel,
//     };
//   } catch (err) {
//     throw new Error(`Error estimating billing: ${err.message}`);
//   }
// }

// /**
//  *
//  * @param {Number(} travelHour Duration of journey in Hours
//  * @param {date} desiredPickupDate desired Pickup date or presume departure
//  * @param {date} desiredDeliveryDate desired Delivery date or presume arrival
//  * @returns {Number} between 1 and 0. Zero is not urgent while 1 is extreemly urgent.
//  */
// const getUrgency = (travelHour, desiredPickupDate, desiredDeliveryDate) => {
//   try {
//     if (Date.now() > new Date(desiredPickupDate)) {
//       throw new Error(
//         `Invalid data: desiredPickupDate ${desiredPickupDate} must be later than now.`
//       );
//     }
//     if (!(travelHour && desiredPickupDate && desiredDeliveryDate)) {
//       throw new Error(
//         `Invalid data: travelHour: ${travelHour}, desiredPickupDate ${desiredPickupDate}, desiredDeliveryDate ${desiredDeliveryDate}`
//       );
//     }
//     const diff =
//       new Date(desiredDeliveryDate).getTime() -
//       new Date(desiredPickupDate).getTime();
//     if (diff <= 0) {
//       throw new Error(
//         `Invalid data: desiredPickupDate ${desiredPickupDate}, desiredDeliveryDate ${desiredDeliveryDate}`
//       );
//     }
//     const duration = diff / 3600000;
//     if (duration < travelHour) {
//       throw new Error(
//         `Invalid urgency: minimum duration: ${travelHour}H, desire duration ${duration}H`
//       );
//     }
//     return parseFloat((travelHour / duration).toFixed(3));
//   } catch (error) {
//     throw new Error(`Unable to derive urgency: ${error.message}`);
//   }
// };
