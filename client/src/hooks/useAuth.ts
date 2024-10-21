// import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Import API
import { API } from "src/api";

// Import state
import { useAuthState } from "src/states/auth";

// Import utils
import { BrowserStorageUtils } from "src/utils/browser_storage";
import { CookieUtils } from "src/utils/cookies";

// Import types
import type {
  UserModel,
  AuthenticationData,
  User,
} from "src/objects/user/type";

const api = new API({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
});

// Add global hook to api
api.hook("response", undefined, function (error) {
  const message = error?.response.data.error.message;
  toast.error(message, {
    position: "top-center",
    autoClose: 5000,
  });
  return Promise.reject(error);
});

export function useAuth() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isPending,
    user,
    updateIsAuthenticated,
    updateUser,
    updateIsPending,
  } = useAuthState();

  const signin = async function (data: AuthenticationData) {
    try {
      updateIsPending(true);

      const response = await api.post<
        AuthenticationData,
        { token: string; user: User }
      >("/auth/sign-in", data);

      const message =
        response?.data?.success?.message || "Sign in successfully";
      toast.success(message, {
        position: "top-center",
        autoClose: 5000,
      });

      updateIsAuthenticated(true);
      updateIsPending(false);
      if (response.data.data.token) {
        updateUser(response?.data.data.user);

        // Add token to cookie
        CookieUtils.writePersistentCookie(
          CookieUtils.TOKEN_NAME + "tkn",
          response.data.data.token
        );
      }

      if (response.data.data.user) {
        // Save to local storage
        BrowserStorageUtils.setItem("user", response?.data.data.user);
      } else {
        // Get user from local storage
        const user = BrowserStorageUtils.getItem("user") as UserModel;
        user.id = Number(user.id);
        updateUser(user);
      }

      return response?.data;
    } catch (error: any) {
      updateIsPending(false);
      navigate("/");
    }
  };
  const signup = async function (data: UserModel) {
    try {
      updateIsPending(true);

      const response = await api.post<
        AuthenticationData,
        { token: string; user: User }
      >("/auth/sign-up", data);

      const message =
        response?.data?.success?.message || "Sign up successfully";
      toast.success(message, {
        position: "top-center",
        autoClose: 5000,
      });

      updateIsAuthenticated(true);
      updateIsPending(false);
      updateUser(response?.data.data.user);

      // Add token to cookie
      CookieUtils.writePersistentCookie(
        CookieUtils.TOKEN_NAME + "tkn",
        response.data.data.token
      );

      // Save to local storage
      BrowserStorageUtils.setItem("user", response?.data.data.user);

      return response?.data;
    } catch (error: any) {
      updateIsPending(false);
      navigate("/");
    }
  };
  const signout = function () {
    CookieUtils.removeCookie(CookieUtils.TOKEN_NAME + "tkn");
    updateIsAuthenticated(false);
    updateUser(null);
    navigate("/");
  };

  return {
    isAuthenticated,
    isPending,
    user,
    signin,
    signup,
    signout,
  };
}
