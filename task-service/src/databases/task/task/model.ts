import mongoose, { Schema } from "mongoose";

export default function () {
  const TaskSchema = new Schema(
    {
      creatorId: Schema.Types.String,
      priorityId: Schema.Types.ObjectId,
      statusId: Schema.Types.ObjectId,
      sizeId: Schema.Types.ObjectId,
      name: Schema.Types.String,
      description: Schema.Types.String,
      progress: Schema.Types.Number,
      startAt: Schema.Types.String,
      endAt: Schema.Types.String,
      createdAt: {
        type: Schema.Types.String,
        default: new Date().toLocaleString(),
      },
      updatedAt: {
        type: Schema.Types.String,
        default: new Date().toLocaleString(),
      },
    },
    { collection: "Task" }
  );
  const TaskModel = mongoose.model("Task", TaskSchema);
  return { model: TaskModel, name: "Task" };
}
