import { UserType } from "../domains/models/User";

const STORAGE_KEY = "rbac_user";
const TOKEN_KEY = "rbac_token";
const AUTH_EVENT = "auth-change";

export type RoleType = "admin" | "manager" | "editor" | "viewer";

export interface SafeUserData {
  _id?: string;
  name: string;
  email: string;
  role: RoleType;
}


export function saveUser(user: Partial<UserType>, token?: string) {
  if (typeof window === "undefined") return;
  

  if (token !== undefined) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  

  const safeUserData: SafeUserData = {
    _id: user._id || undefined,
    name: user.name ?? "",
    email: user.email ?? "",
    role: (user.role as RoleType) ?? "viewer",
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUserData));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

// -------------------------
// Récupération
// -------------------------
export function getUser(): (SafeUserData & { token?: string }) | null {
  if (typeof window === "undefined") return null;
  const str = localStorage.getItem(STORAGE_KEY);
  if (!str) return null;
  try {
    const userData = JSON.parse(str) as SafeUserData;
    const token = localStorage.getItem(TOKEN_KEY);
    return { ...userData, token: token || undefined };
  } catch (e) {
    console.error("❌ Error parsing user data:", e);
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

// -------------------------
// Suppression
// -------------------------
export function clearUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
  console.log("🧹 User cleared and event dispatched");
}

// -------------------------
// Debug
// -------------------------
export function debugAuth() {
  const user = getUser();
  const token = getToken();
  console.log("🔍 Debug Auth Info:", {
    hasUser: !!user,
    hasToken: !!token,
    tokenLength: token?.length,
    userId: user?._id,
    userEmail: user?.email,
    rawUser: localStorage.getItem(STORAGE_KEY),
    rawToken: localStorage.getItem(TOKEN_KEY),
  });
  return { user, token };
}

export { AUTH_EVENT };