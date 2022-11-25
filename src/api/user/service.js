import aqp from "api-query-params";
import dotenv from 'dotenv';
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
import User, {
  validateCreate,
  validateAdminUpdate,
  validateUserUpdate,
  validatePinUpdate,
  validatePasswordUpdate,
  schemaLogin,
} from "./model.js";
// import Otp from "../otp/model";
import { generateCode, hash, safeGet, setLimit, generateOtp } from "../../util/helpers.js";
import { JWT, USER_TYPE } from "../../constant/index.js";
import { sendMail } from "../../services/index.js";

dotenv.config();
const module = "User";
//@ts-check
export const fetchService = async (query) => {
    try{
        let { filter, skip, population, sort, projection } = aqp(query);
        const searchString = filter.q ? filter.q : false;
        if (searchString) {
            const escaped = searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
            filter.$or = [
              { email: { $regex: new RegExp(searchString, "i") } },
              { phone: { $regex: new RegExp(searchString, "i") } },
              { surname: { $regex: new RegExp(searchString, "i") } },
              { $text: { $search: escaped, $caseSensitive: false } },
            ];
            delete filter.q;
          }
        let { limit } = aqp(query);
        limit = setLimit(limit);
        if (!filter.deleted) filter.deleted = 0;

        const total = await User.countDocuments(filter).exec();

        const result = await User.find(filter)
        .populate(population)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .select(projection)
        .exec();

        if(!result){
            throw new Error(`${module} record not found`);
        }
        const count = result.length;
        const msg = `${count} ${module} record(s) retrieved successfully!`;
        return { payload: result, total, count, msg, skip, limit, sort };
    }catch (error){
        throw new Error(`Error retrieving ${module} record ${error.message}`);
    }
}


