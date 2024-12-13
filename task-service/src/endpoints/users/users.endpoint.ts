// Import classes
import { Endpoints } from "src/classes/Endpoints";

// Import models
import identity from "src/databases/identity";

// Import services
import { AuthMiddlewares } from "src/services/auth/middlewares";

const usersEndpoints = new Endpoints("users");
const IdentityModels = identity();

// Add your handlers here
usersEndpoints
  .createHandler("")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createCheckPolicy("admin:*", "admin:getUsers"))
  .get((req, res) => {
    return "Hello from users root endpoint";
  });

usersEndpoints
  .createHandler(":id")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createCheckPolicy("user:*", "user:getInformation"))
  .get((req, res) => {
    return {
      users: [],
      text: "Hello world",
    };
  });

usersEndpoints
  .createHandler(":id/tasks")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createCheckPolicy("user:*", "user:getTasks"))
  .get((req, res) => {
    return {
      users: [],
      text: "Hello world",
    };
  });

usersEndpoints
  .createHandler(":id/tasks/:taskId")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createCheckPolicy("user:*", "user:getTask"))
  .get((req, res) => {
    return {
      users: [],
      text: "Hello world",
    };
  });

usersEndpoints
  .createHandler(":id/task")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createCheckPolicy("user:*", "user:addTask"))
  .post((req, res) => {
    return {
      users: [],
      text: "Hello world",
    };
  });

usersEndpoints
  .createHandler(":id/tasks/:taskId")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createCheckPolicy("user:*", "user:updateTask"))
  .patch((req, res) => {
    return {
      users: [],
      text: "Hello world",
    };
  });

usersEndpoints
  .createHandler(":id/tasks/:taskId")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createCheckPolicy("user:*", "user:deleteTask"))
  .delete((req, res) => {
    return {
      users: [],
      text: "Hello world",
    };
  });

export default usersEndpoints;
