const crypto = require("crypto");

module.exports = function generateApiKey() {
  return crypto.randomBytes(32).toString("hex");
};
