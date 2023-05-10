import {
    fetchService,
    createService,
    adminCreateService,
    updateService,
    operationService,
    deleteService,
} from './service.js';
import { response, success, fail } from "../../util/response.js";


const module = 'Package';

export async function fetchHandler(req, res) {
    try {
      const entity = await fetchService({ query: req.query, user: req.user });
      return response(res, 200, entity);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
}

export async function createHandler(req, res) {
  try {
    const result = await createService(req.body);
    return success(res, 201, result);
  } catch (err) {
  //   loging(module, req, err);
    return fail(res, 400, err.message);
  }
}

export async function adminCreateHandler(req, res) {
  try {
    const result = await adminCreateService(req.body);
    return success(res, 201, result);
  } catch (err) {
  //   loging(module, req, err);
    return fail(res, 400, err.message);
  }
}

export async function updateHandler(req, res) {
  try {
    const { recordId } = req.params;
    const result = await updateService(recordId, req.body, req.user);
    return success(res, 200, result);
  } catch (err) {
  //   loging(module, req, err);
    return fail(res, 400, `${err.message}`);
  }
}

export async function operationHandler(req, res) {
  try {
    const { recordId } = req.params;
    const { body, user } = req;
    const result = await operationService(recordId, body, user);
    return success(res, 200, result);
  } catch (err) {
    // loging(module, req, err);
    return fail(res, 400, `${err.message}`);
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