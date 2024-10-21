import { Outlet, useLocation, useNavigate } from "react-router-dom";
import cn from "classnames";

// Import components
import TaskForm from "./components/TaskForm";

// Import hooks
import { useAuth } from "src/hooks/useAuth";

export default function TodoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signout } = useAuth();

  const buttonClassNames =
    "flex-1 px-3 py-2 hover:bg-slate-100 hover:font-bold ";
  const activeButtonClassNames =
    buttonClassNames + "font-bold border-b border-b-2 border-blue-700";
  const buttonTaskClassNames = cn({
    [activeButtonClassNames]: location.pathname === "/todo/tasks",
    [buttonClassNames]: location.pathname !== "/todo/tasks",
  });
  const buttonCompleteTaskClassNames = cn({
    [activeButtonClassNames]: location.pathname === "/todo/complete",
    [buttonClassNames]: location.pathname !== "/todo/complete",
  });

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col w-full max-w-[720px] min-w-[300px] max-h-[720px] bg-white p-6 rounded-lg border border-blue-700">
        <header className="flex justify-between">
          <div>
            <h1 className="font-bold text-3xl">Hello, {user?.name}</h1>
            <p>Have you done all your task?</p>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center px-3 py-2 me-2 text-xs font-medium text-center inline-flex items-center bg-white rounded-lg hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              Go home
            </button>
            <button
              type="button"
              onClick={() => signout()}
              className="px-3 py-2 text-xs font-medium text-center inline-flex items-center bg-slate-100 rounded-lg hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              Sign out
            </button>
          </div>
        </header>
        <div className="flex justify-between border-b border-b-1 mt-4 mb-6">
          <button
            onClick={() => {
              navigate("/todo/tasks");
            }}
            className={buttonTaskClassNames}
          >
            Task
          </button>
          <button
            onClick={() => {
              navigate("/todo/complete");
            }}
            className={buttonCompleteTaskClassNames}
          >
            Complete
          </button>
        </div>
        {location.pathname === "/todo/tasks" && <TaskForm />}
        <section className="h-full overflow-y-auto">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
