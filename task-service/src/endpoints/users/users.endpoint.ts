// Import classes
import { Endpoints } from "src/classes/Endpoints";

// Import models
import identity from "src/databases/identity";
import task from "src/databases/task";

// Import services
import { AuthMiddlewares } from "src/services/auth/middlewares";

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

    const result = await TaskManagerModels.Task.find({
      id: req.params.id,
      creatorId: req.params.id,
    });

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

    // Validate task data
    const validationResult = (await TaskManagerModels.Task.validate(
      req.body
    )) as any;

    if (!validationResult.errors) {
      throw new Error(
        `Endpoint - User creates task: ${validationResult.errors}`
      );
    }

    // Create task and assigment
    const result = await TaskManagerModels.Task.create(req.body);

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
    if (!req.params.id) {
      o.code = 400;
      throw new Error("The id of user is required");
    }

    if (!req.params.taskId) {
      o.code = 400;
      throw new Error("The id of task is required");
    }

    // Validate task data
    const validationResult = (await TaskManagerModels.Task.validate(
      req.body
    )) as any;

    if (!validationResult.errors) {
      throw new Error(
        `Endpoint - User creates task: ${validationResult.errors}`
      );
    }

    const updateOperation = TaskManagerModels.Task.updateOne(
      { id: req.params.taskId, creatorId: req.params.id },
      req.body
    );
    const result = await updateOperation.exec();

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
    if (!req.params.id) {
      o.code = 400;
      throw new Error("The id of user is required");
    }

    if (!req.params.taskId) {
      o.code = 400;
      throw new Error("The id of task is required");
    }

    const delelteOperation = TaskManagerModels.Task.deleteOne({
      id: req.params.taskId,
      creatorId: req.params.id,
    });
    const result = await delelteOperation.exec();

    return result;
  });

export default usersEndpoints;
