import bcryptjs from "bcryptjs";
import { JWT } from "../constant/index.js";
import slugify from "slugify";

export function safeGet(obj = {}, prop) {
  return Object.assign({}, obj)[prop] || "";
}

export function toObjectId(baseId = "5951bc91860d8b5ba", mysqlId = 1) {
  const oldId = mysqlId.toString(10);
  const a = oldId.length < 7 ? "0".repeat(7 - oldId.length) : "0";
  return baseId + a + oldId;
}

export function getLoginType(data) {
  const { email, phone, otp, password } = data;
  let loginType = "";
  if (email && password) {
    loginType = "EMAIL";
  } else if (phone && password) {
    loginType = "PHONE";
  } else if (phone && otp) {
    loginType = "OTP";
  }
  return loginType;
}

/**
 * generateObjectId() creates a uuid for a record using the locationId
 * @param {string} serial or Integer primary key to be converted to ObjectId
 * @param {string} baseId is the base ObjectId for that collection
 */
export function generateObjectId(serial, baseId = "5c51bc91860d8b5bc0000001") {
  const str = baseId.slice(0, 24 - (`${serial}`).length);
  return `${str}${serial}`;
}

export function setLimit(inputlimit) {
  const limit = parseInt(inputlimit, 10);
  // eslint-disable-next-line no-restricted-globals
  return isNaN(limit) || limit == null || limit > 100 || limit === 0
    ? 100
    : limit;
}

export function timestamp() {
  return `${new Date().toISOString().slice(0, 22)}Z`;
  //   return new Date().toISOString().slice(0, 19).replace("T", " ")+"Z";
}

export function dateDaysAgo(since = 0) {
  const today = new Date();
  today.setDate(today.getDate() - since);
  return today.toISOString();
}

export function randomNum() {
  return Math.floor(Math.random() * 100000);
}

export function cloneObject(model = {}, source) {
  return Object.assign(model, source);
}

/**
 * @description getObjectByKey returns the object from an Array of
 * Objects that has the key with a given value or undefined!
 * @param {Array} arrayObject Array of Objects
 * @param {String} key Object key could be a String or Integer
 * @param {String} value Object value could be a String or Integer
 */
export function getObjectByKey(arrayObject, key, value) {
  return arrayObject.find((obj) => obj[key] === value);
}

export function getSettings(arrObj = [{}], value = "") {
  const Obj = arrObj.find((item) => item.name === value);
  if (Obj) {
    return Obj.value;
  }
  return "ERROR";
}

/**
 * @description addToArrayOfObjects add a new object item to an array of objects
 * @param {Object} arrayOfObjects the array of object
 * @param {Number} limit maximum number of objects the array should not exceed
 * @param {Object} newObjectElement the new item to be added to the array of objects
 * @returns {Object} the new array of Objects
 */
export default function addToArrayOfObjects(
  arrayOfObjects,
  limit,
  newObjectElement
) {
  const size = Object.keys(arrayOfObjects).length;
  if (size < limit) {
    arrayOfObjects.push(newObjectElement);
  } else {
    // arr.splice(indexToRemove, numToRemove)
    arrayOfObjects.splice(0, 1);
    arrayOfObjects.push(newObjectElement);
  }
  return arrayOfObjects;
}

/**
 * @description getClientAccess get the Ip Address and TimeSTamp of a request object.
 * @param {String} req the request object
 * @returns {Object} { accessDate, ipAddress } access date and the ip address
 */
export function getClientAccess(req) {
  const ipAddress = req.ip || req._remoteAddress;
  // const lang = req.get("accept-language");
  const accessDate = req._startTime || "";
  return { accessDate, ipAddress };
}

export function isRealValue(object) {
  return typeof object !== "undefined" || object !== null;
}

export function hasProp(obj, prop) {
  if (!isRealValue(obj)) return false;
  return obj[prop] !== undefined;
  // return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function isObjecId(id) {
  if (id.match(/^[0-9a-fA-F]{24}$/)) return true;
  return false;
}

/**
 * @returns a six-digit random number
 */
