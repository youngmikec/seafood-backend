import aqp from "api-query-params";
import { setLimit, generateModelCode } from "../../util/index.js";
import Shipment from "../shipment/model.js";
import User from '../user/model.js';
import Tracking, { validateCreate, validateUpdate } from './model.js';



const module = "Tracking";

export async function fetchService({ query, user }){
    try{
        const { filter, skip, sort, population, projection, } = aqp(query);
        let { limit } = aqp(query);
        limit = setLimit(limit);

        if(!filter.deleted) filter.deleted = false;


        const total = await Tracking.countDocuments(filter);
        const result = await Tracking.find(filter)
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
    }catch (error){
        throw new Error(`Error retrieving ${module} record. ${error.message}`);
    }
}


export async function createService (data) {
    try{
        const { trackingCode } = data;
        const { error } = validateCreate.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }

        data.code = await generateModelCode(Tracking);

        const shipment = await Shipment.findOne({code: trackingCode}).exec();
        const { id, status, currentLocation } = shipment;
        if(!shipment){
            throw new Error(`Invalid tracking code ${trackingCode}`);
        }
        data.shipment = shipment.id;

        const senderObj = await User.findById(data.createdBy).exec();
        if (!senderObj) throw new Error(`Sender ${data.createdBy} not found`);
        data.createdBy = senderObj.id;

        const newRecord = new Tracking(data);
        let result = await newRecord.save();
        if (!result) {
            throw new Error(`${module} record not found.`);
        }

        return {
            trackingDetail: {
                status: status,
                currentLocation: currentLocation
            },
            result
        };
    }catch (err){
        throw new Error(`Error creating ${module} record ${err.message}`);
    }
}

export async function deleteService (recordId) {
    try{
        const result = await Tracking.findOneAndRemove({id: recordId}).exec();
        if(!result){
            throw new Error(`${module} record not found.`);
        }
        return result;
    }catch (err) {
        throw new Error(`Error deleting ${module} record ${err.message}`);
    }
}