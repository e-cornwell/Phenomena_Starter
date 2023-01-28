require('dotenv').config();
const PORT = process.env.PORT || 3000;
const express = require("express");
const server = express();

const morgan = require('morgan');
const bodyParser = require('body-parser')

server.use(morgan('dev'));

const cors = require('cors')
server.use(cors());

server.use(bodyParser.json());

const apiRouter = require("./api");
server.use("/api", apiRouter);

const { client } = require('./db');

// Create custom 404 handler that sets the status code to 404.

// Create custom error handling that sets the status code to 500
// and returns the error as an object

server.listen(PORT, async() => {
    console.log(`"The server is up on port", ${PORT}`);
    await client.connect();
});


// Use the dotenv package, to create environment variables
// Create a constant variable, PORT, based on what's in process.env. PORT or fallback to 3000
// Import express, and create a server
// Require morgan and body-parser middleware
// Have the server use morgan with setting 'dev'
// Import cors 
// Have the server use cors()
// Have the server use bodyParser.json()
// Have the server use your api router with prefix '/api'
// Import the client from your db/index.js
// Start the server listening on port PORT
// On success, connect to the database
