import dotenv from "dotenv";
import rp from "request-promise";
// import { logRequestError } from "./request-";

dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;

/**
 * 
 * @param {*} query 
 * @returns { destination_addresses, origin_addresses, rows: [ { elements: [{ distance, duration, status }]  } ] }
 */
export function distanceMatrix(query = "&") {
  const API_URL = `https://maps.googleapis.com/maps/api/distancematrix/json?key=${API_KEY}`;
  const headersObj = {
    Accept: "application/json",
    "Content-Type": "application/json",
    json: true,
  };
  const options = {
    method: "GET",
    uri: `${API_URL}${query}`,
    headers: headersObj,
    json: true,
  };
  return rp(options)
    .then((response) => response)
    // .catch((error) => logRequestError(error, options).then().catch(err => err));
    .catch((error) => console.log(error));
}


/**
 * 
 * @param {*} query 
 * @returns { results: [ { address_components, formatted_address, geometry: { location: { lat, lng } }, place_id, plus_code: { compound_code, global_code }, types} ], status }
 */
export function geocoding(query = "&address=1600+Amphitheatre+Parkway,+Mountain+View,+CA") {
  const API_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}`;
  const headersObj = {
    Accept: "application/json",
    "Content-Type": "application/json",
    json: true,
  };
  const options = {
    method: "GET",
    uri: `${API_URL}${query}`,
    headers: headersObj,
    json: true,
  };
  return rp(options)
    .then((response) => response)
    .catch((err) => err.error);
}

/**
 * 
 * @param {*} query 
 * @returns { results: [ { address_components, formatted_address, geometry: { location: { lat, lng } }, place_id, plus_code: { compound_code, global_code }, types} ], status }
 */
 export function reverseGeocoding(query = "&latlng=40.714224,-73.961452") {
  const API_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}`;
  const headersObj = {
    Accept: "application/json",
    "Content-Type": "application/json",
    json: true,
  };
  const options = {
    method: "GET",
    uri: `${API_URL}${query}`,
    headers: headersObj,
    json: true,
  };
  return rp(options)
    .then((response) => response)
    .catch((err) => err.error);
}
