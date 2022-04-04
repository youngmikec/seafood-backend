import { coordinateService } from './service.js';
import { success, fail } from '../../util/response.js';


export const coordinateHandler = async (req, res) => {
    try{
        const result = await coordinateService(req.body);
        success(res, 201, result);
    }catch(err){
        fail(res, 400, err.message);
    }
}