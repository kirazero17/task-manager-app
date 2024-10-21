const { Handler, Controller } = require("../classes/controller");

// Import database client
const { mySQLCLientActions } = require("../database/mysql");

// Import services
const { authService } = require("../services/auth");

const authController = new Controller("/auth");
const usersTable = "USERS";

authController.appendHandler(
  new Handler("/sign-up", "post", null, function (req, res) {
    const data = req.body;

    return this.utils.Error.handleResponseError(this, res, async function (o) {
      const user = await mySQLCLientActions.exec(
        `SELECT * FROM ${usersTable}\n` +
          `WHERE ${usersTable}.username LIKE '${data.username}'`
      );

      if (user[0]) throw new Error("This user existed");

      const [fieldsText, fieldsData] =
        mySQLCLientActions.getFieldsAndData(data);
      const result = await mySQLCLientActions.exec(
        `INSERT INTO ${usersTable} (${fieldsText})\n` +
          `VALUES (${fieldsData});`
      );

      if (result && Number.isNaN(result.insertId))
        throw new Error("User isn't signed up");

      delete user.password;

      o.data = {
        user: { ...data, id: result.insertId },
        token: await authService.createToken("USER"),
      };
      o.message = "Sign up successfully";

      return o;
    });
  })
);

authController.appendHandler(
  new Handler("/sign-in", "post", null, function (req, res) {
    const data = req.body;

    return this.utils.Error.handleResponseError(this, res, async function (o) {
      if (data.token) {
        const userData = await authService.verifyToken(data.token);

        if (!userData.code) {
          o.code = 401;
          throw new Error(userData.message);
        }

        o.data = {
          user: null,
          token: null,
        };
        o.message = "Sign in successfully";

        return o;
      }

      const user = await mySQLCLientActions.exec(
        `SELECT * FROM ${usersTable}\n` +
          `WHERE ${usersTable}.username LIKE '${data.username}'`
      );

      if (!user[0]) throw new Error("Your username is wrong");

      if (user[0].password !== data.password)
        throw new Error("Your password is wrong");

      o.data = {
        user: user[0],
        token: await authService.createToken("USER"),
      };
      o.message = "Sign in successfully";

      return o;
    });
  })
);

module.exports = authController;
