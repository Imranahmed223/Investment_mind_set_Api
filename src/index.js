const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");
const fs = require("fs");
var https = require("https");
var http = require("http");
const { fetachCoinsData } = require("./utils/fetchCoins");
var privateKey = fs.readFileSync("SSL/private.key", "utf8");
var certificate = fs.readFileSync("SSL/certificate.crt", "utf8");
var credentials = { key: privateKey, cert: certificate };
let server;
var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info("Connected to MongoDB");
  httpServer.listen(config.httpPort, () => {
    logger.info(`HTTP Server Listening on port ${config.httpPort}`);
    // Run this function only once - Add crypto data in database
    fetachCoinsData();
  });
  // httpsServer.listen(config.httpsPort, () => {
  //   logger.info(`HTTPS Server Listening to port ${config.httpsPort}`);
  // });
});
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
