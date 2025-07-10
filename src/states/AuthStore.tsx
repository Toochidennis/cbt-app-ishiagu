import type { CreateSetting, CreateUser } from '@/types/ipc/ipcTypes';
import { create } from 'zustand';
import { persist } from 'zustand/middleware'

type Role = 'admin' | 'staff' | 'student';

interface AuthState {
    user: CreateUser | null;
    settings: CreateSetting | null;
    setUser: (user: CreateUser) => void;
    setSettings: (settings: CreateSetting) => void;
    isAuthenticated: Boolean;
    role: Role | null;
    login: (role: Role) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            settings: null,
            setUser: (user) => set({ user }),
            setSettings: (settings) => set({ settings }),
            isAuthenticated: false,
            role: null,
            login: (role) =>
                set({
                    isAuthenticated: true,
                    role: role,
                }),
            logout: () =>
                set({
                    isAuthenticated: false,
                    role: null,
                    user: null,
                    settings: null,
                })
        }),
        { name: 'auth-store' }
    )
);