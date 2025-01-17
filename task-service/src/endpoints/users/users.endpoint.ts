// Import classes
import { Endpoints } from "src/classes/Endpoints";

// Import models
import identity from "src/databases/identity";
import task from "src/databases/task";

// Import services
import { AuthMiddlewares } from "src/services/auth/middlewares";
import {
  TaskValidator,
  UpdatedTaskValidator,
} from "src/services/validators/task";
import { AssignmentValidator } from "src/services/validators/assignment";

// Import logger builder
import { LoggerBuilder } from "src/logger";

// Import utils
import { RequestUtils } from "src/utils/request";

// Import types
import type { TaskManagerModelsType } from "src/databases/task";

const usersEndpoints = new Endpoints("users");
const logger = new LoggerBuilder().to("users-endpoints").build();
const IdentityModels = identity();
let TaskManagerModels: TaskManagerModelsType = task();
// task().then((models) => {
//   // console.log("TaskEndpoint:", "Connected to MongoDB");
//   TaskManagerModels = models;
// });

// Add your handlers here
/**
 * Get information of users
 * Note: can be used by authorized person only.
 */
usersEndpoints
  .createHandler("")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createPolicyChecker("admin:*", "admin:getUsers"))
  .get(async (req, res, o) => {
    const profiler = logger.startTimer();
    // Start log
    profiler.logger.info(
      LoggerBuilder.buildEndpointLog(`Request users from admin`, req)
    );

    const { limit, skip } = RequestUtils.getLimitNSkip(req);

    const result = await IdentityModels.User.findAll({ limit, offset: skip });

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
 * Get information of a user by id.
 * Note: can be used by authorized person only.
 */
usersEndpoints
  .createHandler(":id")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createPolicyChecker("user:*", "user:getInformation"))
  .get(async (req, res, o) => {
    const profiler = logger.startTimer();
    // Start log
    profiler.logger.info(
      LoggerBuilder.buildEndpointLog(`Request user information from user`, req)
    );

    if (!req.params.id) {
      const message = "The id of user is required";
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }
    const result = await IdentityModels.User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!result) {
      const message = `Cannot find user with id ${req.params.id}`;
      o.code = 404;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    return result;
  });

/**
 * Get tasks of a user.
 * Note: can be used by authorized person only.
 */
usersEndpoints
  .createHandler(":id/tasks")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createPolicyChecker("user:*", "user:getTasks"))
  .get(async (req, res, o) => {
    const profiler = logger.startTimer();
    // Start log
    profiler.logger.info(
      LoggerBuilder.buildEndpointLog(`Request tasks from user`, req)
    );

    if (!req.params.id) {
      const message = "The id of user is required";
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    const { limit, skip } = RequestUtils.getLimitNSkip(req);

    const result = await TaskManagerModels.Task.find({
      creatorId: req.params.id,
    })
      .populate("assignees")
      .populate("priority", "_id name value order")
      .populate("status", "_id name value order")
      .populate("size", "_id name value order")
      .skip(skip)
      .limit(limit);

    // Done
    profiler.done(
      LoggerBuilder.buildEndpointLog(
        `Get tasks from ${skip} to ${skip + limit} of user with id ${
          req.params.id
        } successfully`,
        req
      )
    );

    return result;
  });

/**
 * Get a task by id of a user.
 * Note: can be used by authorized person only.
 */
usersEndpoints
  .createHandler(":id/tasks/:taskId")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createPolicyChecker("user:*", "user:getTask"))
  .get(async (req, res, o) => {
    const profiler = logger.startTimer();
    // Start log
    profiler.logger.info(
      LoggerBuilder.buildEndpointLog(`Request details of task from user`, req)
    );

    if (!req.params.id) {
      const message = "The id of user is required";
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    if (!req.params.taskId) {
      const message = "The id of task is required";
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    const result = await TaskManagerModels.Task.findOne({
      _id: req.params.taskId,
      creatorId: req.params.id,
    })
      .populate("assignees")
      .populate("priority", "_id name value order")
      .populate("status", "_id name value order")
      .populate("size", "_id name value order");

    if (!result) {
      const message = `Cannot find details of task with id ${req.params.taskId} of user ${req.params.id}`;
      o.code = 404;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    // Done
    profiler.done(
      LoggerBuilder.buildEndpointLog(
        `Get details of task with id ${req.params.taskId} of user ${req.params.id} successfully`,
        req
      )
    );

    return result;
  });

/**
 * Create a task for a user.
 * Note: can be used by authorized person only.
 */
usersEndpoints
  .createHandler("/:id/task")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createPolicyChecker("user:*", "user:addTask"))
  .post(async (req, res, o) => {
    const profiler = logger.startTimer();
    // Start log
    profiler.logger.info(
      LoggerBuilder.buildEndpointLog(`Request create new task from user`, req)
    );

    if (!req.params.id) {
      const message = "The id of user is required";
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    const { task, assignees } = req.body;

    // Validate task data
    const taskValidationResult = TaskValidator.validate(task);

    if (taskValidationResult.error) {
      o.code = 400;
      profiler.done(
        LoggerBuilder.buildEndpointLog(taskValidationResult.error.message, req)
      );
      throw new Error(taskValidationResult.error.message);
    }

    // Validate assignment data
    const _assignees = [req.params.id];

    if (Array.isArray(assignees) && assignees.length > 0) {
      _assignees.concat(assignees);
    }

    // Insert task
    // Prepare data
    taskValidationResult.value.creatorId = req.params.id;
    const createTaskResult = await TaskManagerModels.Task.create(
      taskValidationResult.value
    );

    // Error when create
    if (createTaskResult.errors) {
      o.code = 400;
      profiler.done(
        LoggerBuilder.buildEndpointLog(createTaskResult.errors?.message, req)
      );
      throw new Error(createTaskResult.errors?.message);
    }

    // Validate assignment data
    const assignmentValidationResult = AssignmentValidator.validate({
      taskId: createTaskResult._id,
      assignees: _assignees,
    });

    // Error when validate assignment
    if (assignmentValidationResult.error) {
      o.code = 400;
      profiler.done(
        LoggerBuilder.buildEndpointLog(
          assignmentValidationResult.error.message,
          req
        )
      );
      throw new Error(assignmentValidationResult.error.message);
    }

    // Safe to create new task
    // Create task and assigment
    const createAssignmentResult = await TaskManagerModels.Assignment.create(
      assignmentValidationResult.value
    );

    // Error when create
    if (createAssignmentResult.errors) {
      o.code = 400;
      profiler.done(
        LoggerBuilder.buildEndpointLog(
          createAssignmentResult.errors?.message,
          req
        )
      );
      throw new Error(createAssignmentResult.errors?.message);
    }

    // Query task with populated data
    const result = await TaskManagerModels.Task.findOne({
      _id: createTaskResult._id,
      creatorId: req.params.id,
    })
      .populate("assignees")
      .populate("priority", "_id name value order")
      .populate("status", "_id name value order")
      .populate("size", "_id name value order");

    // Done
    profiler.done(
      LoggerBuilder.buildEndpointLog(
        `Create new task with id ${req.params.taskId} of user ${req.params.id} successfully`,
        req
      )
    );

    return result;
  });

/**
 * Update a task of a user.
 * Note: can be used by authorized person only.
 */
usersEndpoints
  .createHandler(":id/tasks/:taskId")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createPolicyChecker("user:*", "user:updateTask"))
  .patch(async (req, res, o) => {
    const profiler = logger.startTimer();
    // Start log
    profiler.logger.info(
      LoggerBuilder.buildEndpointLog(`Request details of task from user`, req)
    );

    if (!req.params.id) {
      const message = "The id of user is required";
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    if (!req.params.taskId) {
      const message = "The id of task is required";
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    const { task, assignees } = req.body;

    if (!task) {
      const message = "Task data is required";
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    // Validate task data
    const taskValidationResult = UpdatedTaskValidator.validate(task);

    if (taskValidationResult.error) {
      o.code = 400;
      profiler.done(
        LoggerBuilder.buildEndpointLog(taskValidationResult.error.message, req)
      );
      throw new Error(taskValidationResult.error.message);
    }

    // If assignees is provided, validate it
    if (assignees) {
      // Update assignment
      const updateAssignmentResult =
        await TaskManagerModels.Assignment.updateOne(
          {
            taskId: req.params.taskId,
          },
          assignees
        );

      if (updateAssignmentResult.modifiedCount === 0) {
        const message = "Cannot update assignment of task";
        o.code = 400;
        profiler.done(LoggerBuilder.buildEndpointLog(message, req));
        throw new Error(message);
      }
    }

    // Prepare data
    taskValidationResult.value.creatorId = req.params.id;

    const updateOperation = TaskManagerModels.Task.updateOne(
      { _id: req.params.taskId, creatorId: req.params.id },
      taskValidationResult.value
    );
    const updateResult = await updateOperation.exec();

    if (updateResult.modifiedCount === 0) {
      const message = `Cannot update task with id ${req.params.taskId} of user ${req.params.id}`;
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    // Query task with populated data
    const result = await TaskManagerModels.Task.findOne({
      _id: req.params.taskId,
      creatorId: req.params.id,
    })
      .populate("assignees")
      .populate("priority", "_id name value order")
      .populate("status", "_id name value order")
      .populate("size", "_id name value order");

    // Done
    profiler.done(
      LoggerBuilder.buildEndpointLog(
        `Update details of task with id ${req.params.taskId} of user ${req.params.id} successfully`,
        req
      )
    );

    return result;
  });

/**
 * Delete a task of a user.
 * Note: can be used by authorized person only.
 */
usersEndpoints
  .createHandler(":id/tasks/:taskId")
  .use(AuthMiddlewares.checkToken)
  .use(AuthMiddlewares.createPolicyChecker("user:*", "user:deleteTask"))
  .delete(async (req, res, o) => {
    const profiler = logger.startTimer();
    // Start log
    profiler.logger.info(
      LoggerBuilder.buildEndpointLog(`Request details of task from user`, req)
    );

    if (!req.params.id) {
      const message = "The id of user is required";
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    if (!req.params.taskId) {
      const message = "The id of task is required";
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    const taskDeleteOperation = TaskManagerModels.Task.deleteOne({
      _id: req.params.taskId,
      creatorId: req.params.id,
    });
    const assignmentDeleteOperation = TaskManagerModels.Assignment.deleteOne({
      taskId: req.params.taskId,
    });

    // Wait for task and assigment are deleted
    const [taskDeleteResult, assignmentDeleteResult] = await Promise.all([
      taskDeleteOperation.exec(),
      assignmentDeleteOperation.exec(),
    ]);

    // Done
    profiler.done(
      LoggerBuilder.buildEndpointLog(
        `Update details of task with id ${req.params.taskId} of user ${req.params.id} successfully`,
        req
      )
    );

    if (assignmentDeleteResult.deletedCount === 0) {
      const message = `Cannot delete assignment of task ${req.params.taskId}`;
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    if (taskDeleteResult.deletedCount === 0) {
      const message = `Cannot delete task with id ${req.params.taskId} of user ${req.params.id}`;
      o.code = 400;
      profiler.done(LoggerBuilder.buildEndpointLog(message, req));
      throw new Error(message);
    }

    return taskDeleteResult;
  });

export default usersEndpoints;
