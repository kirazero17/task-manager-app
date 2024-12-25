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
      { collection: "TaskPriority" }
    );
  const TaskPriorityModel = mongoose.model("TaskPriority", _schema);
  return { model: TaskPriorityModel, name: "TaskPriority" };
}
