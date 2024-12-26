import mongoose, { Schema } from "mongoose";

let _schema: Schema;

export default function () {
  if (!_schema) {
    _schema = new Schema(
      {
        creatorId: Schema.Types.String,
        priorityId: Schema.Types.ObjectId,
        statusId: Schema.Types.ObjectId,
        sizeId: Schema.Types.ObjectId,
        name: Schema.Types.String,
        description: Schema.Types.String,
        startAt: Schema.Types.Number,
        endAt: Schema.Types.Number,
        createdAt: {
          type: Schema.Types.Number,
          default: Date.now(),
        },
        updatedAt: {
          type: Schema.Types.Number,
          default: Date.now(),
        },
      },
      {
        collection: "Task",
        toJSON: {
          virtuals: true,
          transform: function (doc, ret) {
            // Detele some fields
            delete ret.priorityId;
            delete ret.statusId;
            delete ret.sizeId;
            delete ret.id;

            // Change some fields
            if (ret.assignees && ret.assignees.assignees)
              ret.assignees = ret.assignees.assignees;

            return ret;
          },
        },
      }
    );

    _schema.virtual("assignees", {
      ref: "Assignment",
      localField: "_id",
      foreignField: "taskId",
      justOne: true,
    });
    _schema.virtual("priority", {
      ref: "TaskPriority",
      localField: "priorityId",
      foreignField: "_id",
      justOne: true,
    });
    _schema.virtual("status", {
      ref: "TaskStatus",
      localField: "statusId",
      foreignField: "_id",
      justOne: true,
    });
    _schema.virtual("size", {
      ref: "TaskSize",
      localField: "sizeId",
      foreignField: "_id",
      justOne: true,
    });
  }
  const TaskModel = mongoose.model("Task", _schema);
  return { model: TaskModel, name: "Task" };
}
