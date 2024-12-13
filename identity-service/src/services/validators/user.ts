import Joi from "joi";

export const UserDataSignUpValidator = Joi.object({
  firstName: Joi.string()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9\\s]{3,15}$")),
  lastName: Joi.string()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9\\s]{4,30}$")),
  username: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")),
  email: Joi.string().email().required().max(255),
  confirmPassword: Joi.ref("password"),
  password: Joi.string()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9@_]{6,30}$")),
});
export const UserDataSignInValidator = Joi.object({
  username: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")),
  password: Joi.string()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9@_]{6,30}$")),
});
