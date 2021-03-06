import mongoose from "mongoose";
import {
  DATABASE,
  GENDER,
  EMAIL,
  FREEXIT,
  USER_TYPE,
  USER_ROLE,
//   COVERAGE,
} from "../../constant/index.js";
import { hash } from "../../util/index.js";

const table = [
  {
    _id: new mongoose.Types.ObjectId(FREEXIT.USERID),
    // pin: 43210,
    // wallet: FREEXIT.WALLET_DEBIT,
    // businessName: "AppCalypso1",
    // accountName: "AppCalypso EWallet Master User",
    // accountNumber: "0123456789",
    // balance: FREEXIT.WALLET_AMOUNT,
    // isActive: true,
    // remark:
    //   "Genesis amount for TRANSFER to Merchants and Customers as sales after Deposit",
    title: "Mrs",
    surname: "AppCalypso",
    firstName: "Freexit Now",
    middleName: "Freexit Now",
    lastName: "Freexit Now",
    gender: GENDER.FEMALE,
    birthDate: "1990-06-20",
    country: "NG",
    state: "Enugu",
    county: "Enugu-East",
    // office: "1",
    email: EMAIL.ADMIN,
    userType: USER_TYPE.ADMIN,
    // role: USER_ROLE.OWNER,
    password: hash("freexit"),
    accessLevel: 3,
    kin: "Emmanuel",
    kinPhone: "080000000001",
    kinAddress: "ABC",
    phone: "08134836164",
    phone2: "08134836164",
    // guarantor: "Nonso",
    // guarantorPhone: "ABC",
    // guarantorAddress: "ABC",
    approvedBy: FREEXIT.ADMIN,
    createdBy: FREEXIT.ADMIN,
  },
//   {
//     _id: new mongoose.Types.ObjectId(FREEXIT.USERID2),
//     pin: 43210,
//     wallet: FREEXIT.WALLET_CREDIT,
//     businessName: "AppCalypso2",
//     accountName: "AppCalypso EWallet Income User",
//     accountNumber: "0123456790",
//     balance: 0.0,
//     isActive: true,
//     remark: "Income from clients spending on Transport services",
//     title: "Mrs",
//     surname: "AppCalypso2",
//     firstName: "Freexit Now2",
//     middleName: "Freexit Now2",
//     lastName: "Freexit Now2",
//     gender: GENDER.FEMALE,
//     birthDate: "1990-06-20",
//     country: "NG",
//     office: "1",
//     email: EMAIL.SENDER,
//     type: USER_TYPE.SENDER,
//     password: hash("freexit"),
//     accessLevel: 3,
//     kin: "Emmanuel",
//     kinPhone: "080000000001",
//     kinAddress: "ABC",
//     phone: "08134836164",
//     phonePersonal: "08134836164",
//     guarantor: "Nonso",
//     guarantorPhone: "ABC",
//     guarantorAddress: "ABC",
//     approvedBy: FREEXIT.ADMIN,
//     createdBy: FREEXIT.ADMIN,
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     email: "logistics@pmt.ng",
//     phone: "08167235519",
//     password: hash("freexit"),
//     surname: "Nditah",
//     firstName: "Isa",
//     middleName: "Sammy",
//     lastName: "Dr",
//     businessName: "PMT Logistics",
//     wallet: "1155444938",
//   },
];

const userId = DATABASE.BASE_ID.USER;

const result = table.map((record, index) => {
  const obj = Object.assign({}, record);
  return obj;
});

export default result;
