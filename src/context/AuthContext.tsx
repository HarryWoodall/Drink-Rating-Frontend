// import {
//   createContext,
//   useCallback,
//   useContext,
//   useMemo,
//   useState,
// } from "react";
// import type { AuthUser } from "@/types/auth";
// import { loginUser, registerUser } from "@/services/api";

// interface AuthContextValue {
//   user: AuthUser | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// const TOKEN_KEY = "nightcap_token";
// const USER_KEY = "nightcap_user";

// function getStoredAuth(): { token: string; user: AuthUser } | null {
//   const token = localStorage.getItem(TOKEN_KEY);
//   const raw = localStorage.getItem(USER_KEY);
//   if (!token || !raw) return null;
//   try {
//     return { token, user: JSON.parse(raw) as AuthUser };
//   } catch {
//     return null;
//   }
// }

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const stored = getStoredAuth();
//   const [token, setToken] = useState<string | null>(stored?.token ?? null);
//   const [user, setUser] = useState<AuthUser | null>(stored?.user ?? null);

//   const persist = useCallback((t: string, u: AuthUser) => {
//     localStorage.setItem(TOKEN_KEY, t);
//     localStorage.setItem(USER_KEY, JSON.stringify(u));
//     setToken(t);
//     setUser(u);
//   }, []);

//   const login = useCallback(
//     async (email: string, password: string) => {
//       const res = await loginUser(email, password);
//       persist(res.token, res.user);
//     },
//     [persist],
//   );

//   const register = useCallback(
//     async (email: string, password: string) => {
//       const res = await registerUser(email, password);
//       persist(res.token, res.user);
//     },
//     [persist],
//   );

//   const logout = useCallback(() => {
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem(USER_KEY);
//     setToken(null);
//     setUser(null);
//   }, []);

//   const value = useMemo(
//     () => ({ user, token, isAuthenticated: !!token, login, register, logout }),
//     [user, token, login, register, logout],
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth(): AuthContextValue {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
//   return ctx;
// }
