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
  UserType,
  SignInUserType,
  SignUpUserType,
  AuthenticationDataType,
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

  const signin = async function (data: SignInUserType | { token: string }) {
    try {
      updateIsPending(true);

      const response = await api.post<
        SignInUserType | { token: string },
        AuthenticationDataType
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
        const user = BrowserStorageUtils.getItem("user") as UserType;
        user.id = Number(user.id);
        updateUser(user);
      }

      return response?.data;
    } catch (error: any) {
      updateIsPending(false);
      navigate("/");
    }
  };
  const signup = async function (data: SignUpUserType) {
    try {
      updateIsPending(true);

      const response = await api.post<SignUpUserType, AuthenticationDataType>(
        "/auth/sign-up",
        data
      );

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
  const signout = function (fn?: () => void) {
    CookieUtils.removeCookie(CookieUtils.TOKEN_NAME + "tkn");
    updateIsAuthenticated(false);
    updateUser(null);

    // Do something
    if (fn) fn();

    // Navigate to /
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
