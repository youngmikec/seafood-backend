import { validateCoordinate } from "./model.js";
import { geocoding, reverseGeocoding } from "../../services/googleapi.js";

export const coordinateService = async (data) => {
    try{
        const { error } = validateCoordinate.validate(data);
        if(error){
            throw new Error(`Invalid request ${error}`);
        }
        const { address, coordinate, direction } = data;

        if(direction === 'forward' && address != ''){
            const result = await geocoding(address);
            if(!result){
                throw new Error(`Error! No coordinate found for the selected address`);
            }
            return result;
        }else if(direction === 'reverse' && coordinate.length === 2){
            // const query = `&latlng=${coordinate[0]},${coordinate[1]}`;
            const result = await geocoding(`${coordinate[0]} ${coordinate[1]}`);
            if(!result){
                throw new Error(`Error! No address found for the selected coordinates`);
            }
            return result;
        }else{
            throw new Error(`Direction and data passed does not match`);
        }

    }catch(err){
        throw new Error(`Error! ${err.message}`);
    }
}