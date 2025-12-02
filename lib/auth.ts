import { UserType } from "./../domains/models/User";

const STORAGE_KEY = "rbac_user";
const TOKEN_KEY = "rbac_token";


interface SafeUserData {
  _id?: string;
  name: string;
  email: string;
  role: string;
}

export function saveUser(user: UserType, token?: string) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  const safeUserData: SafeUserData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUserData));
}

export function getUser(): (SafeUserData & { token?: string }) | null {
  const str = localStorage.getItem(STORAGE_KEY);
  if (!str) return null;

  try {
    const userData = JSON.parse(str) as SafeUserData;
    const token = localStorage.getItem(TOKEN_KEY);

    return {
      ...userData,
      token: token || undefined,
    };
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
}


export function debugAuth() {
  const user = getUser();
  const token = getToken();

  console.log("Debug Auth Info:", {
    hasUser: !!user,
    hasToken: !!token,
    tokenLength: token?.length,
    userEmail: user?.email,
    localStorage: localStorage.getItem(STORAGE_KEY),
    tokenStorage: localStorage.getItem(TOKEN_KEY),
  });

  return { user, token };
}
