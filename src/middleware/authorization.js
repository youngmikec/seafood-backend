import dotenv from "dotenv";
import pkg from "jsonwebtoken";
const { verify } = pkg;
import mongoose from "mongoose";
import User from "../api/user/model.js";
import { USER_ROLE, USER_TYPE, JWT } from "../constant/index.js";
import { hasProp, safeGet, getRequestIp } from "../util/index.js";
// log4js, loging 
import { fail } from "../util/response.js";

dotenv.config();

// const logger = log4js.getLogger(`[${module}]`);

// Retrieve token from request header
export function getToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(" ")[ 0 ] === "Bearer") {
        return req.headers.authorization.split(" ")[ 1 ];
    } if (req.query && hasProp(req.query, "token")) {
        return req.query.token;
    }
    return null;
}

export const decodeToken = async (token) => {
    return new Promise(function(resolve, reject) {
      verify(token, JWT.jwtSecret, async (err, decoded) => {
          if (err) reject(new Error("Invalid token"));
          resolve (decoded);
      });
    });
  };  
    
export async function checkAuth(req, res, next) {
    try {
        const token = getToken(req);
        if (!token) return fail(res, 403, "No token found in request header!");
        const decoded = await decodeToken(token);
        const user = await User.findById(decoded.id).exec();
        if(!user){
            throw new Error('User not found');
        }

        // const { userType, accessLevel, email, phone } = user;
        const { accessLevel, email, phone } = user;
            req.user = {
                id: decoded.id,
                // userType,
                accessLevel,
                email,
                phone,
                // currentIp: getRequestIp(req),

            };
        delete req.query.apiKey;
        if(user.deleted == 1) throw new Error("User is deleted")
        if(user.accessLevel == 0) throw new Error("Access is denied")
        return checkRequestMethod(req, res, next);
    } catch (err) {
        // loging(module, req, err);
        return fail(res, 403, `Authenticated failed! ${err.message}`);
        }
    }

// eslint-disable-next-line complexity
function checkRequestMethod(req, res, next) {
    switch (req.method) {
    case "POST":
        req.body.createdBy = req.user.id;
        break;
    case "PUT":
        req.body.updatedBy = req.user.id;
        if (req.params.recordId) {
            if (!mongoose.Types.ObjectId.isValid(req.params.recordId)) {
                return res.status(400).send("Invalid object id as request parameter");
            }
        }
        break;
    case "PATCH":
        if (req.body.deleted === true || req.body.deleted === "true") {
            req.body = {};
            req.body.deleted = true;
            req.body.deletedAt = Date.now();
            req.body.deletedBy = req.user.id;
        }
        if (req.params.recordId) {
            if (!mongoose.Types.ObjectId.isValid(req.params.recordId)) {
                return res.status(400).send("Invalid object id as request parameter");
            }
        }
        break;
    case "DELETE":
        req.body = {};
        if (safeGet(req.user, "userType") !== "ADMIN") {
            return fail(res, 403, "Insufficient user priveleges");
        }
        if (req.params.recordId) {
            if (!mongoose.Types.ObjectId.isValid(req.params.recordId)) {
                return res.status(400).send("Invalid object id as request parameter");
            }
        }
        break;
    default:
    }
    return next();
  }
  

export function isValidAdmin(req, res, next) {
    try {
        console.log(req.user);
        const { userType } = req.user;
        if (userType === USER_TYPE.ADMIN) return next();
        return fail(res, 403, "Invalid ADMIN credentials!");
    } catch (err) {
        // loging(module, req, err);
        return fail(res, 403, `User not Validated! ${err.message}`);
    }
}

export function isValidApiHash(req, res, next) {
    const requestHash = req.headers.apiKey || req.query.apiKey;
    if (!requestHash) {
        return checkAuth(req, res, next);
    }
    const apiKey = process.env.API_KEY;
    if (requestHash !== apiKey) {
        return fail(res, 403, "Invalid client header-key");
    }
    delete req.query.apiKey;
    return next();
  }
 

