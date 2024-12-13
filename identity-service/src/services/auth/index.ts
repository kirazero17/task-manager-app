import fs from "fs";
import jwt from "jsonwebtoken";

// Import models
import identity from "src/databases/identity";

// Import utils
import { StringUtils } from "src/utils/string";
import { ErrorUtils } from "src/utils/error";
import { DatetimeUtils } from "src/utils/datetime";

import { AuthSettings } from "./settings";

type AccessTokenPayloadType = {
  role: string;
  expire: number;
  issuer: string;
};

class AuthService {
  private _role!: any;
  private _signature!: string;
  private _canCreateToken!: boolean;

  constructor() {
    try {
      const IdentityModels = identity();
      this._signature = fs
        .readFileSync(
          StringUtils.getRootDirTo("secrets/jwt_signature"),
          "utf-8"
        )
        .toString();
      this._canCreateToken = true;

      // Get role
      this._role = {};
      IdentityModels.Role.findAll().then((roles) => {
        for (const role of roles) {
          const r = role.toJSON();
          this._role[r.name] = r.value;
        }
      });
    } catch (error: any) {
      // Just print error's message
      console.error(error.message);
      this._canCreateToken = false;
    }
  }

  /**
   * Use this method to verify token
   * @param tokenInHeaders
   * @returns
   */
  async verifyToken(token: string) {
    return ErrorUtils.handleInterchangeError(this, async function (o) {
      if (!token) throw new Error("Token isn't found");

      // 1. Is token valid?
      if (!jwt.verify(token, this._signature)) {
        o.code = 403;
        throw new Error("Token is invalid");
      }

      let tokenPayload = jwt.decode(token) as AccessTokenPayloadType;
      let expire = tokenPayload.expire;
      let now = Date.now();

      // 2. Check provider
      if (tokenPayload.issuer !== AuthSettings.ISSUER)
        throw new Error("The token provider isn't valid");

      // 3. Check expiration
      if (expire <= now) {
        throw new Error("The token is expired");
      }

      o.data = tokenPayload;
      o.message = "Token is valid";

      return;
    });
  }

  /**
   * Use this method to create a token from `role` and `credential` of user.
   * @param role
   * @param credential
   * @returns
   */
  async createToken(role: string) {
    if (!this._canCreateToken) {
      console.warn(
        "The signature must be assigned before the service creates token"
      );
      return null;
    }

    let period = DatetimeUtils.getTime(
      AuthSettings.EXPIRATION.ACCESS_TOKEN.value +
        AuthSettings.EXPIRATION.ACCESS_TOKEN.postfix
    );

    if (!this._role[role]) throw new Error("Invalid role");

    let tokenPayload: AccessTokenPayloadType = {
      role: this._role[role],
      expire: period,
      issuer: AuthSettings.ISSUER,
    };

    let token = jwt.sign(tokenPayload, this._signature, {
      algorithm: "HS256",
      expiresIn: period,
    });

    return token;
  }
}

export const authService = new AuthService();
