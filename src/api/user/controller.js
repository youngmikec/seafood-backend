import {
    fetchSelfService,
    fetchAnyService,
    createService,
    updateByUserService,
    updateByAdminService,
    updatePinService,
    patchService,
    deleteService,
    loginService,
    sendOTPService,
    fetchService,
  } from "./service.js";
  import {
    // loging,
    // safeGet,
    // log4js,
    getRequestIp,
    getLoginType,
  } from "../../util/index.js";
import { response, success, fail } from '../../util/response.js';
  import { USER_TYPE } from "../../constant/index.js";

  const module = "User";

  export const fetchHandler = async (req, res) => {
    try {
      const entity = await fetchService(req.query);
      return response(res, 200, entity);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
  }

  export const fetchSelfHandler = async (req, res) => {
    try {
      const entity = await fetchSelfService(req.query, req.user);
      return response(res, 200, entity);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
  }
  
  export const fetchMeHandler = async (req, res) => {
    try {
      const query = `_id=${req.user.id}`;
      const result = await fetchService(query, req.user);
      return response(res, 200, result);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, err.message);
    }
  }
  
  export const fetchAnyHandler = async (req, res) => {
    try {
      const result = await fetchAnyService(req.params.variable);
      return response(res, 200, result);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, err.message);
    }
  }
  
  export const createHandler = async (req, res) => {
    try {
      const result = await createService(req.body);
      return success(res, 201, result);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
  }
  
  export const updateByUserHandler = async (req, res) => {
    try {
      const result = await updateByUserService(req.body.updatedBy, req.body);
      return success(res, 200, result);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
  }
  
  export const updatePinHandler = async (req, res) => {
    try {
      const result = await updatePinService(
        // req.params.wallet,
        req.body,
        req.user
      );
      return success(res, 200, result, `${module}`);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
  }
  
  export const updateByAdminHandler = async (req, res) => {
    try {
      const result = await updateByAdminService(req.params.recordId, req.body);
      return success(res, 200, result);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
  }
  
  export const patchHandler = async (req, res) => {
    try {
      const result = await patchService(req.params.recordId, req.body);
      return success(res, 200, result);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
  }
  
  export const deleteHandler = async (req, res) => {
    try {
      const result = await deleteService(req.params.recordId);
      return success(res, 200, result);
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
  }
  

  export const userLoginHandler = async (req, res) => {
    try {
      if (!req.body.currentIp) req.body.currentIp = getRequestIp(req);
      if (!req.body.type) req.body.type = getLoginType(req.body);
      req.body.userType = USER_TYPE.SENDER;
      const result = await loginService(req.body);
      return success(res, 201, result, "Login was successful!");
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 403, `${err.message}`);
    }
  }

  export const adminLoginHandler = async (req, res) => {
    try {
      if (!req.body.currentIp) req.body.currentIp = getRequestIp(req);
      if (!req.body.type) req.body.type = getLoginType(req.body);
      req.body.userType = USER_TYPE.ADMIN;
      const result = await loginService(req.body);
      return success(res, 201, result, "Login was successful!");
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 403, `${err.message}`);
    }
  }

  export const sendOTPHandler = async (req, res) => {
    try {
      const result = await sendOTPService(req.body);
      return success(res, 200, result, "OTP sent successfully!");
    } catch (err) {
    //   loging(module, req, err);
      return fail(res, 400, `${err.message}`);
    }
  }