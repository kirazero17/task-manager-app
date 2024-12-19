import React from "react";
import { Ellipsis } from "lucide-react";

// Import components
import { TaskSizeBadge, TaskPriorityBadge } from "./task-attribute-badges";
import { DialogTrigger } from "src/components/ui/dialog";

// Import hooks
import { useTaskState } from "src/states/task";

// Import types
import type { TaskType } from "src/objects/task/types";
import { TaskUtils } from "src/objects/task/utils";

type TaskCardProps = {
  data: TaskType;
};

export default function BoardViewTaskCard(props: TaskCardProps) {
  const { setCurrentTask } = useTaskState();

  return (
    <div
      draggable
      className="flex cursor-grab shadow w-full justify-between ps-3 pe-1 py-2 rounded-lg border mb-3"
    >
      <section className="w-4/5">
        <DialogTrigger onClick={() => setCurrentTask(props.data)}>
          <header className="cursor-pointer text-left hover:underline">
            <h3 className="font-bold">{props.data.name}</h3>
            <p>{props.data.description}</p>
          </header>
        </DialogTrigger>
        <div>
          <p className="text-xs">{TaskUtils.getStartEndDateStr(props.data)}</p>
        </div>
        <div className="mt-2">
          {props.data.priority && (
            <TaskPriorityBadge className="me-2" data={props.data.priority} />
          )}
          {props.data.size && <TaskSizeBadge data={props.data.size} />}
        </div>
      </section>
      <div className="flex">
        <Ellipsis className="cursor-pointer" />
      </div>
    </div>
  );
}
