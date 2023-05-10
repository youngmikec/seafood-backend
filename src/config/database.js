import mongoose from "mongoose";
import credentials from "./credentials.js";

mongoose.Promise = global.Promise;

const { uri, options } = credentials;


mongoose.connect(uri, options)
    .then(() => { console.log("Connected to database!"); })
    .catch((error) => {
        console.error("Database connection failed!");
        console.error(error.message);
        process.exit(1);
    });

const database = mongoose.connection;

// database.on("error", console.error.bind(console, "Database Connection Error:"));

export default database;
