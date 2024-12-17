import { Ellipsis } from "lucide-react";

// Import objects
import { TaskUtils } from "src/objects/task/utils";

// Import components
import ColumnViewTaskCard from "./column-view-task-card";
import AddItem from "./add-item";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";

// Import states
import { useTaskState } from "src/states/task";

export default function ColumnView() {
  const { tasks, taskStatuses } = useTaskState();

  return (
    <div className="relative w-full flex flex-1 border px-3 py-2 bg-secondary rounded-lg  overflow-x-auto">
      <div className="flex flex-1">
        {taskStatuses === null || !Array.isArray(taskStatuses) ? (
          <p>Loading...</p>
        ) : (
          taskStatuses.map((taskStatus) => {
            let statusCircleClassName =
              "w-5 h-5 rounded-full border border-[3px]";
            let statusCircleColor = TaskUtils.getStatusCircleColor(taskStatus);

            if (statusCircleColor)
              statusCircleClassName += " " + statusCircleColor;

            return (
              <div
                key={taskStatus._id}
                className="flex flex-col bg-white rounded-lg border w-[420px] min-w-[420px] h-full me-3 px-3 pt-5 pb-3 overflow-y-hidden"
              >
                <header className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={statusCircleClassName}></div>
                      <h3 className="ms-2 font-semibold">{taskStatus.name}</h3>
                    </div>
                    <Button variant="outline" size="icon">
                      <Ellipsis />
                    </Button>
                  </div>
                  <p className="mt-3">Description here</p>
                </header>
                <hr className="my-3" />
                <div className="flex flex-1 flex-col overflow-y-auto">
                  {tasks === null || !Array.isArray(tasks) ? (
                    <p>Loading...</p>
                  ) : (
                    tasks.map((task) => {
                      if (task.status.value !== taskStatus.value) return;
                      return <ColumnViewTaskCard key={task._id} data={task} />;
                    })
                  )}
                </div>
                <AddItem />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
