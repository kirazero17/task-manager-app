// Import service
import { authService } from ".";

// Import utils
import { ErrorUtils } from "src/utils/error";

// Import types
import type { Request, Response, NextFunction } from "express";

export class AuthMiddlewares {
  /**
   * Validate a token, is it valid?
   * @param req
   * @param res
   * @param next
   * @returns
   */
  static checkToken(req: Request, res: Response, next: NextFunction) {
    return ErrorUtils.handleJSONResponseError(
      this,
      req,
      res,
      async function ($, $$, o) {
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
      }
    );
  }
}
