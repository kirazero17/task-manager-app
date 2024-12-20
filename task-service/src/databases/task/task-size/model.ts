import mongoose, { Schema } from "mongoose";

export default function () {
  const TaskSizeSchema = new Schema(
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
    { collection: "TaskSize" }
  );
  const TaskSizeModel = mongoose.model("TaskSize", TaskSizeSchema);
  return { model: TaskSizeModel, name: "TaskSize" };
}
