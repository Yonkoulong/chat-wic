const configCloudApi = {
  cloud_name: process?.env?.CLOUD_NAME,
  api_key: process?.env?.API_CLOUD_KEY,
  api_secret: process?.env?.API_CLOUD_SECRET_KEY,
};

const cloudApi = require("cloudinary").v2;

// configuration

cloudApi.config(configCloudApi);

module.exports = cloudApi;
