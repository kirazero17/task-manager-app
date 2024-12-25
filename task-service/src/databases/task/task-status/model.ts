import mongoose, { Schema } from "mongoose";

let _schema: Schema;

export default function () {
  if (!_schema)
    _schema = new Schema(
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
  const TaskStatusModel = mongoose.model("TaskStatus", _schema);
  return { model: TaskStatusModel, name: "TaskStatus" };
}
