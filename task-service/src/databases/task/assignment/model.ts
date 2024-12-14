import mongoose, { Schema } from "mongoose";

export default function () {
  const AssignmentSchema = new Schema(
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
    { collection: "Assignment" }
  );
  const AssignmentModel = mongoose.model("Assignment", AssignmentSchema);
  return { model: AssignmentModel, name: "Assignment" };
}
