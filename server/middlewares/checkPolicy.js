// Import services
const { authService } = require("../services/auth");

// Import utils
const Utils = require("../utils");

function createPolicyChecker(resource, action) {
  return function checkPolicy(req, res, next) {
    return Utils.Error.handleResponseError(this, res, function (o) {
      const tokenPayload = res.locals.tokenPayload;

      if (!tokenPayload) {
        o.code = 401;
        throw new Error("Authentication is required");
      }

      if (authService.checkPolicy(tokenPayload.role, resource, action)) {
        return next();
      } else {
        o.code = 403;
        throw new Error("You don't have permission to do this action");
      }
    });
  };
}

module.exports = { createPolicyChecker };
