require('dotenv').config();

let serverToConnect;

switch (process.env.NODE_ENV) {
  case "development":
    serverToConnect = process.env.MONGO_URI_DEVELOPMENT;
    break;
  case "production":
    serverToConnect = process.env.MONGO_URI_PRODUCTION;
    break;
  case "staging":
    serverToConnect = process.env.MONGO_URI_STAGING;
    break;
  case "test":
    serverToConnect = process.env.MONGO_URI_TEST;
    break;
}

exports.server = serverToConnect;