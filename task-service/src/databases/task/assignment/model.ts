import mongoose, { Schema } from "mongoose";

export default function () {
  const AssignmentSchema = new Schema(
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
  const AssignmentModel = mongoose.model("Assignment", AssignmentSchema);
  return { model: AssignmentModel, name: "Assignment" };
}
