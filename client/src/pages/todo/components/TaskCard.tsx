// Import objects
import { UserAPI } from "src/objects/user/api";

// Import states
import { useTaskState } from "src/states/task";

// Import types
import type { TaskModel } from "src/objects/task/type";

type TaskCardProps = {
  data: TaskModel;
};

export default function TaskCard(props: TaskCardProps) {
  const { isResponding, updateIsResponding, deteteTask, updateTask } =
    useTaskState();

  const handleDeleteTask = function () {
    updateIsResponding(true);
    UserAPI.deleteTask(props.data.id!)
      .then(() => {
        deteteTask(props.data.id!);
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
    <div className="flex w-full justify-between px-3 py-2 rounded-lg border mb-3">
      <section className="w-4/5">
        <header>
          <h3
            className={
              "font-bold" +
              (props.data.isComplete === 1 ? " text-gray-500 line-through" : "")
            }
          >
            {props.data.name}
          </h3>
        </header>
        <div>
          <p
            className={
              "font-base" +
              (props.data.isComplete === 1 ? " text-gray-500 line-through" : "")
            }
          >
            {props.data.description}
          </p>
        </div>
      </section>
      <div className="flex items-center justify-around bg-slate-200 px-2 rounded-lg">
        {!props.data.isComplete && (
          <button
            type="button"
            onClick={() => handleCompleteTask()}
            disabled={isResponding}
            className="px-3 py-2 me-2 text-xs font-medium text-center inline-flex items-center bg-white rounded-lg hover:bg-green-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300"
          >
            Done
          </button>
        )}
        <button
          type="button"
          onClick={() => handleDeleteTask()}
          disabled={isResponding}
          className="px-3 py-2 text-xs font-medium text-center inline-flex items-center rounded-lg hover:bg-red-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
