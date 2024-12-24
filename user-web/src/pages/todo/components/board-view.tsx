import React from "react";
import { Ellipsis, Plus } from "lucide-react";

// Import objects
import { UserAPI } from "src/objects/user/api";
import { TaskUtils } from "src/objects/task/utils";

// Import components
import TaskFormDialog from "./task-form-dialog";
import BoardViewTaskCard from "./board-view-task-card";
import { Button } from "src/components/ui/button";
import { DialogTrigger } from "src/components/ui/dialog";

// Import states
import { useTaskState } from "src/states/task";

// Import mockdata
import TaskStatuses from "src/mock-data/statuses.json";

function addOutlineClassName(elements: any, statusName: string) {
  let element = elements.get(statusName);
  if (element) {
    element.classList.add(
      "shadow-[0_0_0_2px_hsl(var(--primary))]",
      "border-primary"
    );
  }
}

function removeOutlineClassName(elements: any, statusName: string) {
  let element = elements.get(statusName);
  if (element) {
    element.classList.remove(
      "shadow-[0_0_0_2px_hsl(var(--primary))]",
      "border-primary"
    );
  }
}

/**
 * Render board view for tasks
 * @returns
 */
export default function BoardView() {
  const {
    tasks: globalTask,
    tasksByStatus,
    taskStatuses,
    setCurrentTask,
    updateTask,
  } = useTaskState();
  const columnRefs = React.useRef<Map<string, HTMLDivElement | null>>(
    new Map()
  );

  return (
    <div className="relative w-full flex flex-1 border p-2 bg-secondary rounded-lg overflow-x-auto">
      <TaskFormDialog />
      <div className="flex flex-1">
        {tasksByStatus === null ? (
          <p>Loading...</p>
        ) : (
          tasksByStatus
            .entries()
            .toArray()
            .map((taskByStatus) => {
              const [statusValue, tasks] = taskByStatus;
              const status = TaskUtils.getTaskAttributeByValue(
                taskStatuses,
                statusValue
              );

              let statusCircleClassName =
                "w-5 h-5 rounded-full border border-[3px]";
              let statusCircleColor = TaskUtils.getStatusColor(status);

              if (statusCircleColor)
                statusCircleClassName += " " + statusCircleColor;

              return (
                <div
                  ref={(ref) => columnRefs.current.set(status.name, ref)}
                  key={status.value}
                  onDrop={(e) => {
                    const taskId = e.dataTransfer.getData("taskId");

                    // Send a request to update task
                    const newTask = {
                      ...globalTask?.find((task) => task._id === taskId),
                    };
                    const newStatus = TaskStatuses.find(
                      (s) => s.name === status.name
                    );

                    (newTask as any).status = newStatus;

                    // Update state: move task to order group
                    UserAPI.updateTask(newTask._id!, newTask as any);

                    // Un-highlight column
                    removeOutlineClassName(columnRefs.current, status.name);
                  }}
                  onDragOver={(e) => {
                    // Allow drop
                    e.preventDefault();

                    // Highlight column
                    addOutlineClassName(columnRefs.current, status.name);
                  }}
                  onDragLeave={(e) => {
                    // Un-highlight column
                    removeOutlineClassName(columnRefs.current, status.name);
                  }}
                  className="flex flex-col bg-white rounded-lg border w-[420px] min-w-[420px] h-full me-3 pt-5 pb-3 overflow-y-hidden"
                >
                  <header className="flex flex-col px-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={statusCircleClassName}></div>
                        <h3 className="ms-2 font-semibold">{status.name}</h3>
                      </div>
                      <Button variant="outline" size="icon">
                        <Ellipsis />
                      </Button>
                    </div>
                    <p className="mt-3">Description here</p>
                  </header>
                  <hr className="my-3" />
                  <div className="flex flex-1 flex-col pt-1 px-3 items-center overflow-y-auto">
                    {tasks === null || !Array.isArray(tasks) ? (
                      <p>Loading...</p>
                    ) : (
                      tasks.map((task) => {
                        return <BoardViewTaskCard key={task._id} data={task} />;
                      })
                    )}
                  </div>
                  <DialogTrigger className="w-full px-3">
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => setCurrentTask(null)}
                    >
                      <Plus /> Add new item
                    </Button>
                  </DialogTrigger>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
