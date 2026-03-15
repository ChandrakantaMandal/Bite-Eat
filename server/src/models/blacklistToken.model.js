const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    require: [true, "token is required to be added in blacklist"],
    unique: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});

const BlacklistToken = mongoose.model('BlacklistToken',blacklistTokenSchema);

module.exports = BlacklistToken;