import { create } from 'zustand';

interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

interface UserStore {
  user: UserData | null;
  setUser: (user: UserData) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));