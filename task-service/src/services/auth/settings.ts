import AppConfig from "src/app.config.json";

export const AuthSettings = {
  ISSUER: AppConfig.rootIssuer,
  ROLES: {
    USER: "user",
    GUEST: "guest",
    ADMIN: "admin",
  },
  EXPIRATION: {
    ACCESS_TOKEN: AppConfig.tokenExpiration.accessToken, // 1 Minutes
  },
};
