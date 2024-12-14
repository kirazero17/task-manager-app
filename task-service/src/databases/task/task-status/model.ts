import mongoose, { Schema } from "mongoose";

export default function () {
  const TaskStatusSchema = new Schema(
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
    { collection: "TaskStatus" }
  );
  const TaskStatusModel = mongoose.model("TaskStatus", TaskStatusSchema);
  return { model: TaskStatusModel, name: "TaskStatus" };
}
