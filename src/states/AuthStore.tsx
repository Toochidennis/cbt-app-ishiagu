import { create } from 'zustand';

type Role = 'admin' | 'staff' | 'student';

interface AuthState {
    isAuthenticated: Boolean;
    role: Role | null;
    login: (role: Role) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
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
}));