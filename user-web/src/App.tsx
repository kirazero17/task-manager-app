import React from "react";

// Import routes
import RootRoutes from "./routes/RootRoutes";

// Import states
import { useTaskState } from "./states/task";

function App() {
  const { setTasks, setTaskPriorities, setTaskSizes, setTaskStatuses } =
    useTaskState();

  React.useEffect(() => {
    // Fetch some values
    // In development
    import("src/mock-data/statuses.json").then((result) => {
      setTaskStatuses(result.default);
    });

    import("src/mock-data/sizes.json").then((result) => {
      setTaskSizes(result.default);
    });

    import("src/mock-data/priorities.json").then((result) => {
      setTaskPriorities(result.default);
    });

    import("src/mock-data/tasks.json").then((result) => {
      setTasks(result.default);
    });
  }, []);

  return (
    <>
      <RootRoutes />
    </>
  );
}

export default App;
