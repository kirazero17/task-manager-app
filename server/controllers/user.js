const { Handler, Controller } = require("../classes/controller");

// Import database client
const { mySQLCLientActions } = require("../database/mysql");

// Import middlewares
const { createPolicyChecker } = require("../middlewares/checkPolicy");
const { checkToken } = require("../middlewares/checkToken");

const userController = new Controller("/users");
const usersTableName = "USERS";
const tasksTableName = "TASKS";

userController.appendHandler(
  new Handler(
    "/:id",
    "get",
    [checkToken, createPolicyChecker("users:user", "users:getUser")],
    function (req, res) {
      const { id } = req.params;

      return this.utils.Error.handleResponseError(
        this,
        res,
        async function (o) {
          if (!id) throw new Error("Id of user is required");

          const result = await await mySQLCLientActions.exec(
            `SELECT * FROM ${usersTableName}\n` +
              `WHERE ${usersTableName}.id LIKE ${id};`
          );

          o.data = result[0];
          o.message = "Query user successfully";

          return o;
        }
      );
    }
  )
);

userController.appendHandler(
  new Handler(
    "/:id/tasks",
    "get",
    [checkToken, createPolicyChecker("users:tasks", "users:getTasks")],
    function (req, res) {
      const { id } = req.params;
      const { skip = 0, limit = 10 } = req.query;

      return this.utils.Error.handleResponseError(
        this,
        res,
        async function (o) {
          if (!id) throw new Error("The id of user is required");
          o.data = await mySQLCLientActions.exec(
            `SELECT * FROM ${tasksTableName}\n` +
              `WHERE ${tasksTableName}.userId = ${id}\n` +
              `LIMIT ${limit} OFFSET ${skip};`
          );
          o.message = "Query tasks successfully";

          return o;
        }
      );
    }
  )
);

userController.appendHandler(
  new Handler(
    "/:id/tasks/:taskId",
    "get",
    [checkToken, createPolicyChecker("users:task", "users:getTask")],
    function (req, res) {
      const { id, taskId } = req.params;

      return this.utils.Error.handleResponseError(
        this,
        res,
        async function (o) {
          if (!id) throw new Error("The id of user is required");
          if (!taskId) throw new Error("The id of task is required");

          const result = await mySQLCLientActions.exec(
            `SELECT * FROM ${tasksTableName}\n` +
              `WHERE ${tasksTableName}.id = ${taskId} AND ${tasksTableName}.userId = ${id}`
          );

          o.data = result[0];
          o.message = "Query task successfully";

          return o;
        }
      );
    }
  )
);

userController.appendHandler(
  new Handler(
    "/:id/task",
    "post",
    [checkToken, createPolicyChecker("users:task", "users:addTask")],
    function (req, res) {
      const { id } = req.params;
      const data = req.body;

      return this.utils.Error.handleResponseError(
        this,
        res,
        async function (o) {
          if (!id) throw new Error("The id of user is required");

          const [fieldsText, fieldsData] =
            mySQLCLientActions.getFieldsAndData(data);
          const result = await mySQLCLientActions.exec(
            `INSERT INTO ${tasksTableName} (${fieldsText})\n` +
              `VALUES (${fieldsData});`
          );

          if (result && Number.isNaN(result.insertId))
            throw new Error("Cannot assign task");

          o.data = {
            ...data,
            id: result.insertId,
          };
          o.message = "Add task successfully";

          return o;
        }
      );
    }
  )
);

userController.appendHandler(
  new Handler(
    "/:id/tasks/:taskId",
    "patch",
    [checkToken, createPolicyChecker("users:task", "users:updateTask")],
    function (req, res) {
      const { id, taskId } = req.params;
      const data = req.body;

      return this.utils.Error.handleResponseError(
        this,
        res,
        async function (o) {
          if (!id) throw new Error("The id of user is required");
          if (!taskId) throw new Error("The id of task is required");

          const newFieldsAndValues =
            mySQLCLientActions.getFieldsAndDataAsKeyPair(data);
          const result = await mySQLCLientActions.exec(
            `UPDATE ${tasksTableName}\n` +
              `SET ${newFieldsAndValues}\n` +
              `WHERE ${tasksTableName}.id = ${taskId} AND ${tasksTableName}.userId = ${id};`
          );

          o.data = result[0];
          o.message = "Update task successfully";

          return o;
        }
      );
    }
  )
);

userController.appendHandler(
  new Handler(
    "/:id/tasks/:taskId",
    "delete",
    [checkToken, createPolicyChecker("users:task", "users:deleteTask")],
    function (req, res) {
      const { id, taskId } = req.params;

      return this.utils.Error.handleResponseError(
        this,
        res,
        async function (o) {
          if (!id) throw new Error("The id of user is required");
          if (!taskId) throw new Error("The id of task is required");

          const result = await mySQLCLientActions.exec(
            `DELETE FROM ${tasksTableName}\n` +
              `WHERE ${tasksTableName}.id = ${taskId} AND ${tasksTableName}.userId = ${id};`
          );

          o.data = result[0];
          o.message = "Delete task successfully";

          return o;
        }
      );
    }
  )
);

module.exports = userController;
