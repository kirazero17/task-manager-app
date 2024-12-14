import mongoose, { Schema } from "mongoose";

export default function () {
  const TaskPrioritySchema = new Schema(
    {
      name: Schema.Types.String,
      value: Schema.Types.String,
      createdAt: {
        type: Schema.Types.String,
        default: new Date().toLocaleString(),
      },
      updatedAt: {
        type: Schema.Types.String,
        default: new Date().toLocaleString(),
      },
    },
    { collection: "TaskPriority" }
  );
  const TaskPriorityModel = mongoose.model("TaskPriority", TaskPrioritySchema);
  return { model: TaskPriorityModel, name: "TaskPriority" };
}