export const loginService = async (loginPayload) => {
    try {
      const { error } = schemaLogin.validate(loginPayload);
      if (error)
        throw new Error(`Invalid ${module} login data. ${error.message}`);
      const { email, phone, otp, password, type, userType } = loginPayload;
      const filter = { deleted: 0 };
      if (userType === USER_TYPE.ADMIN) {
        filter.userType = USER_TYPE.ADMIN;
      }

      if (userType === USER_TYPE.SENDER) {
        filter.userType = USER_TYPE.SENDER;
      }

      if (type === "PHONE" || type === "OTP") {
        filter.phone = phone;
      } else {
        filter.email = email;
      }
      const user = await User.findOne(filter).select("+password").exec();
      if (!user) {
        throw new Error("User not found. Check your details and try again.");
      }

      if (user.userType != filter.userType) {
        throw new Error("Error Login! User type mistach.");
      }

      if (!(user.accessLevel > 1)) throw new Error("Insufficient Access Level");
      if (type === "OTP" && otp) {
        if (!user.otpAccess) {
          throw new Error(`OTP Access is ${user.otpAccess}`);
        }
        if (new Date() > user.otpTimeout) {
          throw new Error("OTP has expired");
        }
        if (!bcryptjs.compareSync(otp, `${user.otp}`)) {
          throw new Error("Invalid OTP credentials.");
        }
      } else if (!bcryptjs.compareSync(password, `${user.password}`)) {
        throw new Error("Wrong password.");
      }
  
      const update = {
        otpAccess: false,
        currentLogin: Date.now(),
        currentIp: loginPayload.currentIp,
        lastLogin: user.currentLogin,
        lastIp: user.currentIp,
      };
      await User.findOneAndUpdate({ _id: user._id }, update, {
        new: true,
      }).exec();
      user.password = null;
      user.otp = null;
      delete user.password;
      delete user.otp;
      const payload = { id: `${user.id}`, time: new Date(), userType: user.userType };
      const token = jwt.sign(payload, JWT.jwtSecret, {
        expiresIn: JWT.tokenExpireTime,
      });
      return { token, user };
    } catch (err) {
      throw new Error(`${err.message}`);
    }
  }

  export async function fetchSelfService(query, user) {
    try {
      const { projection, population } = aqp(query);
      const filter = { _id: safeGet(user, "id"), deleted: 0 };
      const total = await User.countDocuments(filter).exec();
      const result = await User.findOne(filter)
        .populate(population)
        .select(projection)
        .exec();
      if (!result) {
        throw new Error(`${module} record not found.`);
      }
      const count = result.length;
      const msg = `User record retrieved successfully!`;
      const entity = {
        payload: result,
        total,
        count,
        msg,
        skip: 0,
        limit: 0,
        sort: 1,
      };
      return entity;
    } catch (err) {
      throw new Error(`Error retrieving ${module} record. ${err.message}`);
    }
  }
  
  export async function fetchAnyService(param) {
    try {
      const { filter } = aqp(
        `filter={"$or":[{"email":"${param}"},{"phone":"${param}"},{"wallet":"${param}"}]}`
      );
      const total = await User.countDocuments(filter).exec();
      const payload = await User.findOne(filter)
          .select("wallet businessName type email phone ratings")
          .exec();
      if (!payload) {
        throw new Error(`${module} record not found.`);
      }
      const count = payload.length;
      const msg = `User record retrieved successfully!`;
      const entity = {
        payload,
        total,
        count,
        msg,
        skip: 0,
        limit: 0,
        sort: 1,
      };
      return entity;
    } catch (err) {
      throw new Error(`Error retrieving ${module} record. ${err.message}`);
    }
  }
  
  const generateWallet = async () => {
    let code = generateCode(10);
    let duplicate = await User.findOne({ wallet: code }).exec();
    if (duplicate) {
      code = generateCode(10);
      duplicate = await User.findOne({ wallet: code }).exec();
      if (duplicate) {
        throw new Error(`Error! Record already exist for Wallet ${code}`);
      }
    }
    return code;
  };
  
  const minsAgo = (mins) => {
    const time = new Date();
    return time.setMinutes(time.getMinutes() - Number(mins));
  };

  const sendMailService = async (userEmail, subject, message) => {
    try{
      const result = await sendMail(
        'michaelozor15@seafood.com',
        userEmail,
        subject,
        message
      );
    }catch (err){
      console.error(err);
    }
  }
  
  export async function createService(data) {
    try {
      const { error } = validateCreate.validate(data);
      if (error) throw new Error(`Error validating User data. ${error.message}`);
      const { email, phone } = data;

      const duplicatePhone = await User.findOne({ phone }).exec();
      if (duplicatePhone) {
        throw new Error(`Error! Record already exist for phone ${phone}`);
      }
      const duplicateEmail = await User.findOne({ email }).exec();
      if (duplicateEmail) {
        throw new Error(`Error! Record already exist for email ${email}`);
      }
      if (safeGet(data, "password")) data.password = hash(data.password);
      data.wallet = generateCode(10);
      const newRecord = new User(data);
      const result = await newRecord.save();
      if (!result) {
        throw new Error(`User record not found.`);
      }

      // send mail to user upon successful account creation
      const mailResponse = await sendMailService(
        result.email,
        'Turah Logistics Onboarding mail',
        `
        <p>
          Dear customer ${result.surname || ''} ${result.firstName || ''}, welcome on board your account was created successfully.<br>
          We are pleased to have you with us. Follow the link below to get started and enjoy unlimited, seamless, fastest delivery service you can ever imagine<br>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:4200/#/home' }" target="_blank">${process.env.FRONTEND_URL || 'http://localhost:4200/#/home' }</a><br>
          Thank you for trusting us.
        </p>
        `
      );

      if(!mailResponse) console.error('error sending Email');
      return { status: result.status };
    } catch (err) {
      throw new Error(`Error creating User record. ${err.message}`);
    }
  }
  
  export async function updateByUserService(recordId, data) {
    try {
      const { error } = validateUserUpdate.validate(data);
      if (error) throw new Error(`Error validating User data. ${error.message}`);
      if (safeGet(data, "password")) data.password = hash(data.password);
      const user = await User.findOneAndUpdate({ _id: recordId }, data, {
        new: true,
      }).exec();
      if (!user) {
        throw new Error(`User record not found.`);
      }
  
    //   let isDocumented = 1;
    //   let message = [];
    //   const setActivate = (msg) => {
    //     isDocumented = 0;
    //     message.push(msg);
    //   };
  
    //   if (!user.userNIN) setActivate("User NIN record not found");
    //   if (!user.userNINScan) setActivate("User NIN Scan record not found");
    //   if (!user.userNINPhoto) setActivate("User NIN Photo record not found");
    //   if (!user.guarantorNIN) setActivate("User Guarantor NIN record not found");
    //   if (!user.guarantorNINScan)
    //     setActivate("User Guarantor NIN Scan record not found");
    //   if (!user.guarantorNINPhoto)
    //     setActivate("User Guarantor NIN Photo record not found");
    //   if (!user.guarantor) setActivate("User Guarantor record not found");
    //   if (!user.guarantorAddress)
    //     setActivate("User Guarantor Address record not found");
    //   if (!user.guarantorPhone)
    //     setActivate("User Guarantor Phone record not found");
  
      let result = user;
    //   if (isDocumented === 1) {
    //     user.isDocumented = 1;
    //     result = await user.save();
    //   }
    //   result = result.toObject();
    //   result.message = message;
      //! Notify User
      return result;
    } catch (err) {
      throw new Error(`Error updating User record. ${err.message}`);
    }
  }
  
  export async function updateByAdminService(recordId, data) {
    try {
      const { error } = validateAdminUpdate.validate(data);
      if (error) throw new Error(`Error validating User data. ${error.message}`);
      if (safeGet(data, "password")) data.password = hash(data.password);
      const result = await User.findOneAndUpdate({ _id: recordId }, data, {
        new: true,
      }).exec();
      if (!result) {
        throw new Error(`User record not found.`);
      }
      return result;
      //! Notify User
    } catch (err) {
      throw new Error(`Error updating User record. ${err.message}`);
    }
  }
  
  export async function patchService(recordId, data) {
    try {
      const result = await User.findOneAndUpdate({ _id: recordId }, data, {
        new: true,
      }).exec();
      if (!result) {
        throw new Error(`User record not found.`);
      }
      return result;
    } catch (err) {
      throw new Error(`Error patching User record. ${err.message}`);
    }
  }
  
  export async function deleteService(recordId) {
    try {
      const result = await User.findOneAndRemove({ _id: recordId });
      if (!result) {
        throw new Error(`User record not found.`);
      }
      return result;
    } catch (err) {
      throw new Error(`Error deleting User record. ${err.message}`);
    }
  }

  export async function sendOTPService(data) {
    try {
      const { error } = schemaLogin.validate(data);
      if (error) {
        throw new Error("Require Email or Phone for OTP");
      }
      const { phone, email } = data;
      const date1 = new Date();
      const date2 = new Date(date1);
      date2.setMinutes(date1.getMinutes() + 10);
      const otp = generateOtp();
      const update = {
        otp: hash(otp.toString()),
        $inc: { otpCount: 1 },
        otpAccess: true,
        otpTimeout: date2,
      };
      const q = { $or: [{ email }, { phone }] };
      const result = await User.findOneAndUpdate(q, update, { new: true }).exec();
      if (!result) {
        throw new Error(`User not found with phone ${phone} or email ${email}`);
      }
      const smsData = {
        subject: "FreexitNow Login OTP",
        recipient: result.phone,
        message: `Login to the App using this phone number and the OTP ${otp} -FREEXIT`,
      };
      if (result.phone) {
        Smses.createService(smsData)
          .then()
          .catch((err) => console.log(err.message));
      }
      const mailData = {
        recipientEmail: result.email,
        subject: "Seafood Login OTP",
        body: `Use this one-time password to login to your seafood.com account - OTP: ${otp} -SEAFOOD`,
      };
      //Uncomment this field as soon as you have integrated mail sending functionality.
      // if (result.email) {
      //   Mails.createService(mailData)
      //     .then()
      //     .catch((err) => console.log(err.message));
      // }
      return true;
    } catch (err) {
      throw new Error(`Error sending User record. ${err.message}`);
    }
  }
  
  /**
   * function securityService() validate an user before transaction
   * @param {*} wallet Wallet for UserFrom
   * @param {*} pin pass code
   * @param {*} user Authorized bearer
   */
  // eslint-disable-next-line complexity
  export async function securityService(wallet, pin, user) {
    try {
      const UserFrom = await User.findOne({ wallet }).select("+pin").exec();
      if (!UserFrom) throw new Error(`Wallet with address ${wallet} not found.`);
      if (user.id.toString() !== UserFrom.id.toString()) {
        throw new Error(`Unauthorized user bearer ${user.email}`);
      }
      if (pin !== UserFrom.pin) {
        const acc = await User.findOneAndUpdate(
          { _id: UserFrom.id },
          { $inc: { wrongPin: 1 } },
          { new: true }
        );
        const trials = 4 - acc.wrongPin;
        if (trials === 0) {
          acc.accessLevel = 1;
          acc.remark = "Account block as a result of repeated wrong PIN access";
          await acc.save();
          throw new Error(`Your user is blocked! ${trials} more attempts!`);
        }
        throw new Error(
          `Wrong pin! Your user will be blocked after ${trials} more attempts!`
        );
      }
      UserFrom.wrongPin = 0;
      await UserFrom.save();
  
      return UserFrom;
    } catch (err) {
      throw new Error(`Security Service. ${err.message}`);
    }
  }
  
  export async function updatePinService(data, user) {
    try {
      const { error } = validatePinUpdate.validate(data);
      if (error) throw new Error(`Invalid payload. ${error.message}`);
      const { pin, newPin, updatedBy } = data;

      const senderObj = await User.findById(updatedBy).exec();
      if (!senderObj) throw new Error(`User ${updatedBy} not found`);

      const update = {
        walletPin: hash(newPin),
        updatedBy,
      };
      const result = await User.findOneAndUpdate(
        { _id: senderObj.id },
        update,
        { new: true }
      );
      if (!result) {
        throw new Error(`${module} record not found.`);
      }
      //! Notify User
      return result;
    } catch (err) {
      throw new Error(`Pin update service: ${err.message}`);
    }
  }

  export async function updatePasswordService(data, user) {
    try {
      const { error } = validatePasswordUpdate.validate(data);
      if (error) throw new Error(`Invalid payload. ${error.message}`);
      const { oldPassword, newPassword, updatedBy } = data;

      const senderObj = await User.findById(updatedBy).exec();
      if (!senderObj) throw new Error(`User ${updatedBy} not found`);

      const update = {
        password: hash(newPassword),
        updatedBy,
      };
      const result = await User.findOneAndUpdate(
        { _id: senderObj.id },
        update,
        { new: true }
      );
      if (!result) {
        throw new Error(`${module} record not found.`);
      }
      //! Notify User
      return result;
    } catch (err) {
      throw new Error(`Pin update service: ${err.message}`);
    }
  }
  
  

