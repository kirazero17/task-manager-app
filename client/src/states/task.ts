import { create } from "zustand";

// Import utils
import { OtherUtils } from "src/utils/other";

// Import types
import type { TaskModel } from "src/objects/task/type";

type TaskState = {
  tasks: Array<TaskModel> | null;
  isResponding: boolean;
};

type TaskActions = {
  setTasks(tasks: Array<TaskModel> | null): void;
  addTask(task: TaskModel): void;
  updateTask(task: TaskModel): void;
  deteteTask(taskId: string | number): void;
  updateIsResponding(status?: boolean): void;
};

export const useTaskState = create<TaskState & TaskActions>((set) => {
  return {
    tasks: null,
    isResponding: false,
    updateIsResponding(status?: boolean) {
      set((state) => ({ ...state, isResponding: Boolean(status) }));
    },
    setTasks(tasks) {
      set((state) => ({ ...state, tasks: tasks }));
    },
    addTask(task: TaskModel) {
      set((state) => {
        let tasks = state.tasks;

        if (!tasks) tasks = [];

        tasks.push(task);

        return { ...state, tasks };
      });
    },
    updateTask(task: TaskModel) {
      set((state) => {
        if (!state.tasks) return state;

        const tasks = state.tasks;
        const oldTaskId = tasks.findIndex((t) => t.id === task.id);

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
  };
});
