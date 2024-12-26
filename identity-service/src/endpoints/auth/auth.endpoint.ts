import { v1 as uuid } from "uuid";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

// Import classes
import { Endpoints } from "src/classes/Endpoints";

// Import models
import identity from "src/databases/identity";

// Import services
import { authService } from "src/services/auth";

// Import validators
import {
  UserDataSignInValidator,
  UserDataSignUpValidator,
} from "src/services/validators/user";

const authEndpoints = new Endpoints("auth");
const IdentityModels = identity();
const salt = 5;

// Add your handlers here
authEndpoints.createHandler("sign-up").post(async (req, res, o) => {
  const data = req.body;

  // Validate data
  const validationResult = UserDataSignUpValidator.validate(data);
  // Check validation result
  if (validationResult.error) {
    o.code = 400;
    throw new Error(validationResult.error.message);
  }

  // Find user by username and email
  const userCount = await IdentityModels.User.count({
    where: {
      [Op.or]: [{ username: data.username }, { email: data.email }],
    },
  });

  // Check if user with that email or username exists
  if (userCount > 0) {
    o.code = 400;
    throw new Error("The account with this username or email is registered");
  }

  // Hashed password
  const hashedPassword = bcrypt.hashSync(data.password, salt);

  // Delete password and confirmPassword
  delete data.password;
  delete data.confirmPassword;

  // Get role
  const role = (await IdentityModels.Role.findOne({
    where: {
      name: "User",
    },
  }))!.toJSON();

  // Insert user to database
  const insertResult = (
    await IdentityModels.User.create({
      ...data,
      id: uuid(),
      roleId: role.id,
      hashedPassword,
    })
  ).toJSON();

  return {
    user: { ...validationResult.value, id: insertResult.id, role },
    token: authService.createToken(role.name),
  };
});

authEndpoints.createHandler("sign-in").post(async (req, res, o) => {
  const data = req.body;

  // Validate data
  const validationResult = UserDataSignInValidator.validate(data);
  // Check validation result
  if (validationResult.error) {
    o.code = 400;
    throw new Error(validationResult.error.message);
  }

  // Find user with username
  const findUserResult = await IdentityModels.User.findOne({
    include: [
      {
        model: IdentityModels.Role,
        as: "role",
      },
    ],
    where: {
      username: data.username,
    },
  });

  if (!findUserResult) {
    o.code = 400;
    throw new Error(`The user \`${data.username}\` is not registered`);
  }

  const user = findUserResult.toJSON();
  let passwordCheck = bcrypt.compareSync(data.password, user.hashedPassword);

  // Check password
  if (data.password && !passwordCheck) {
    o.code = 400;
    throw new Error("Incorrect password");
  }

  let tokenCheck = (await authService.verifyToken(data.token)).code === 0;

  if (data.token && !tokenCheck) {
    o.code = 401;
    throw new Error("Invalid token");
  } else if (data.token && tokenCheck) {
    // Token is valid
    return {
      user: user,
    };
  }

  // Delete some fields
  delete user.hashedPassword;
  delete user.roleId;

  return {
    user: user,
    token: authService.createToken(user.role.name),
  };
});

export default authEndpoints;
