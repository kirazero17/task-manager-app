import { useForm, SubmitHandler } from "react-hook-form";

// Import components
import LoadingSpinner from "src/components/LoadingSpinner";

// Import hooks
import { useAuth } from "src/hooks/useAuth";

// Import objects
import { UserAPI } from "src/objects/user/api";

// Import states
import { useTaskState } from "src/states/task";

type TaskFormInputs = {
  name: string;
  description: string;
};

export default function TaskForm() {
  const { addTask, isResponding, updateIsResponding } = useTaskState();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormInputs>();

  const onSubmit: SubmitHandler<TaskFormInputs> = (data) => {
    if (!user) return;

    const newTask = {
      ...data,
      userId: user?.id,
      isComplete: false,
    };
    updateIsResponding(true);
    UserAPI.createTask(newTask).then((payload) => {
      if (payload) addTask(payload.data);
      updateIsResponding(false);
    });
  };

  return (
    <div className="border-b border-b-2 pb-3 mb-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("name")}
            type="text"
            name="name"
            id="taskName"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=""
            autoComplete="off"
            required
          />
          <label
            htmlFor="taskName"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Name of task
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <textarea
            {...register("description")}
            name="description"
            id="taskDescription"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            autoComplete="off"
          />
          <label
            htmlFor="taskDescription"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Task's Description
          </label>
        </div>
        <div>
          <button
            type="submit"
            disabled={isResponding}
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-3 text-center"
          >
            {isResponding ? (
              <div className="flex justify-center items-center">
                <LoadingSpinner width="w-4" height="w-4" />
                <span className="ms-3">Adding...</span>
              </div>
            ) : (
              "Add new task"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
