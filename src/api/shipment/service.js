import aqp from 'api-query-params';
import moment from "moment";

import Shipment, { 
    validateCreate,
    validateUpdate,
    validateOperation,
} from "./model.js";

import User from '../user/model.js';
import Parcel from '../parcel/model.js';
import Package from '../package/model.js';

import {
  generateModelCode,
  setLimit,
} from "../../util/index.js";

import { PARCEL, PAYMENT, USER_TYPE } from "../../constant/index.js";

const module = 'Shipment';

export async function fetchService({ query, user }) {
    try {
      const { filter, skip, sort, projection, population } = aqp(query);
      let { limit } = aqp(query);
      limit = setLimit(limit);
      
      if (!filter.deleted) filter.deleted = false;
      if (user.userType !== USER_TYPE.ADMIN) {
        filter.$or = [{ senderPhone: user.phone }, { createdBy: user.id }];
      }
      const total = await Shipment.countDocuments(filter).exec();
      const result = await Shipment.find(filter)
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


  const validateShipmentDate = (shipment) => {
    const now = moment(new Date());
    const { departureDate, expectedDate } = shipment;
    const newDepartureDate = moment(new Date(departureDate));
    const newExpectedDate = moment(new Date(expectedDate));

    if (now.diff(newDepartureDate) > 0) {
      throw new Error(`Invalid Departure date. ${newDepartureDate} has past`);
    }
    if (now.diff(newExpectedDate) > 0) {
      throw new Error(`Invalid Expected date. ${newExpectedDate} has past`);
    }
    if (newDepartureDate.add(24, "hours").diff(newExpectedDate) > 0) {
      throw new Error(
        `Shipment expected arrival date ${newExpectedDate} should be at least 24hrs later than  the departure datetime ${newDepartureDate}`
      );
    }
  };


  export async function createService(data) {
    try {
      const { error } = validateCreate.validate(data);
      if (error) {
        throw new Error(`Invalid request. ${error.message}`);
      }
      validateShipmentDate(data);
      // if (!data.sender) data.sender = data.createdBy;
    
      data.code = await generateModelCode(Shipment);
      const senderObj = await User.findById(data.createdBy).exec();
      if (!senderObj) throw new Error(`Sender ${data.createdBy} not found`);
      data.createdBy = senderObj.id;
      
      const newRecord = new Shipment(data);
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

      const returnedShipment = await Shipment.findById(recordId).exec();
      if (!returnedShipment) throw new Error(`${module} record not found.`);
      if (`${returnedShipment.createdBy}` !== user.id) {
        throw new Error(`user ${user.email} is not an authorized user`);
      }

      // if (`${returnedShipment.status}` !== "LOADING") {
      //   throw new Error(`Payment Status is  ${returnedShipment.status}`);
      // }
     
      const result = await Shipment.findOneAndUpdate({ _id: recordId }, data, {
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

  export const operationService = async (recordId, data, user) => {
    try{
      const { error } = validateOperation.validate(data);
      if (error) {
        throw new Error(`Invalid request. ${error.message}`);
      }
      const { status } = data;

      const returnedShipment = await Shipment.findById(recordId).exec();
      if (!returnedShipment) throw new Error(`${module} record not found.`);
      if (`${returnedShipment.createdBy}` !== user.id) {
        throw new Error(`user ${user.email} is not an authorized user`);
      }
      const { packages } = returnedShipment;
      console.log('shipment', returnedShipment);

      
      if(packages.length > 0){
        console.log('got here');
        if(status === 'DEPARTED'){
          const updatedPackages = await Package.updateMany({_id: packages}, {$set: {"status": 'SHIPPED'}});
          if(!updatedPackages){
            throw new Error(`Error updating Package status`);
          }
        }

        if(status === 'ARRIVED'){
          const updatedPackages = await Package.updateMany({_id: packages}, {$set: {"status": 'ARRIVED'}});
          if(!updatedPackages){
            throw new Error(`Error updating Package status`);
          }
        }
      }

      if(packages.length <= 0){
        throw new Error(`Error! Cannot depart an empty shipment, add some packages`);
      }


      const result = await Shipment.findOneAndUpdate({ _id: recordId }, data, {
        new: true,
      }).exec();
      if (!result) {
        throw new Error(`${module} record not found.`);
      }
      return result;
    } catch (err) {
      throw new Error(`Error performing shipment operation ${err.message}`);
    }
  }
  
  export async function deleteService(recordId) {
    try {
      const result = await Shipment.findOneAndRemove({ _id: recordId });
      if (!result) {
        throw new Error(`${module} record not found.`);
      }
      return result;
    } catch (err) {
      throw new Error(`Error deleting ${module} record. ${err.message}`);
    }
  }