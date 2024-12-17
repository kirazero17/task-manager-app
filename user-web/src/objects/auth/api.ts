import { toast } from "react-toastify";

import { API } from "src/api";

// Import types
import type {
  SignInUserType,
  SignUpUserType,
  AuthenticationDataType,
} from "../user/types";

const api = new API({
  baseURL: import.meta.env.VITE_IDENTITY_SERVICE_ENDPOINT,
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

export class AuthAPI {
  static async signIn(data: SignInUserType | { token: string }) {
    try {
      const response = await api.post<
        SignInUserType | { token: string },
        AuthenticationDataType
      >("/auth/sign-in", data);
      return response.data;
    } catch (error) {
      return;
    }
  }
  static async signUp(data: SignUpUserType) {
    try {
      const response = await api.post<SignUpUserType, AuthenticationDataType>(
        "/auth/sign-up",
        data
      );
      return response.data;
    } catch (error) {
      return;
    }
  }
}
