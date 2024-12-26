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

// Import utils
import { RequestUtils } from "src/utils/request";

// Import types
import type { TaskManagerModelsType } from "src/databases/task";

const usersEndpoints = new Endpoints("users");
const IdentityModels = identity();
let TaskManagerModels: TaskManagerModelsType;
task().then((models) => {
  // console.log("TaskEndpoint:", "Connected to MongoDB");
  TaskManagerModels = models;
});

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
    const { limit, skip } = RequestUtils.getLimitNSkip(req);

    const result = await IdentityModels.User.findAll({ limit, offset: skip });
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
    if (!req.params.id) {
      o.code = 400;
      throw new Error("The id of user is required");
    }
    const result = await IdentityModels.User.findOne({
      where: {
        id: req.params.id,
      },
    });

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
    if (!req.params.id) {
      o.code = 400;
      throw new Error("The id of user is required");
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
    if (!req.params.id) {
      o.code = 400;
      throw new Error("The id of user is required");
    }

    if (!req.params.taskId) {
      o.code = 400;
      throw new Error("The id of task is required");
    }

    const result = await TaskManagerModels.Task.findOne({
      _id: req.params.taskId,
      creatorId: req.params.id,
    })
      .populate("assignees")
      .populate("priority", "_id name value order")
      .populate("status", "_id name value order")
      .populate("size", "_id name value order");

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
    if (!req.params.id) {
      o.code = 400;
      throw new Error("The id of user is required");
    }

    const { task, assignees } = req.body;

    // Validate task data
    const taskValidationResult = TaskValidator.validate(task);

    if (taskValidationResult.error) {
      throw new Error(
        `Endpoint - User creates task: ${taskValidationResult.error}`
      );
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

    // Validate assignment data
    const assignmentValidationResult = AssignmentValidator.validate({
      taskId: createTaskResult._id,
      assignees: _assignees,
    });

    if (!assignmentValidationResult.error) {
      throw new Error(
        `Endpoint - User creates assigment: ${assignmentValidationResult.error}`
      );
    }

    // Safe to create new task
    // Create task and assigment
    await TaskManagerModels.Assignment.create(assignmentValidationResult.value);

    // Query task with populated data
    return await TaskManagerModels.Task.findOne({
      _id: createTaskResult._id,
      creatorId: req.params.id,
    })
      .populate("assignees")
      .populate("priority", "_id name value order")
      .populate("status", "_id name value order")
      .populate("size", "_id name value order");
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
    if (!req.params.id) {
      o.code = 400;
      throw new Error("The id of user is required");
    }

    if (!req.params.taskId) {
      o.code = 400;
      throw new Error("The id of task is required");
    }

    const { task, assignees } = req.body;

    if (!task) {
      o.code = 400;
      throw new Error("Task data is required");
    }

    // Validate task data
    const taskValidationResult = UpdatedTaskValidator.validate(task);

    if (taskValidationResult.error) {
      throw new Error(
        `Endpoint - User updates task: ${taskValidationResult.error}`
      );
    }

    // If assignees is provided, validate it
    if (assignees) {
      // Update assignment
      await TaskManagerModels.Assignment.updateOne(
        {
          taskId: req.params.taskId,
        },
        assignees
      );
    }

    // Prepare data
    taskValidationResult.value.creatorId = req.params.id;

    const updateOperation = TaskManagerModels.Task.updateOne(
      { _id: req.params.taskId, creatorId: req.params.id },
      taskValidationResult.value
    );
    await updateOperation.exec();

    // Query task with populated data
    return await TaskManagerModels.Task.findOne({
      _id: req.params.taskId,
      creatorId: req.params.id,
    })
      .populate("assignees")
      .populate("priority", "_id name value order")
      .populate("status", "_id name value order")
      .populate("size", "_id name value order");
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
    if (!req.params.id) {
      o.code = 400;
      throw new Error("The id of user is required");
    }

    if (!req.params.taskId) {
      o.code = 400;
      throw new Error("The id of task is required");
    }

    const taskDeleteOperation = TaskManagerModels.Task.deleteOne({
      _id: req.params.taskId,
      creatorId: req.params.id,
    });
    const assignmentDeleteOperation = TaskManagerModels.Assignment.deleteOne({
      taskId: req.params.taskId,
    });

    // Wait for task and assigment are deleted
    const [taskDeleteResult] = await Promise.all([
      taskDeleteOperation.exec(),
      assignmentDeleteOperation.exec(),
    ]);

    return taskDeleteResult;
  });

export default usersEndpoints;
