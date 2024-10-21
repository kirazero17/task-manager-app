// Import services
const { authService } = require("../services/auth");

// Import utils
const Utils = require("../utils");

function checkToken(req, res, next) {
  return Utils.Error.handleResponseError(this, res, async function (o) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      o.code = 401;
      throw new Error("Token is required");
    }

    const [, token] = authorization.split(" ");
    const result = await authService.verifyToken(token);

    if (result.code) {
      res.locals.tokenPayload = result.data;
      return next();
    } else {
      o.code = 401;
      throw new Error("Unauthenticated");
    }
  });
}

module.exports = { checkToken };
