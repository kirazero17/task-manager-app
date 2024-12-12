import React from "react";
import { useRoutes, Navigate } from "react-router-dom";

// Import components
import Signin from "src/pages/auth/components/Signin";
import Signup from "src/pages/auth/components/Sinup";
import Tasks from "src/pages/todo/components/Tasks";
import CompleteTasks from "src/pages/todo/components/CompleteTasks";

// Import hooks
import { useAuth } from "src/hooks/useAuth";

// Import pages
import AuthPage from "src/pages/auth";
import HomePage from "src/pages/home";
import TodoPage from "src/pages/todo";

// Import utils
import { CookieUtils } from "src/utils/cookies";

// Import types
import type { RouteObject } from "react-router-dom";

const unAuthenticatedRoutes: Array<RouteObject> = [
  {
    path: "/",
    element: <AuthPage />,
    children: [
      {
        path: "/sign-in",
        element: <Signin />,
      },
      {
        path: "/sign-up",
        element: <Signup />,
      },
      {
        path: "/",
        element: <Navigate to="/sign-in" replace />,
      },
    ],
  },
];

const authenticatedRoutes: Array<RouteObject> = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/todo",
    element: <TodoPage />,
    children: [
      {
        path: "tasks",
        element: <Tasks />,
      },
      {
        path: "complete",
        element: <CompleteTasks />,
      },
      {
        path: "",
        element: <Navigate to="tasks" replace />,
      },
    ],
  },
  {
    path: "/sign-in",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/sign-up",
    element: <Navigate to="/" replace />,
  },
];

export default function RootRoutes() {
  const { isAuthenticated, signin } = useAuth();

  React.useEffect(() => {
    const token = CookieUtils.readCookie(CookieUtils.TOKEN_NAME + "tkn");
    if (token) {
      signin({ token });
    }
  }, []);

  return isAuthenticated
    ? useRoutes(authenticatedRoutes)
    : useRoutes(unAuthenticatedRoutes);
}
