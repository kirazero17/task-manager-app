import Joi from "joi";

export const TaskValidator = Joi.object({
  creatorId: Joi.string().required(),
  priorityId: Joi.string().required(),
  statusId: Joi.string().required(),
  sizeId: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().empty("").default(""),
  progress: Joi.number().min(0).max(100).default(0),
  startAt: Joi.number().default(Date.now()),
  endAt: Joi.number().default(Date.now()),
  createdAt: Joi.number().default(Date.now()),
  updatedAt: Joi.number().default(Date.now()),
});

export const UpdatedTaskValidator = Joi.object({
  creatorId: Joi.string().required(),
  priorityId: Joi.string().empty(""),
  statusId: Joi.string().empty(""),
  sizeId: Joi.string().empty(""),
  name: Joi.string().empty(""),
  description: Joi.string().empty(""),
  progress: Joi.number().empty(""),
  startAt: Joi.number().empty(""),
  endAt: Joi.number().empty(""),
  createdAt: Joi.number().empty(""),
  updatedAt: Joi.number().default(Date.now()),
});
