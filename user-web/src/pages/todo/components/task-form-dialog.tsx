import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// Import components
import LoadingSpinner from "src/components/loading-spinner";
import {
  TaskSizeBadge,
  TaskStatusBadge,
  TaskPriorityBadge,
} from "./task-attribute-badges";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { Button } from "src/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";

// Import hooks
import { useAuth } from "src/hooks/use-auth";
import { useStateManager } from "src/hooks/use-state-mananger";

// Import objects
import { UserAPI } from "src/objects/user/api";

// Import states
import { useTaskState } from "src/states/task";

// Import types
import type { TaskModelType } from "src/objects/task/types";

export default function TaskFormDialog() {
  const {
    taskPriorities,
    taskStatuses,
    taskSizes,
    isResponding,
    addTask,
    updateIsResponding,
  } = useTaskState();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const [attributeValues, setAttributeValueStates] = useStateManager(
    {
      priorityId: "",
      statusId: "",
      sizeId: "",
    },
    (changeState) => {
      return {
        setPriorityId(id: string) {
          changeState("priorityId", function () {
            return id;
          });
        },
        setSizeId(id: string) {
          changeState("sizeId", function () {
            return id;
          });
        },
        setStatusId(id: string) {
          changeState("statusId", function () {
            return id;
          });
        },
      };
    }
  );

  const onSubmit: SubmitHandler<any> = (data) => {
    // if (!user) return;

    console.log("New task:", data);

    const newTask = {
      ...data,
      ...attributeValues,
      creatorId: user?.id,
      isComplete: false,
    };

    console.log("New task:", newTask);

    // updateIsResponding(true);
    // UserAPI.createTask(newTask).then((payload) => {
    //   if (payload) addTask(payload.data);
    //   updateIsResponding(false);
    // });
  };

  return (
    <DialogContent className="border-b border-b-2 pb-3 mb-6">
      <DialogHeader>
        <DialogTitle>Create new item</DialogTitle>
        <DialogDescription>Manage your work better</DialogDescription>
      </DialogHeader>
      <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid w-full items-center gap-1.5 mb-2">
          <p className="font-semibold">Information</p>
          <Input
            className="w-full"
            type="text"
            id="name"
            placeholder="Your task name..."
            {...register("name", { required: true })}
          />
          <Textarea
            placeholder="Description"
            id="message"
            {...register("description", { required: true })}
          />
        </div>
        <div>
          <p className="font-semibold">Attributes</p>
          <div className="flex items-center justify-between ps-3 mb-2">
            <p>Status</p>
            <Select
              onValueChange={(value) =>
                setAttributeValueStates.setStatusId(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {taskStatuses &&
                    taskStatuses.map((status) => (
                      <SelectItem key={status._id} value={status._id}>
                        <TaskStatusBadge
                          className="cursor-pointer"
                          data={status}
                        />
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between ps-3 mb-2">
            <p>Priority</p>
            <Select
              onValueChange={(value) =>
                setAttributeValueStates.setPriorityId(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  {taskPriorities &&
                    taskPriorities.map((priority) => (
                      <SelectItem key={priority._id} value={priority._id}>
                        <TaskPriorityBadge
                          className="cursor-pointer"
                          data={priority}
                        />
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between ps-3 mb-2">
            <p>Size</p>
            <Select
              onValueChange={(value) =>
                setAttributeValueStates.setSizeId(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select size" />
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
          </div>
        </div>
        <div>
          <p className="font-semibold">Duration</p>
        </div>
        <Button
          type="submit"
          className="w-full mt-3"
          variant={isResponding ? "ghost" : "default"}
          disabled={isResponding}
        >
          {isResponding ? (
            <div className="flex justify-center items-center">
              <LoadingSpinner width="w-4" height="w-4" />
              <span className="ms-3">Adding...</span>
            </div>
          ) : (
            "Create"
          )}
        </Button>
      </form>
    </DialogContent>
  );
}
