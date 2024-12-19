import React from "react";
import { ChevronDown } from "lucide-react";

// Import components
import {
  TaskPriorityBadge,
  TaskSizeBadge,
  TaskStatusBadge,
} from "./task-attribute-badges";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "src/components/ui/dropdown-menu";

// Import states
import { useTaskState } from "src/states/task";

import { cn } from "src/lib/utils";

type TaskAttributesListProps = {
  onSelect?: (value: any) => void;
};

/**
 * Render a priority select for task
 * @returns
 */
export function TaskPrioritySelect() {
  const { taskPriorities } = useTaskState();
  const [value, setValue] = React.useState("");

  return React.useMemo(
    () => (
      <Select value={value} onValueChange={(value) => setValue(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Priority</SelectLabel>
            {taskPriorities &&
              taskPriorities.map((priority) => (
                <SelectItem key={priority._id} value={priority._id}>
                  <TaskStatusBadge className="cursor-pointer" data={priority} />
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
    [taskPriorities, value]
  );
}

/**
 * Render a dropdown menu of priority for task
 * @param param0
 * @returns
 */
export function TaskPriorityDropdownMenu({
  onSelect,
}: TaskAttributesListProps) {
  const { taskPriorities } = useTaskState();
  const [value, setValue] = React.useState<string>("");

  if (!Element || !taskPriorities) {
    return <p>Empty list</p>;
  }

  React.useEffect(() => {
    if (onSelect) onSelect(value);
  }, [value]);

  return React.useMemo(
    () => (
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer" asChild>
          <ChevronDown size="16px" color="gray" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
            {taskPriorities.map((priority) => (
              <DropdownMenuRadioItem
                value={priority._id}
                className="cursor-pointer"
              >
                <TaskPriorityBadge data={priority} />
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [taskPriorities, value]
  );
}

/**
 * Render a size select for task
 * @returns
 */
export function TaskSizeSelect() {
  const { taskSizes } = useTaskState();
  const [value, setValue] = React.useState("");

  return React.useMemo(
    () => (
      <Select value={value} onValueChange={(value) => setValue(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Size</SelectLabel>
            {taskSizes &&
              taskSizes.map((size) => (
                <SelectItem key={size._id} value={size._id}>
                  <TaskSizeBadge className="cursor-pointer" data={size} />
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
    [taskSizes, value]
  );
}

/**
 * Render a dropdown menu of size for task
 * @param param0
 * @returns
 */
export function TaskSizeDropdownMenu({ onSelect }: TaskAttributesListProps) {
  const { taskSizes } = useTaskState();
  const [value, setValue] = React.useState<string>("");

  if (!Element || !taskSizes) {
    return <p>Empty list</p>;
  }

  React.useEffect(() => {
    if (onSelect) onSelect(value);
  }, [value]);

  return React.useMemo(
    () => (
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer" asChild>
          <ChevronDown size="16px" color="gray" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Size</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
            {taskSizes.map((size) => (
              <DropdownMenuRadioItem
                value={size._id}
                className="cursor-pointer"
              >
                <TaskSizeBadge data={size} />
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [taskSizes, value]
  );
}

/**
 * Render a status select for task
 * @returns
 */
export function TaskStatusSelect() {
  const { taskStatuses } = useTaskState();
  const [value, setValue] = React.useState("");

  return React.useMemo(
    () => (
      <Select value={value} onValueChange={(value) => setValue(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {taskStatuses &&
              taskStatuses.map((status) => (
                <SelectItem key={status._id} value={status._id}>
                  <TaskStatusBadge className="cursor-pointer" data={status} />
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
    [taskStatuses, value]
  );
}

/**
 * Render a dropdown menu of status for task
 * @param param0
 * @returns
 */
export function TaskStatusDropdownMenu({ onSelect }: TaskAttributesListProps) {
  const { taskStatuses } = useTaskState();
  const [value, setValue] = React.useState<string>("");

  if (!Element || !taskStatuses) {
    return <p>Empty list</p>;
  }

  React.useEffect(() => {
    if (onSelect) onSelect(value);
  }, [value]);

  return React.useMemo(
    () => (
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer" asChild>
          <ChevronDown size="16px" color="gray" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Size</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
            {taskStatuses.map((status) => (
              <DropdownMenuRadioItem
                value={status._id}
                className="cursor-pointer"
              >
                <TaskStatusBadge data={status} />
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [taskStatuses, value]
  );
}
