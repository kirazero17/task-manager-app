import { create, UseBoundStore } from "zustand";

// Import utils
import { OtherUtils } from "src/utils/other";

// Import types
import type {
  TaskType,
  TaskPriorityType,
  TaskSizeType,
  TaskStatusType,
} from "src/objects/task/types";

type TaskState = {
  currentTask: TaskType | null;
  tasks: Array<TaskType> | null;
  tasksByStatus: Map<string, Array<TaskType> | null> | null;
  taskStatuses: Array<TaskStatusType> | null;
  taskPriorities: Array<TaskPriorityType> | null;
  taskSizes: Array<TaskSizeType> | null;
  isResponding: boolean;
};

type TaskActions = {
  // For task
  setCurrentTask(task: TaskType | null): void;
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
    currentTask: null,
    tasks: null,
    tasksByStatus: null,
    taskStatuses: null,
    taskPriorities: null,
    taskSizes: null,
    isResponding: false,
    updateIsResponding(status?: boolean) {
      set((state) => ({ ...state, isResponding: Boolean(status) }));
    },
    setCurrentTask(task) {
      set((state) => {
        return { ...state, currentTask: task };
      });
    },
    setTasks(tasks) {
      set((state) => {
        // If task and state.tasksByStatus are not null,
        // classify tasks with status
        let _tasksByStatus = null;
        if (tasks && state.tasksByStatus) {
          _tasksByStatus = state.tasksByStatus;

          for (const task of tasks) {
            // Get taskList that is stored in Map
            let taskList = _tasksByStatus.get(task.status.value);

            // If taskList is null, create new list
            if (!taskList) {
              taskList = [];
              _tasksByStatus.set(task.status.value, taskList);
            }

            // Append to task list by reference
            taskList.push(task);
          }
        }

        return { ...state, tasks: tasks, tasksByStatus: _tasksByStatus };
      });
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
        let tasksByStatus;

        if (statuses) {
          statuses.sort((a, b) => a.order - b.order);

          tasksByStatus = new Map<string, Array<TaskType> | null>(
            statuses.map((priority) => [priority.value, null])
          );
        }
        return { ...state, taskStatuses: statuses, tasksByStatus };
      });
    },

    // For priority of task
    setTaskPriorities(priorities: Array<TaskPriorityType> | null) {
      set((state) => {
        return { ...state, taskPriorities: priorities };
      });
    },

    // For size of task
    setTaskSizes(sizes: Array<TaskSizeType> | null) {
      set((state) => {
        return { ...state, taskSizes: sizes };
      });
    },
  };
});
