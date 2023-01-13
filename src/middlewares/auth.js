const db = require("../utils/db");
const func = require("../utils/func");
const { LOGIN_AUTH_MSG } = require("../constants");


/**
 * Middleware that adds to the request the address sent in the headers.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
const withAddress = (req, res, next) => {
  const { address } = req.headers;
  req.address = address;

  // TODO maybe return a 400 if the address is undefined
  next();
};


const withSignature = async (req, res, next) => {
  const { address, authorization: signature } = req.headers;
  req.address = address;

  // todo 暂时去掉验证
  // if (!address || !signature) return res.status(401).send(`Auth failed`);

  // let bool = await func.authSignature({ address, signature, msg: LOGIN_AUTH_MSG },);
  // if (!bool) return res.status(401).send(`Auth failed`);

  const user = await db.getOne('users', { address });
  if (!user) {
    await db.add('users', { address, 'creationTimestamp': new Date().getTime() });
  }

  next();
};


module.exports = {
  withAddress,
  withSignature,
};
