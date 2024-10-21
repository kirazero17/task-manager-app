const AuthSettings = {
  PROVIDER: "TO_DO_APP",
  ROLES: {
    USER: "user",
    GUEST: "guest",
    ADMIN: "admin",
  },
  EXPIRATION: {
    _DEFAULT: { value: "15", postfix: "m" }, // 1 Minutes
  },
};

module.exports = AuthSettings;
