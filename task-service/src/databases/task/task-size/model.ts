import mongoose, { Schema, Model } from "mongoose";

export default function () {
  const TaskSizeSchema = new Schema(
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
    { collection: "TaskSize" }
  );
  const TaskSizeModel = mongoose.model("TaskSize", TaskSizeSchema);
  return { model: TaskSizeModel, name: "TaskSize" };
}
