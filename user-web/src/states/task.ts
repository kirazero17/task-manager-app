import { create, UseBoundStore } from "zustand";

// Import utils
import { OtherUtils } from "src/utils/other";

// Import types
import type {
  TaskType,
  TaskPriorityType,
  TaskSizeType,
  TaskStatusType,
} from "src/objects/task/type";

type TaskState = {
  tasks: Array<TaskType> | null;
  taskStatuses: Array<TaskStatusType> | null;
  taskPriorities: Array<TaskPriorityType> | null;
  taskSizes: Array<TaskSizeType> | null;
  isResponding: boolean;
};

type TaskActions = {
  // For task
  setTasks(tasks: Array<TaskType> | null): void;
  addTask(task: TaskType): void;
  updateTask(task: TaskType): void;
  deteteTask(taskId: string | number): void;
  updateIsResponding(status?: boolean): void;
  clearTasks(): void;

  // For status of task
  setTaskStatuses(statuses: Array<TaskStatusType> | null): void;

  // For priority of task
  setTaskPriorities(statuses: Array<TaskPriorityType> | null): void;

  // For size of task
  setTaskSizes(statuses: Array<TaskSizeType> | null): void;
};

export const useTaskState = create<TaskState & TaskActions>((set) => {
  return {
    tasks: null,
    taskStatuses: null,
    taskPriorities: null,
    taskSizes: null,
    isResponding: false,
    updateIsResponding(status?: boolean) {
      set((state) => ({ ...state, isResponding: Boolean(status) }));
    },
    setTasks(tasks) {
      set((state) => ({ ...state, tasks: tasks }));
    },
    addTask(task: TaskType) {
      set((state) => {
        let tasks = state.tasks;

        if (!tasks) tasks = [];

        tasks.push(task);

        return { ...state, tasks };
      });
    },
    updateTask(task: TaskType) {
      set((state) => {
        if (!state.tasks) return state;

        const tasks = state.tasks;
        const oldTaskId = tasks.findIndex((t) => t._id === task._id);

        if (!task) return state;

        OtherUtils.replaceAt(tasks, oldTaskId, task);

        return { ...state, tasks: tasks };
      });
    },
    deteteTask(taskId: string | number) {
      set((state) => {
        if (!state.tasks) return state;

        OtherUtils.deleteAt(state.tasks, Number(taskId));

        return { ...state, tasks: state.tasks };
      });
    },
    clearTasks() {
      set((state) => {
        return { ...state, tasks: null };
      });
    },
    // For status of task
    setTaskStatuses(statuses: Array<TaskStatusType> | null) {
      set((state) => {
        return { ...state, taskStatuses: statuses };
      });
    },

    // For priority of task
    setTaskPriorities(statuses: Array<TaskPriorityType> | null) {
      set((state) => {
        return { ...state, taskPriorities: statuses };
      });
    },

    // For size of task
    setTaskSizes(statuses: Array<TaskSizeType> | null) {
      set((state) => {
        return { ...state, taskSizes: statuses };
      });
    },
  };
});
