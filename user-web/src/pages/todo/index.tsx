import { CircleAlert, Moon } from "lucide-react";

// Import components
import BoardView from "./components/board-view";
import TableView from "./components/table-view";
import { Button } from "src/components/ui/button";
import { Progress } from "src/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import { Input } from "src/components/ui/input";

// Import states
import { useTaskState } from "src/states/task";

export default function TodoPage() {
  const { tasks, tasksByStatus } = useTaskState();

  const completeTasks = tasksByStatus ? tasksByStatus.get("done") : null;
  let totalTask = tasks ? tasks.length : 0;
  let totalCompleteTask = completeTasks ? completeTasks.length : 0;

  return (
    <div className="w-full h-[calc(100dvh-28px)] flex flex-col px-2 py-3">
      <header className="flex justify-between items-center px-3">
        <div className="w-1/4">
          <h1 className="text-lg font-bold">Tasks</h1>
          <div className="flex items-center">
            <Progress
              value={totalCompleteTask}
              className="w-full h-[6px] me-3"
            />
            <span className="text-xs">
              {totalCompleteTask}/{totalTask}
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2 w-3/4">
          <Button variant="outline">
            <CircleAlert />
            Report
          </Button>
          <Button variant="outline" size="icon">
            <Moon />
          </Button>
        </div>
      </header>

      <hr className="my-3" />
      <section className="flex flex-1 overflow-hidden">
        <Tabs defaultValue="board" className="w-full flex flex-col">
          <div className="flex justify-between items-center">
            <TabsList className="w-fit">
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
            <div className="flex w-full max-w-sm items-center space-x-2 py-1">
              <Input className="w-full" type="text" placeholder="Filter:" />
              <div className="flex items-center">
                <Button className="me-2" variant="outline" type="submit">
                  Clear
                </Button>
                <Button variant="default" type="submit">
                  Save
                </Button>
              </div>
            </div>
          </div>
          <TabsContent
            className="overflow-hidden data-[state=active]:flex data-[state=active]:flex-1"
            value="board"
          >
            <BoardView />
          </TabsContent>
          <TabsContent
            className="overflow-auto data-[state=active]:flex data-[state=active]:flex-1"
            value="table"
          >
            <TableView />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
