import { API } from "src/api";

// Import utils
import { BrowserStorageUtils } from "src/utils/browser_storage";

// Import types
import type { User } from "./type";
import type { TaskModel } from "../task/type";

const TaskManagerAPI = new API({
  baseURL: import.meta.env.VITE_TASK_SERVICE_ENDPOINT,
});

const IdentityAPI = new API({
  baseURL: import.meta.env.VITE_IDENTITY_SERVICE_ENDPOINT,
});

export class UserAPI {
  static getLocalUser() {
    const user = BrowserStorageUtils.getItem("user") as User;
    if (!user) throw new Error("User isn't found in local storage");
    return user;
  }

  static async getUser() {
    try {
      const user = UserAPI.getLocalUser();
      const response = await IdentityAPI.get<User>(`/users/${user.id}`, {
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
      const response = await TaskManagerAPI.get<Array<TaskModel>>(
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
      const response = await TaskManagerAPI.get<TaskModel>(
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

  static async createTask(task: TaskModel) {
    try {
      const user = UserAPI.getLocalUser();
      const response = await TaskManagerAPI.post<TaskModel, TaskModel>(
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

  static async updateTask(task: TaskModel) {
    try {
      const user = UserAPI.getLocalUser();
      const response = await TaskManagerAPI.patch<TaskModel, TaskModel>(
        `/users/${user.id}/tasks/${task.id}`,
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

  static async deleteTask(taskId: string | number) {
    try {
      const user = UserAPI.getLocalUser();
      const response = await TaskManagerAPI.delete<TaskModel>(
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
