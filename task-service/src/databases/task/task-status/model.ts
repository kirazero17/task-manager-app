import mongoose, { Schema } from "mongoose";

export default function () {
  const TaskStatusSchema = new Schema(
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
    { collection: "TaskStatus" }
  );
  const TaskStatusModel = mongoose.model("TaskStatus", TaskStatusSchema);
  return { model: TaskStatusModel, name: "TaskStatus" };
}
