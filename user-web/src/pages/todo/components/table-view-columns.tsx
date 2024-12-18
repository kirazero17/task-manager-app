import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, PencilLine } from "lucide-react";

// Import components
import {
  TaskSizeBadge,
  TaskPriorityBadge,
  TaskStatusBadge,
} from "./task-attribute-badges";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { Input } from "src/components/ui/input";
import { Calendar } from "src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";

// Import objects
import { TaskUtils } from "src/objects/task/utils";

// Import states
import { useTaskState } from "src/states/task";

// Import types
import type { TaskType } from "src/objects/task/types";

export function DatePicker({ date, setDate }: { date: Date; setDate: any }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <PencilLine className="cursor-pointer" color="gray" size="16px" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export const taskColumns: ColumnDef<TaskType>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const [canEdit, setCanEdit] = React.useState(false);
      const name = row.getValue("name") as any;

      return (
        <div className="flex items-center gap-2 justify-between">
          {canEdit ? (
            <Input
              autoFocus
              className="w-full shadow-none bg-white h-fit p-0"
              type="text"
              defaultValue={name}
            />
          ) : (
            <p>{name}</p>
          )}
          <PencilLine
            onClick={() => setCanEdit((state) => !state)}
            className="cursor-pointer"
            color="gray"
            size="16px"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const [canEdit, setCanEdit] = React.useState(false);
      const description = row.getValue("description") as any;

      return (
        <div className="flex items-center gap-2 justify-between">
          {canEdit ? (
            <Input
              autoFocus
              onSubmit={() => {
                alert("HEHE");
              }}
              className="w-full shadow-none bg-white h-fit p-0"
              type="text"
              defaultValue={description}
            />
          ) : (
            <p>{description}</p>
          )}
          <PencilLine
            onClick={() => setCanEdit((state) => !state)}
            className="cursor-pointer"
            color="gray"
            size="16px"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "startAt",
    header: "Start date",
    cell: ({ row }) => {
      const startAt = row.getValue("startAt") as any;
      const [date, setDate] = React.useState(new Date(startAt));

      return (
        <div className="flex items-center justify-between">
          <p>{new Date(startAt).toLocaleDateString()}</p>
          <DatePicker date={date} setDate={setDate} />
        </div>
      );
    },
  },
  {
    accessorKey: "endAt",
    header: "End date",
    cell: ({ row }) => {
      const endAt = row.getValue("endAt") as any;
      const [date, setDate] = React.useState(new Date(endAt));

      return (
        <div className="flex items-center justify-between">
          <p>{new Date(endAt).toLocaleDateString()}</p>
          <DatePicker date={date} setDate={setDate} />
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const { taskPriorities } = useTaskState();
      const priority = row.getValue("priority") as any;

      return (
        <div className="flex items-center justify-between">
          <TaskPriorityBadge data={priority} />
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
              <ChevronDown size="16px" color="gray" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {taskPriorities?.map((priority) => (
                <DropdownMenuItem className="cursor-pointer" key={priority._id}>
                  <TaskPriorityBadge data={priority} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { taskStatuses } = useTaskState();
      const status = row.getValue("status") as any;

      return (
        <div className="flex items-center justify-between">
          <TaskStatusBadge data={status} />
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
              <ChevronDown size="16px" color="gray" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {taskStatuses?.map((status) => (
                <DropdownMenuItem className="cursor-pointer" key={status._id}>
                  <TaskStatusBadge data={status} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const { taskSizes } = useTaskState();
      const size = row.getValue("size") as any;

      return (
        <div className="flex items-center justify-between">
          <TaskSizeBadge data={size} />
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
              <ChevronDown size="16px" color="gray" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Size</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {taskSizes?.map((size) => (
                <DropdownMenuItem className="cursor-pointer" key={size._id}>
                  <TaskSizeBadge data={size} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
