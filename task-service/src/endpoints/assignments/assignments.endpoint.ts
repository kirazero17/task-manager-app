// Import classes
import { Endpoints } from "src/classes/Endpoints";

// Import models
import task from "src/databases/task";

// Import services
import { AuthMiddlewares } from "src/services/auth/middlewares";

// Import types
import type { TaskManagerModelsType } from "src/databases/task";

const assignmentsEndpoints = new Endpoints("assignments");
let TaskManagerModels: TaskManagerModelsType = task();
// task().then((models) => {
//   // console.log("TaskEndpoint:", "Connected to MongoDB");
//   TaskManagerModels = models;
// });

// Add your handlers here
assignmentsEndpoints.createHandler("").get((req, res) => {
  return "Hello from assignments root endpoint";
});

/**
 * Update assigment of task (Standalone).
 * Note: can be used by authorized person only.
 */
assignmentsEndpoints
  .createHandler(":id")
  .use(AuthMiddlewares.checkToken)
  .use(
    AuthMiddlewares.createPolicyChecker(
      "task:assignment",
      "user:updateAssignment"
    )
  )
  .patch((req, res) => {
    return {
      users: [],
      text: "Hello world",
    };
  });

export default assignmentsEndpoints;
