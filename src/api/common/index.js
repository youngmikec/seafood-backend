import mongoose from "mongoose";

/**
 * @description https://mongoosejs.com/docs/geojson.html
 *  longitude first, then latitude
 */

const pointSchema = new mongoose.Schema({
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true, default: [0, 0] },

});

const polygonSchema = new mongoose.Schema({
    type: { type: String, enum: ["Polygon"], required: true },
    coordinates: { type: [[[Number]]], required: true },
});

// const Location = new mongoose.Schema({
//     address: { type: String },
//     point: pointSchema,
// });

const Location = new mongoose.Schema({
    address: { type: String, trim: true },
    type: { type: String, enum: ["Point", "Polygon"], default: "Point" },
    coordinates: { type: [Number], required: true, default: [0, 0] }, // longitude  latitude
});

export { Location, pointSchema, polygonSchema };
