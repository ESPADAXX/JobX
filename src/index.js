const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const http = require('http'); // Use HTTP server for socket integration
require("./config/db")();

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api", require("./api"));

// Create HTTP server and integrate socket
const server = http.createServer(app);
require("./config/Socket")(server); // Initialize socket functionalities

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
