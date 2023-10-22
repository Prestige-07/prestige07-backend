const authenticate = require("./authenticate");
const upload = require("./upload");
const checkFileSize = require("./checkFileSize");
const validateBody = require("./validateBody");

module.exports = {
  authenticate,
  upload,
  checkFileSize,
  validateBody,
};
