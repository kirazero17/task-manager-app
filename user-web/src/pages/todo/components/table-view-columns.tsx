import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { PencilLine } from "lucide-react";

// Import components
import { DatePicker } from "src/components/date-picker";
import {
  TaskSizeBadge,
  TaskPriorityBadge,
  TaskStatusBadge,
} from "./task-attribute-badges";
import {
  TaskPriorityDropdownMenu,
  TaskSizeDropdownMenu,
  TaskStatusDropdownMenu,
} from "./task-attributes-select-list";
import { Input } from "src/components/ui/input";

// Import types
import type { TaskType } from "src/objects/task/types";

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
          <DatePicker
            TriggerContent={
              <PencilLine className="cursor-pointer" color="gray" size="16px" />
            }
            date={date}
            setDate={setDate}
          />
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
          <DatePicker
            TriggerContent={
              <PencilLine className="cursor-pointer" color="gray" size="16px" />
            }
            date={date}
            setDate={setDate}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as any;

      return (
        <div className="flex items-center justify-between">
          <TaskPriorityBadge data={priority} />
          <TaskPriorityDropdownMenu />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as any;

      return (
        <div className="flex items-center justify-between">
          <TaskStatusBadge data={status} />
          <TaskStatusDropdownMenu />
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const size = row.getValue("size") as any;

      return (
        <div className="flex items-center justify-between">
          <TaskSizeBadge data={size} />
          <TaskSizeDropdownMenu />
        </div>
      );
    },
  },
];
