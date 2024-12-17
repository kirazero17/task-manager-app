import { API } from "src/api";

// Import utils
import { BrowserStorageUtils } from "src/utils/browser_storage";

// Import types
import type { UserType } from "./types";
import type { TaskType, NewTaskType, UpdateTaskType } from "../task/types";

const TaskManagerAPI = new API({
  baseURL: import.meta.env.VITE_TASK_SERVICE_ENDPOINT,
});

const IdentityAPI = new API({
  baseURL: import.meta.env.VITE_IDENTITY_SERVICE_ENDPOINT,
});

export class UserAPI {
  static getLocalUser() {
    const user = BrowserStorageUtils.getItem("user") as UserType;
    if (!user) throw new Error("User isn't found in local storage");
    return user;
  }

  static async getUser() {
    try {
      const user = UserAPI.getLocalUser();
      const response = await IdentityAPI.get<UserType>(`/users/${user.id}`, {
        headers: {
          Authorization: API.generateBearerToken(API.getToken()) as string,
        },
      });
      return response.data;
    } catch (error) {
      return;
    }
  }

  static async getTasks() {
    try {
      const user = UserAPI.getLocalUser();
      const response = await TaskManagerAPI.get<Array<TaskType>>(
        `/users/${user.id}/tasks`,
        {
          headers: {
            Authorization: API.generateBearerToken(API.getToken()) as string,
          },
        }
      );
      return response.data;
    } catch (error) {
      return;
    }
  }

  static async getTask(taskId: string | number) {
    try {
      const user = UserAPI.getLocalUser();
      const response = await TaskManagerAPI.get<TaskType>(
        `users/${user.id}/tasks/${taskId}`,
        {
          headers: {
            Authorization: API.generateBearerToken(API.getToken()) as string,
          },
        }
      );
      return response.data;
    } catch (error) {
      return;
    }
  }

  static async createTask(task: NewTaskType) {
    try {
      const user = UserAPI.getLocalUser();
      const response = await TaskManagerAPI.post<NewTaskType, TaskType>(
        `/users/${user.id}/task`,
        task,
        {
          headers: {
            Authorization: API.generateBearerToken(API.getToken()) as string,
          },
        }
      );
      return response.data;
    } catch (error) {
      return;
    }
  }

  static async updateTask(id: string, task: UpdateTaskType) {
    try {
      const user = UserAPI.getLocalUser();
      const response = await TaskManagerAPI.patch<UpdateTaskType, TaskType>(
        `/users/${user.id}/tasks/${id}`,
        task,
        {
          headers: {
            Authorization: API.generateBearerToken(API.getToken()) as string,
          },
        }
      );
      return response.data;
    } catch (error) {
      return;
    }
  }

  static async deleteTask(taskId: string) {
    try {
      const user = UserAPI.getLocalUser();
      const response = await TaskManagerAPI.delete<TaskType>(
        `/users/${user.id}/tasks/${taskId}`,
        {
          headers: {
            Authorization: API.generateBearerToken(API.getToken()) as string,
          },
        }
      );
      return response.data;
    } catch (error) {
      return;
    }
  }
}