export function generateOtp() {
  const num = Math.floor(Math.random() * 90000) + 10000;
  return num;
}

export function hash(str = "") {
  return bcryptjs.hashSync(str, JWT.saltRounds);
}

export function cleanDeepObject(obj) {
  // eslint-disable-next-line no-restricted-syntax
  for (const propName in obj) {
    if (!obj[propName] || obj[propName].length === 0) {
      delete obj[propName];
    } else if (typeof obj === "object") {
      cleanDeepObject(obj[propName]);
    }
  }
  return obj;
}

/**
 * @description a function that removes duplicates from an array of objects
 * @param {Array} arrayOfObj an array of objects with duplicate value for
 *  a given property
 * @param {String} prop the property with duplicate values that renneds to be filtered by
 */
export function removeDuplicates(arrayOfObj, prop) {
  const setOfSeenObj = new Set();
  const filteredArr = arrayOfObj.filter((item) => {
    const duplicate = setOfSeenObj.has(item[prop]);
    setOfSeenObj.add(item[prop]);
    return !duplicate;
  });
  return filteredArr;
}

export function nextDate(d = 1, givenDate = new Date().toISOString()) {
  return new Date(
    new Date(givenDate).setDate(new Date(givenDate).getDate() + d)
  );
}

export function genString(length, str = "ABCDEFGHJKLMNPQRSTUVWXYZ") {
  let text = "";
  for (let i = 0; i < length; i++) {
    text += str.charAt(Math.floor(Math.random() * str.length));
  }
  return text;
}

function daysIntoYear(date = new Date()) {
  // eslint-disable-next-line max-len
  return (
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
    24 /
    60 /
    60 /
    1000
  );
}

export function genCode(len = 9) {
  let d = new Date().getFullYear().toString().substr(-2);
  d += daysIntoYear();
  if (len - d.length > 0) {
    return d + genString(len - d.length);
  }
  return genString(len);
}

export function generateCode(len = 10) {
  let d = new Date().getFullYear().toString().substr(-1);
  d += daysIntoYear();
  if (len - d.length > 0) {
    return d + genString(len - d.length, "0987654321");
  }
  return genString(len, "0987654321");
}

export async function generateModelCode(Model) {
  let code = generateCode(10);
  let duplicate = await Model.findOne({ code }).exec();
  if (duplicate) {
    data.code = generateCode(10);
    duplicate = await Model.findOne({ code }).exec();
    if (duplicate) {
      throw new Error(`${Model} record code ${data.code} exists.`);
    }
  }
  return code;
}

export function hasNull(Obj = {}) {
  const val = Object.values(Obj);
  if (val.includes(null) || val.includes(undefined) || val.includes(""))
    return true;
  return false;
}

export function formatPhone(phone) {
  if (!phone) return null;
  let str = phone.trim();
  if (str.length === 11 && str[0] === "0") {
    str = `+234${str.slice(1)}`;
  }
  if (str.length === 10) {
    str = `+234${str}`;
  }
  return str;
}

export function stringToArrayPhone(str) {
  const arr = str.split(",").map((st) => st.trim()) || []; // remove spaces
  const filtered = arr.filter(
    (value, index) => value.length >= 11 && value.length < 15
  );
  return [...new Set(filtered)]; // Remove duplicates
}

export function getRequestIp(request) {
  let ipAddr = request.connection.remoteAddress;
  if (request.headers && request.headers["x-forwarded-for"]) {
    [ipAddr] = request.headers["x-forwarded-for"].split(",");
  }
  return ipAddr;
}

// eslint-disable-next-line complexity
export function getFullname(record) {
  if (!record) return "";
  const title = hasProp(record, "title") ? record.title : "";
  const gender = hasProp(record, "gender")
    ? `(${record.gender.charAt(0).toLowerCase()})`
    : "";
  const surname = hasProp(record, "surname") ? record.surname : "";
  const lastName = hasProp(record, "lastName") ? record.lastName : "";
  return `${titleCase(`${title} ${surname} ${lastName}`)} ${gender}`.trim();
}

