// Import objects
import { TaskUtils } from "src/objects/task/utils";

// Import states
import { useTaskState } from "src/states/task";

export default function ColumnView() {
  const { taskStatuses } = useTaskState();

  return (
    <div className="w-full flex flex-1 gap-3 border px-3 py-2 bg-secondary rounded-lg">
      <div className="overflow-hidden">
        <div className="flex flex-row h-full overflow-x-auto">
          {taskStatuses === null ? (
            <p>Loading...</p>
          ) : (
            taskStatuses.map((taskStatus) => {
              let statusCircleClassName =
                "w-5 h-5 rounded-full border border-[3px]";
              let statusCircleColor =
                TaskUtils.getStatusCircleColor(taskStatus);

              if (statusCircleColor)
                statusCircleClassName += " " + statusCircleColor;

              return (
                <div className="flex flex-col bg-white rounded-lg border w-[420px] min-w-[420px] h-full me-3 px-3 pt-5 pb-3">
                  <header className="flex flex-col">
                    <div className="flex items-center">
                      <div className={statusCircleClassName}></div>
                      <h3 className="ms-2 font-semibold">{taskStatus.name}</h3>
                    </div>
                    <p className="mt-3">Description here</p>
                  </header>
                  <div></div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
