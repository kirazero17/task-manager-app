const { Handler, Controller } = require("../classes/controller");

// Import database client
const { mySQLCLientActions } = require("../database/mysql");

// Import middlewares
const { createPolicyChecker } = require("../middlewares/checkPolicy");
const { checkToken } = require("../middlewares/checkToken");

const taskController = new Controller("/tasks");
const tableName = "TASKS";

taskController.appendHandler(
  new Handler(
    "/",
    "get",
    [checkToken, createPolicyChecker("tasks:*", "tasks:getTasks")],
    function (req, res) {
      const { skip = 0, limit = 10 } = req.query;
      return this.utils.Error.handleResponseError(
        this,
        res,
        async function (o) {
          o.data = await mySQLCLientActions.exec(
            `SELECT * FROM ${tableName}\n` + `LIMIT ${limit} OFFSET ${skip};`
          );
          o.message = "Query tasks successfully";

          return o;
        }
      );
    }
  )
);

taskController.appendHandler(
  new Handler(
    "/:id",
    "get",
    [checkToken, createPolicyChecker("tasks:*", "tasks:getTask")],
    function (req, res) {
      const { id } = req.params;

      return this.utils.Error.handleResponseError(
        this,
        res,
        async function (o) {
          const result = await mySQLCLientActions.exec(
            `SELECT * FROM ${tableName}\n` + `WHERE ${tableName}.id = ${id};`
          );

          o.data = result[0];
          o.message = "Query task successfully";

          return o;
        }
      );
    }
  )
);

taskController.appendHandler(
  new Handler(
    "/standalone",
    "post",
    [checkToken, createPolicyChecker("tasks:task", "tasks:addTask")],
    function (req, res) {
      const data = req.body;

      return this.utils.Error.handleResponseError(
        this,
        res,
        async function (o) {
          const [fieldsText, fieldsData] =
            mySQLCLientActions.getFieldsAndData(data);
          const result = await mySQLCLientActions.exec(
            `INSERT INTO ${tableName} (${fieldsText})\n` +
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

taskController.appendHandler(
  new Handler(
    "/:id",
    "patch",
    [checkToken, createPolicyChecker("tasks:task", "tasks:updateTask")],
    function (req, res) {
      const { id } = req.params;
      const data = req.body;

      return this.utils.Error.handleResponseError(
        this,
        res,
        async function (o) {
          if (!id) throw new Error("The id of task is required");

          const newFieldsAndValues =
            mySQLCLientActions.getFieldsAndDataAsKeyPair(data);
          const result = await mySQLCLientActions.exec(
            `UPDATE ${tableName}\n` +
              `SET ${newFieldsAndValues}``WHERE ${tableName}.id = ${id};`
          );

          o.data = result[0];
          o.message = "Update task successfully";

          return o;
        }
      );
    }
  )
);

taskController.appendHandler(
  new Handler(
    "/:id",
    "delete",
    [checkToken, createPolicyChecker("tasks:task", "tasks:deleteTask")],
    function (req, res) {
      const { id } = req.params;

      return this.utils.Error.handleResponseError(
        this,
        res,
        async function (o) {
          if (!id) throw new Error("The id of task is required");

          const result = await mySQLCLientActions.exec(
            `DELETE FROM ${tableName}\n` + `WHERE ${tableName}.id = ${id};`
          );

          o.data = result[0];
          o.message = "Delete task successfully";

          return o;
        }
      );
    }
  )
);

module.exports = taskController;
