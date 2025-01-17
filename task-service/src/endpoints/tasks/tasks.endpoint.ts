// Import classes
import { Endpoints } from "src/classes/Endpoints";

// Import models
import task from "src/databases/task";

// Import services
import { AuthMiddlewares } from "src/services/auth/middlewares";

// Import logger builder
import { LoggerBuilder } from "src/logger";

// Import utils
import { RequestUtils } from "src/utils/request";

// Import types
import type { TaskManagerModelsType } from "src/databases/task";

const tasksEndpoints = new Endpoints("tasks");
const logger = new LoggerBuilder().to("tasks-endpoints").build();
let TaskManagerModels: TaskManagerModelsType = task();
// task().then((models) => {
//   // console.log("TaskEndpoint:", "Connected to MongoDB");
//   TaskManagerModels = models;
// });

/**
 * Get all of TaskStatus documents.
 * Note: everyone can use this endpoint.
 */
tasksEndpoints.createHandler("statuses").get(async (req, res) => {
  const profiler = logger.startTimer();
  // Start log
  profiler.logger.info(
    LoggerBuilder.buildEndpointLog("Request task statuses", req)
  );

  const query = TaskManagerModels.TaskStatus.find();
  const result = await query.exec();

  // Done
  profiler.done(
    LoggerBuilder.buildEndpointLog("Get task statuses successfully", req)
  );

  return result;
});

/**
 * Get all of TaskPriority documents.
 * Note: everyone can use this endpoint.
 */
tasksEndpoints.createHandler("priorities").get(async (req, res) => {
  const profiler = logger.startTimer();
  // Start log
  profiler.logger.info(
    LoggerBuilder.buildEndpointLog("Request task priorities", req)
  );

  const query = TaskManagerModels.TaskPriority.find();
  const result = await query.exec();

  // Done
  profiler.done(
    LoggerBuilder.buildEndpointLog("Get task priorities successfully", req)
  );

  return result;
});

/**
 * Get all of TaskSize documents.
 * Note: everyone can use this endpoint.
 */
tasksEndpoints.createHandler("sizes").get(async (req, res) => {
  const profiler = logger.startTimer();
  // Start log
  profiler.logger.info(
    LoggerBuilder.buildEndpointLog("Request task sizes", req)
  );

  const query = TaskManagerModels.TaskSize.find();
  const result = await query.exec();

  // Done
  profiler.done(
    LoggerBuilder.buildEndpointLog("Get task sizes successfully", req)
  );

  return result;
});

// Add your handlers here
/**
 * Get tasks.
 * Note: can be used by authorized person only.
 */
tasksEndpoints
  .createHandler("")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createPolicyChecker("task:*", "admin:getTasks"))
  .get(async (req, res) => {
    const profiler = logger.startTimer();
    // Start log
    profiler.logger.info(
      LoggerBuilder.buildEndpointLog("Request tasks from admin", req)
    );

    const { limit, skip } = RequestUtils.getLimitNSkip(req);

    const query = TaskManagerModels.Task.find().skip(skip).limit(limit);
    const result = await query.exec();

    // Done
    profiler.done(
      LoggerBuilder.buildEndpointLog(
        `Get tasks from ${skip} to ${skip + limit} successfully`,
        req
      )
    );

    return result;
  });

/**
 * Get task by id.
 * Note: can be used by authorized person only.
 */
tasksEndpoints
  .createHandler(":id")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createPolicyChecker("task:*", "admin:getTask"))
  .get(async (req, res, o) => {
    const profiler = logger.startTimer();
    // Start log
    profiler.logger.info(
      LoggerBuilder.buildEndpointLog("Request task by id from admin", req)
    );

    if (!req.params.id) {
      const message = "The id of task is required";
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    const result = await TaskManagerModels.Task.findOne({
      _id: req.params.id,
    })
      .populate("assignees")
      .populate("priority", "_id name value order")
      .populate("status", "_id name value order")
      .populate("size", "_id name value order");

    if (!result) {
      const message = `The task with id ${req.params.id} is not found`;
      o.code = 404;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    // Done
    profiler.done(
      LoggerBuilder.buildEndpointLog(
        `Get details of task ${req.params.id} successfully`,
        req
      )
    );

    return result;
  });

/**
 * Update task by id.
 * Note: can be used by authorized person only.
 */
tasksEndpoints
  .createHandler(":id")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createPolicyChecker("task:*", "admin:updateTask"))
  .patch(async (req, res, o) => {
    const profiler = logger.startTimer();
    // Start log
    profiler.logger.info(
      LoggerBuilder.buildEndpointLog("Request to update task from admin", req)
    );

    if (!req.params.id) {
      const message = "The id of task is required";
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    const newTask = req.body;

    // Validate new task content.
    const validationResult = (await TaskManagerModels.Task.validate(
      newTask
    )) as any;

    if (!validationResult.errors) {
      o.code = 400;
      profiler.done(
        LoggerBuilder.buildEndpointLog(validationResult.errors, req)
      );
      throw new Error(validationResult.errors);
    }

    const updateOperation = TaskManagerModels.Task.updateOne(
      { id: req.params.id },
      newTask
    );
    const result = await updateOperation.exec();

    if (result.modifiedCount === 0) {
      const message = `Cannot update details of task ${req.params.id}`;
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    // Done
    profiler.done(
      LoggerBuilder.buildEndpointLog(
        `Update details of task ${req.params.id} successfully`,
        req
      )
    );

    return result;
  });

/**
 * Delete task of a user by id.
 * Note: can be used by authorized person only.
 */
tasksEndpoints
  .createHandler(":id")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createPolicyChecker("task:*", "admin:deleteTask"))
  .delete(async (req, res, o) => {
    const profiler = logger.startTimer();
    // Start log
    profiler.logger.info(
      LoggerBuilder.buildEndpointLog("Request to delete task from admin", req)
    );

    if (!req.params.id) {
      const message = "The id of task is required";
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    const deleteOperation = TaskManagerModels.Task.deleteOne({
      id: req.params.id,
    });
    const result = await deleteOperation.exec();

    if (result.deletedCount === 0) {
      const message = `Cannot delete task ${req.params.id}`;
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    // Done
    profiler.done(
      LoggerBuilder.buildEndpointLog(
        `Delete task ${req.params.id} successfully`,
        req
      )
    );

    return result;
  });

export default tasksEndpoints;
