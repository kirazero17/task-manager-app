import { v1 as uuid } from "uuid";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

// Import classes
import { Endpoints } from "src/classes/Endpoints";

// Import models
import identity from "src/databases/identity";

// Import services
import { authService } from "src/services/auth";
import {
  UserDataSignInValidator,
  UserDataSignUpValidator,
} from "src/services/validators/user";

// Import logger builder
import { LoggerBuilder } from "src/logger";

const authEndpoints = new Endpoints("auth");
const IdentityModels = identity();
const logger = new LoggerBuilder().to("auth-endpoints").build();
const salt = 5;

// Add your handlers here
authEndpoints.createHandler("sign-up").post(async (req, res, o) => {
  const profiler = logger.startTimer();
  const data = req.body;
  // Declare and assign user information
  const emailUsernameInformation = `email ${data.username} or username ${data.email}`;

  // Start log
  profiler.logger.info(
    LoggerBuilder.buildEndpointLog(
      `Register new user with ${emailUsernameInformation}`,
      req
    )
  );

  // Validate data
  const validationResult = UserDataSignUpValidator.validate(data);
  // Check validation result
  if (validationResult.error) {
    o.code = 400;
    profiler.done(
      LoggerBuilder.buildEndpointLog(validationResult.error.message, req)
    );
    throw new Error(validationResult.error.message);
  }

  // Find user by username and email
  const userCount = await IdentityModels.User.count({
    where: {
      [Op.or]: [
        { username: validationResult.value.username },
        { email: validationResult.value.email },
      ],
    },
  });
  profiler.logger.info(
    LoggerBuilder.buildEndpointLog(`User count is ${userCount}`, req)
  );

  // Check if user with that email or username exists
  if (userCount > 0) {
    const message = "The account with this username or email is registered";
    o.code = 400;
    profiler.done(LoggerBuilder.buildEndpointLog(message, req));
    throw new Error(message);
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

  profiler.logger.info(
    LoggerBuilder.buildEndpointLog(
      `User's password is hashed and user role is ${role.name}`,
      req
    )
  );

  // Insert user to database
  const insertResult = (
    await IdentityModels.User.create({
      ...data,
      id: uuid(),
      roleId: role.id,
      hashedPassword,
    })
  ).toJSON();

  // Done
  profiler.done(
    LoggerBuilder.buildEndpointLog("New user signs up successfully", req)
  );

  return {
    user: { ...validationResult.value, id: insertResult.id, role },
    token: authService.createToken(role.name),
  };
});

authEndpoints.createHandler("sign-in").post(async (req, res, o) => {
  const data = req.body;
  const profiler = logger.startTimer();
  // Declare and assign user information
  const emailUsernameInformation = `email ${data.username} or username ${data.email}`;

  // Start log
  profiler.logger.info(
    LoggerBuilder.buildEndpointLog(
      `User with ${emailUsernameInformation} start signing in`,
      req
    )
  );

  // Validate data
  const validationResult = UserDataSignInValidator.validate(data);
  // Check validation result
  if (validationResult.error) {
    o.code = 400;
    profiler.done(
      LoggerBuilder.buildEndpointLog(validationResult.error.message, req)
    );
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

  profiler.logger.info(
    LoggerBuilder.buildEndpointLog(`Found informaion of user`, req)
  );

  if (!findUserResult) {
    const message = "This user is not registered";
    o.code = 400;
    profiler.done(LoggerBuilder.buildEndpointLog(message, req));
    throw new Error(message);
  }

  const user = findUserResult.toJSON();
  let tokenCheck = (await authService.verifyToken(data.token)).code === 0;

  if (data.token && !tokenCheck) {
    o.code = 401;
    profiler.done(
      LoggerBuilder.buildEndpointLog(
        "User tries to sign in with invalid token",
        req
      )
    );
    throw new Error("Invalid token");
  } else if (data.token && tokenCheck) {
    profiler.done(
      LoggerBuilder.buildEndpointLog(
        `User signs in successfully with token`,
        req
      )
    );

    // Token is valid
    return {
      user: user,
    };
  }

  if (!data.password) {
    o.code = 400;
    profiler.done(
      LoggerBuilder.buildEndpointLog(
        "User tries to sign in without password",
        req
      )
    );
    throw new Error("Password is required");
  }

  let passwordCheck = bcrypt.compareSync(data.password, user.hashedPassword);
  // Check password
  if (data.password && !passwordCheck) {
    o.code = 400;
    profiler.done(
      LoggerBuilder.buildEndpointLog(
        "User tries to sign in with incorrect password",
        req
      )
    );
    throw new Error("Incorrect password");
  }

  // Delete some fields
  delete user.hashedPassword;
  delete user.roleId;

  // Done
  profiler.done(
    LoggerBuilder.buildEndpointLog("User signs in successfully", req)
  );

  return {
    user: user,
    token: authService.createToken(user.role.name),
  };
});

export default authEndpoints;
