const db = require('../models');
const createService = require('../utils/createService');

module.exports.profileService = createService(db.User);