export function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const slugit = (str) => slugify(str, {
  replacement: '-',  // replace spaces with replacement character, defaults to `-`
  remove: /[*+~.,()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
  lower: true,      // convert to lower case, defaults to `false`
  strict: true,     // strip special characters except replacement, defaults to `false`
  locale: 'en',       // language code of the locale to use
  trim: true         // trim leading and trailing replacement chars, defaults to `true`
});

// eslint-disable-next-line complexity
export function calcTax(taxableIncome) {
  let income = taxableIncome;
  let taxTotal = 0;
  if (income >= 1) {
    const taxable = income - 300000 >= 0 ? 300000 : income;
    const tax = (taxable * 7) / 100;
    taxTotal += tax;
    income -= taxable;
  }
  if (income >= 1) {
    const taxable = income - 300000 >= 0 ? 300000 : income;
    const tax = (taxable * 11) / 100;
    taxTotal += tax;
    income -= taxable;
  }
  if (income >= 1) {
    const taxable = income - 500000 >= 0 ? 500000 : income;
    const tax = (taxable * 15) / 100;
    taxTotal += tax;
    income -= taxable;
  }
  if (income >= 1) {
    const taxable = income - 500000 >= 0 ? 500000 : income;
    const tax = (taxable * 19) / 100;
    taxTotal += tax;
    income -= taxable;
  }
  if (income >= 1) {
    const taxable = income - 1600000 >= 0 ? 1600000 : income;
    const tax = (taxable * 21) / 100;
    taxTotal += tax;
    income -= taxable;
  }
  if (income >= 1) {
    const tax = (income * 24) / 100;
    taxTotal += tax;
  }
  return taxTotal;
}

export function getDistanceFromLatLonInKm(point1, point2) {
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;
  const earthRadius = 6371;
  const dLat = convertDegToRad(lat2 - lat1);
  const dLon = convertDegToRad(lon2 - lon1);
  const squarehalfChordLength =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(convertDegToRad(lat1)) *
      Math.cos(convertDegToRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const angularDistance =
    2 *
    Math.atan2(
      Math.sqrt(squarehalfChordLength),
      Math.sqrt(1 - squarehalfChordLength)
    );
    return earthRadius * angularDistance;
}

export function distanceCalc(lat1, lon1, lat2, lon2, unit) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}


/**
 * 
 * @param {Array} pointFrom coordinate of origin in [long1, lat1]
 * @param {Array} pointTo coordinate of destination in [long1, lat1]
 * @returns {number} Distance in Km
 */
 export function calculateDistance(pointFrom, pointTo) {
  let [long1, lat1] = pointFrom;
  let [long2, lat2] = pointTo;
  //radians
  lat1 = (lat1 * 2.0 * Math.PI) / 60.0 / 360.0;
  long1 = (long1 * 2.0 * Math.PI) / 60.0 / 360.0;
  lat2 = (lat2 * 2.0 * Math.PI) / 60.0 / 360.0;
  long2 = (long2 * 2.0 * Math.PI) / 60.0 / 360.0;

  // use to different earth axis length
  var a = 6378137.0; // Earth Major Axis (WGS84)
  var b = 6356752.3142; // Minor Axis
  var f = (a - b) / a; // "Flattening"
  var e = 2.0 * f - f * f; // "Eccentricity"

  var beta = a / Math.sqrt(1.0 - e * Math.sin(lat1) * Math.sin(lat1));
  var cos = Math.cos(lat1);
  var x = beta * cos * Math.cos(long1);
  var y = beta * cos * Math.sin(long1);
  var z = beta * (1 - e) * Math.sin(lat1);

  beta = a / Math.sqrt(1.0 - e * Math.sin(lat2) * Math.sin(lat2));
  cos = Math.cos(lat2);
  x -= beta * cos * Math.cos(long2);
  y -= beta * cos * Math.sin(long2);
  z -= beta * (1 - e) * Math.sin(lat2);

  return Math.sqrt(x * x + y * y + z * z) / 1000;
}
