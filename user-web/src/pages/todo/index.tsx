import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CircleAlert, Moon } from "lucide-react";
import cn from "classnames";

// Import components
import ColumnView from "./components/column-view";
import TimelineView from "./components/timeline-view";
import TableView from "./components/table-view";
import TaskForm from "./components/task-form";
import { Button } from "src/components/ui/button";
import { Progress } from "src/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";

// Import hooks
import { useAuth } from "src/hooks/use-auth";

// Import states
import { useTaskState } from "src/states/task";

export default function TodoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signout } = useAuth();
  const { clearTasks } = useTaskState();

  return (
    <div className="w-full h-[calc(100dvh-28px)] flex flex-col px-2 py-3">
      <header className="flex justify-between items-center px-3">
        <div className="w-1/4">
          <h1 className="text-lg font-bold">Tasks</h1>
          <div className="flex items-center">
            <Progress value={33} className="w-full h-[6px] me-3" />
            <span className="text-xs">3/10</span>
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
        <Tabs defaultValue="default" className="w-full flex flex-col">
          <TabsList className="w-fit">
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          <TabsContent
            className="overflow-hidden data-[state=active]:flex data-[state=active]:flex-1"
            value="default"
          >
            <ColumnView />
          </TabsContent>
          <TabsContent
            className="data-[state=active]:flex data-[state=active]:flex-1"
            value="timeline"
          >
            <TimelineView />
          </TabsContent>
          <TabsContent
            className="data-[state=active]:flex data-[state=active]:flex-1"
            value="table"
          >
            <TableView />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
