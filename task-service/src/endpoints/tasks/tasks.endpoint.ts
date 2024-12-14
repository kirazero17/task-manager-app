// Import classes
import { Endpoints } from "src/classes/Endpoints";

// Import models
import task from "src/databases/task";

// Import services
import * as middlewares from "src/services/auth/middlewares";

// Import utils
import { RequestUtils } from "src/utils/request";

// Import types
import type { TaskManagerModelsType } from "src/databases/task";

const tasksEndpoints = new Endpoints("tasks");
let TaskManagerModels: TaskManagerModelsType;
task().then((models) => {
  // console.log("TaskEndpoint:", "Connected to MongoDB");
  TaskManagerModels = models;
});

/**
 * Get all of TaskStatus documents.
 * Note: everyone can use this endpoint.
 */
tasksEndpoints.createHandler("statuses").get(async (req, res) => {
  const query = TaskManagerModels.TaskStatus.find();
  const result = await query.exec();
  return result;
});

/**
 * Get all of TaskPriority documents.
 * Note: everyone can use this endpoint.
 */
tasksEndpoints.createHandler("priorities").get(async (req, res) => {
  const query = TaskManagerModels.TaskPriority.find();
  const result = await query.exec();
  return result;
});

/**
 * Get all of TaskSize documents.
 * Note: everyone can use this endpoint.
 */
tasksEndpoints.createHandler("sizes").get(async (req, res) => {
  const query = TaskManagerModels.TaskSize.find();
  const result = await query.exec();
  return result;
});

// Add your handlers here
/**
 * Get tasks.
 * Note: can be used by authorized person only.
 */
tasksEndpoints
  .createHandler("")
  .use(middlewares.AuthMiddlewares.checkToken)
  .use(middlewares.AuthMiddlewares.createCheckPolicy("task:*", "task:getTasks"))
  .get(async (req, res) => {
    const { limit, skip } = RequestUtils.getLimitNSkip(req);

    const query = TaskManagerModels.Task.find().skip(skip).limit(limit);
    const result = await query.exec();

    return result;
  });

/**
 * Get task by id.
 * Note: can be used by authorized person only.
 */
tasksEndpoints
  .createHandler(":id")
  .use(middlewares.AuthMiddlewares.checkToken)
  .use(middlewares.AuthMiddlewares.createCheckPolicy("task:*", "task:getTask"))
  .get(async (req, res, o) => {
    if (!req.params.id) {
      o.code = 400;
      throw new Error("The id of task is required");
    }

    const query = TaskManagerModels.Task.findOne({ id: req.params.id });
    const result = await query.exec();

    return result;
  });

/**
 * Update task by id.
 * Note: can be used by authorized person only.
 */
tasksEndpoints
  .createHandler(":id")
  .use(middlewares.AuthMiddlewares.checkToken)
  .use(
    middlewares.AuthMiddlewares.createCheckPolicy("task:*", "task:updateTask")
  )
  .patch(async (req, res, o) => {
    if (!req.params.id) {
      o.code = 400;
      throw new Error("The id of task is required");
    }

    const newTask = req.body;

    // Validate new task content.
    const validationResult = (await TaskManagerModels.Task.validate(
      newTask
    )) as any;

    if (!validationResult.errors) {
      throw new Error(`Endpoint - Update task: ${validationResult.errors}`);
    }

    const updateOperation = TaskManagerModels.Task.updateOne(
      { id: req.params.id },
      newTask
    );
    const result = await updateOperation.exec();

    return result;
  });

/**
 * Delete task of a user by id.
 * Note: can be used by authorized person only.
 */
tasksEndpoints
  .createHandler(":id")
  .use(middlewares.AuthMiddlewares.checkToken)
  .use(
    middlewares.AuthMiddlewares.createCheckPolicy("task:*", "task:deleteTask")
  )
  .delete(async (req, res, o) => {
    if (!req.params.id) {
      o.code = 400;
      throw new Error("The id of task is required");
    }

    const deleteOperation = TaskManagerModels.Task.deleteOne({
      id: req.params.id,
    });
    const result = await deleteOperation.exec();

    return result;
  });

export default tasksEndpoints;
