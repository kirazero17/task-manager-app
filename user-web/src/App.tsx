import React from "react";

// Import routes
import RootRoutes from "./routes/RootRoutes";

// Import objects
import { TaskAPI } from "./objects/task/api";

// Import states
import { useTaskState } from "./states/task";

function App() {
  const { setTaskPriorities, setTaskSizes, setTaskStatuses } = useTaskState();

  React.useEffect(() => {
    // Fetch some values
    if (import.meta.env.VITE_MODE === "dev") {
      // In development
      // Fetch data from mock data
      import("src/mock-data/statuses.json").then((result) => {
        setTaskStatuses(result.default);
      });

      import("src/mock-data/sizes.json").then((result) => {
        setTaskSizes(result.default);
      });

      import("src/mock-data/priorities.json").then((result) => {
        setTaskPriorities(result.default);
      });
    } else if (import.meta.env.VITE_MODE === "prod") {
      // In production
      // Fetch data from server
      Promise.all([
        TaskAPI.getTasksStatuses(),
        TaskAPI.getTasksSizes(),
        TaskAPI.getTasksPriorities(),
      ]).then(([statuses, sizes, priorities]) => {
        setTaskStatuses(statuses?.data);
        setTaskSizes(sizes?.data);
        setTaskPriorities(priorities?.data);
      });
    }
  }, []);

  return (
    <>
      <RootRoutes />
    </>
  );
}

export default App;
