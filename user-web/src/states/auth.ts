import { create } from "zustand";

// Import types
import type { UserType } from "src/objects/user/types";

type AuthState = {
  isAuthenticated: boolean;
  isPending: boolean;
  user: UserType | null;
};

type AuthActions = {
  updateIsAuthenticated(status?: boolean): void;
  updateUser(user: User | null): void;
  updateIsPending(status?: boolean): void;
};

export const useAuthState = create<AuthState & AuthActions>((set) => {
  return {
    isAuthenticated: false,
    isPending: false,
    user: null,
    updateIsAuthenticated(status?: boolean) {
      set((state) => ({ ...state, isAuthenticated: Boolean(status) }));
    },
    updateIsPending(status?: boolean) {
      set((state) => ({ ...state, isPending: Boolean(status) }));
    },
    updateUser(user: User | null) {
      set((state) => ({ ...state, user }));
    },
  };
});
