// Import classes
import { Endpoints } from "src/classes/Endpoints";

// Import services
import { AuthMiddlewares } from "src/services/auth/middlewares";

const tasksEndpoints = new Endpoints("tasks");

// Add your handlers here
/**
 * Get tasks.
 * Note: can be used by authorized person only.
 */
tasksEndpoints
  .createHandler("")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createCheckPolicy("task:*", "task:getTasks"))
  .get((req, res) => {
    const { skip = 0, limit = 10 } = req.query;
    return "Hello from tasks root endpoint";
  });

/**
 * Get task by id.
 * Note: can be used by authorized person only.
 */
tasksEndpoints
  .createHandler(":id")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createCheckPolicy("task:*", "task:getTask"))
  .get((req, res) => {
    return {
      users: [],
      text: "Hello world",
    };
  });

/**
 * Update task by id.
 * Note: can be used by authorized person only.
 */
tasksEndpoints
  .createHandler(":id")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createCheckPolicy("task:*", "task:updateTask"))
  .patch((req, res) => {
    return {
      users: [],
      text: "Hello world",
    };
  });

/**
 * Delete task of a user by id.
 * Note: can be used by authorized person only.
 */
tasksEndpoints
  .createHandler(":id")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createCheckPolicy("task:*", "task:deleteTask"))
  .delete((req, res) => {
    return {
      users: [],
      text: "Hello world",
    };
  });

export default tasksEndpoints;
