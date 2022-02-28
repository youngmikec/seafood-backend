import { 
    fetchService,
    createService,
    deleteService,
} from './service.js';

import { response, success, fail } from '../../util/response.js';

const module = "Tracking";



export async function fetchHandler (req, res){
    try{
        const entity = await fetchService({query:req.query, user: req.user});
        return response(res, 200, entity); 
    }catch (error){
        return fail(res, 400, `${error.message}`);
    }
}

export async function createHandler (req, res){
    try{
        const entity = await createService(req.body);
        return success(res, 200, entity);
    }catch (error) {
        return fail(res, 400, `${error.message}`);
    }
}


export async function deleteHandler(req, res) {
    try {
      const { recordId } = req.params;
    //   const result = await deleteService(recordId, req.user);
      const result = await deleteService(recordId);
      return success(res, 200, result);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
  }

