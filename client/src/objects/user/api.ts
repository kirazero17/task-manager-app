import { API } from "src/api";

// Import utils
import { BrowserStorageUtils } from "src/utils/browser_storage";

// Import types
import type { User } from "./type";
import type { TaskModel } from "../task/type";

const api = new API({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
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
      const response = await api.get<User>(`/users/${user.id}`, {
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
      const response = await api.get<Array<TaskModel>>(
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
      const response = await api.get<TaskModel>(
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
      const response = await api.post<TaskModel, TaskModel>(
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
      const response = await api.patch<TaskModel, TaskModel>(
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
      const response = await api.delete<TaskModel>(
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
