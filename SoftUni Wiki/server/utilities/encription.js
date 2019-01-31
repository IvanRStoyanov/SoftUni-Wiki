const crypto = require('crypto');
module.exports = {
  getSalt: () => {
      return crypto.randomBytes(128).toString('base64');
  },
  getHashedPass: (salt, pass) => {
      return crypto.createHmac('sha256', salt).update(pass).digest('hex');
    }
};