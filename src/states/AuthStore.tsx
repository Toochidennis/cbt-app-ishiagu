import { create } from 'zustand';
import { persist } from 'zustand/middleware'

type Role = 'admin' | 'staff' | 'student';

interface AuthState {
    isAuthenticated: Boolean;
    role: Role | null;
    login: (role: Role) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
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
                    role: null
                })
        }),
        { name: 'auth-storage' }
    )
);