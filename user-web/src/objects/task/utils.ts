// Import types
import type {
  TaskType,
  TaskPriorityType,
  TaskSizeType,
  TaskStatusType,
} from "src/objects/task/type";

export class TaskUtils {
  /**
   * Get task by its `id`
   * @param tasks
   * @param id
   * @returns
   */
  static getTaskById(tasks: Array<TaskType> | null, id: string) {
    if (!tasks) return null;
    return tasks.find((task) => task._id === id);
  }

  /**
   * Get attribute in attributes list of task by `name`
   * @param attributes
   * @param name
   * @returns
   */
  static getTaskAttributeByName(attributes: Array<any> | null, name: string) {
    if (!attributes) return null;
    return attributes.find((attribute) => attribute.name === name);
  }

  /**
   * Get attribute in attributes list of task by `id`
   * @param attributes
   * @param name
   * @returns
   */
  static getTaskAttributeById(attributes: Array<any> | null, id: string) {
    if (!attributes) return null;
    return attributes.find((attribute) => attribute._id === id);
  }

  /**
   * Get attribute in attributes list of task by `value`
   * @param attributes
   * @param name
   * @returns
   */
  static getTaskAttributeByValue(attributes: Array<any> | null, value: string) {
    if (!attributes) return null;
    return attributes.find((attribute) => attribute.value === value);
  }

  /**
   * Get color by status
   * @param status
   * @returns
   */
  static getStatusCircleColor(status: TaskStatusType) {
    let result = "";

    switch (status.value) {
      case "not_started": {
        result = `border-gray-400 bg-gray-100`;
        break;
      }

      case "considering": {
        result = `border-blue-700 bg-blue-100`;
        break;
      }

      case "bug": {
        result = `border-red-700 bg-red-100`;
        break;
      }

      case "drop": {
        result = `border-orange-700 bg-orange-100`;
        break;
      }

      case "done": {
        result = `border-green-700 bg-green-100`;
        break;
      }

      case "in_process": {
        result = `border-yellow-700 bg-yellow-100`;
        break;
      }
    }

    return result;
  }
}
