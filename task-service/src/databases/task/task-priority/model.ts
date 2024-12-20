import mongoose, { Schema } from "mongoose";

export default function () {
  const TaskPrioritySchema = new Schema(
    {
      order: Schema.Types.Number,
      name: Schema.Types.String,
      value: Schema.Types.String,
      createdAt: {
        type: Schema.Types.Number,
        default: Date.now(),
      },
      updatedAt: {
        type: Schema.Types.Number,
        default: Date.now(),
      },
    },
    { collection: "TaskPriority" }
  );
  const TaskPriorityModel = mongoose.model("TaskPriority", TaskPrioritySchema);
  return { model: TaskPriorityModel, name: "TaskPriority" };
}
