import mongoose, { Schema } from "mongoose";

let _schema: Schema;

export default function () {
  if (!_schema)
    _schema = new Schema(
      {
        taskId: Schema.Types.ObjectId,
        assignees: Schema.Types.Array,
        createdAt: {
          type: Schema.Types.Number,
          default: Date.now(),
        },
        updatedAt: {
          type: Schema.Types.Number,
          default: Date.now(),
        },
      },
      { collection: "Assignment" }
    );
  const AssignmentModel = mongoose.model("Assignment", _schema);
  return { model: AssignmentModel, name: "Assignment" };
}
