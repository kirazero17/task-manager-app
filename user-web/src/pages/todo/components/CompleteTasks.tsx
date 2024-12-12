import React from "react";

// Import components
import TaskCard from "./TaskCard";
import TaskCardSkeleton from "./TaskCardSkeleton";

// Import objects
import { UserAPI } from "src/objects/user/api";

// Import state
import { useTaskState } from "src/states/task";

export default function CompleteTasks() {
  const { tasks, isResponding, updateIsResponding, setTasks } = useTaskState();
  const completeTasks = tasks
    ? tasks.reduce((_tasks, task) => {
        if (!task.isComplete) return _tasks;
        _tasks.push(<TaskCard key={task.id} data={task} />);
        return _tasks;
      }, [] as any)
    : tasks;

  React.useEffect(() => {
    updateIsResponding(true);
    UserAPI.getTasks().then((payload) => {
      updateIsResponding(false);
      if (payload && payload?.data.length > 0) {
        setTasks(payload.data);
      }
    });
  }, []);

  if (!tasks && isResponding) {
    return (
      <>
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </>
    );
  } else if (!tasks) {
    return <p className="text-center">You haven't done any tasks</p>;
  }

  return (
    <div className="w-full">
      {!completeTasks || completeTasks[0] !== undefined ? (
        completeTasks
      ) : (
        <p className="text-center">You haven't done any tasks</p>
      )}
    </div>
  );
}
