require('dotenv').config();
const fs = require("fs");
const https = require("https");
const logger = require("./utils/logger");
const app = require('./app');
const PORT = process.env.PORT;


process.on('uncaughtException', (err, origin) => {
  logger.error(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

function createServer() {
  if (fs.existsSync("server.key") && fs.existsSync("server.cert")) {
    https
      .createServer(
        {
          key: fs.readFileSync("server.key"),
          cert: fs.readFileSync("server.cert"),
        },
        app,
      )
      .listen(PORT, () => {
        logger.info(`HTTPS Listening: ${PORT}`);
      });
  } else {
    const server = app.listen(PORT, () => {
      logger.info("HTTP Listening on port:", server.address().port);
    });
  }
}


function start() {
  createServer();
}

start();

