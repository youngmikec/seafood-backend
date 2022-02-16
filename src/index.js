import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import appApi from "./api/index.js";
import database from "./config/index.js";// import appApi from "./api";

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

const port = process.env.PORT || 3000;
// const hostname = process.env

const app = express();

database.once('open', () => {
    console.log('Successfully connected to database');
});

database.on('close', () => {
    database.removeAllListeners();
})

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors(corsOptions));
app.use(express.json());


// Routes
app.get('/', (req, res) => {
    res.send("Seafoo says hello");
});

// Use Routes
app.use("/api", appApi);


app.listen(port, (error) => {
    if(error) console.log(`Error starting server on port ${port}`);
    console.log(`server running on port ${port}`);
});


let connections = [];

app.on('connection', (connection) => {
    connections.push(connection);
    // eslint-disable-next-line no-return-assign
    connection.on('close', () => connection = connections.filter(current => current != connection));
    console.log(`${connections.length} connections`);
});

// export default app;
// module.exports = app;
