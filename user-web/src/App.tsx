import React from "react";

// Import routes
import RootRoutes from "./routes/RootRoutes";

// Import states
import { useTaskState } from "./states/task";

function App() {
  const { setTaskStatuses } = useTaskState();

  React.useEffect(() => {
    // Fetch some values
    // In development
    setTaskStatuses([
      {
        _id: "0",
        name: "Not Started",
        value: "not_started",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        _id: "1",
        name: "Considering",
        value: "considering",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        _id: "2",
        name: "Bug",
        value: "bug",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        _id: "3",
        name: "Drop",
        value: "drop",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        _id: "4",
        name: "Done",
        value: "done",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        _id: "5",
        name: "In Process",
        value: "in_process",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]);
  }, []);

  return (
    <>
      <RootRoutes />
    </>
  );
}

export default App;
