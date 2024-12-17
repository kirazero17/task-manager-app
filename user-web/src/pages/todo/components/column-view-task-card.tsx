import { GripVertical } from "lucide-react";

// Import objects
import { UserAPI } from "src/objects/user/api";

// Import components
import { Badge } from "src/components/ui/badge";

// Import states
import { useTaskState } from "src/states/task";

// Import types
import type { TaskType } from "src/objects/task/types";
import { TaskUtils } from "src/objects/task/utils";

type TaskCardProps = {
  data: TaskType;
};

export default function ColumnViewTaskCard(props: TaskCardProps) {
  const { isResponding, updateIsResponding, deteteTask, updateTask } =
    useTaskState();

  const handleDeleteTask = function () {
    updateIsResponding(true);
    UserAPI.deleteTask(props.data._id!)
      .then(() => {
        deteteTask(props.data._id!);
        updateIsResponding(false);
      })
      .catch(() => updateIsResponding(false));
  };

  const handleCompleteTask = function () {
    const newTask = props.data;
    newTask.isComplete = 1;
    UserAPI.updateTask(newTask)
      .then((payload) => {
        if (payload) updateTask(props.data);
        updateIsResponding(false);
      })
      .then(() => updateIsResponding(false));
  };

  return (
    <div className="flex cursor-pointer shadow w-full justify-between ps-3 pe-1 py-2 rounded-lg border mb-3">
      <section className="w-4/5">
        <header>
          <h3 className="font-bold">{props.data.name}</h3>
          <p>{props.data.description}</p>
        </header>
        <div>
          <p className="text-xs">{TaskUtils.getStartEndDateStr(props.data)}</p>
        </div>
        <div className="mt-2">
          {props.data.priority && (
            <Badge
              className={TaskUtils.getPriorityBadgeColor(props.data) + " me-2"}
              variant="default"
            >
              {props.data.priority.name}
            </Badge>
          )}
          {props.data.size && (
            <Badge
              className={TaskUtils.getSizeBadgeColor(props.data)}
              variant="outline"
            >
              {props.data.size.name}
            </Badge>
          )}
        </div>
      </section>
      <div className="flex">
        <GripVertical className="cursor-grab" />
      </div>
    </div>
  );
}
