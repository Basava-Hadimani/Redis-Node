const client = require('../services/cache');

module.exports = async(req, res, next) => {
 await next();

 client(req.user.id);
}