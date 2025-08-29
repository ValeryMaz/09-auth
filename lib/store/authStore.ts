import { User } from "@/types/user";
import { create } from "zustand";

type AuthStoreSave = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
};

export const useAuthStore = create<AuthStoreSave>()((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user: User) =>
    set({
      user,
      isAuthenticated: true,
    }),
  clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
}));
