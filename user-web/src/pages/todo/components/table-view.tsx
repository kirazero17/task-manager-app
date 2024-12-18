import { Ellipsis } from "lucide-react";

// Import objects
import { TaskUtils } from "src/objects/task/utils";

// Import components
import ColumnViewTaskCard from "./board-view-task-card";
import AddItem from "./add-item";
import { Button } from "src/components/ui/button";
import { TableViewDataTable } from "./table-view-datatable";
import { taskColumns } from "./table-view-columns";

// Import states
import { useTaskState } from "src/states/task";

export default function TableView() {
  const { tasks } = useTaskState();

  return (
    <div className="w-full flex flex-1 border bg-secondary rounded-lg overflow-auto">
      {tasks === null ? (
        <p>Loading...</p>
      ) : (
        <TableViewDataTable columns={taskColumns} data={tasks} />
      )}
    </div>
  );
}
