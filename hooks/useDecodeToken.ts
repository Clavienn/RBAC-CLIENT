import { useMemo } from "react";
import { getToken } from "@/lib/auth";

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

// ✔️ Déplacer la fonction impure hors du hook
function getNowInSeconds() {
  return Math.floor(Date.now() / 1000);
}

export function useDecodeToken() {
  const token = getToken();

  const { decodedToken, isExpired } = useMemo(() => {
    if (!token) return { decodedToken: null, isExpired: true };

    const decoded = decodeToken(token);
    if (!decoded) return { decodedToken: null, isExpired: true };

    // ✔️ React Compiler accepte l’appel ici car la fonction est externe
    const now = getNowInSeconds();

    return {
      decodedToken: decoded,
      isExpired: decoded.exp < now,
    };
  }, [token]);

  return { decodedToken, isExpired };
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload) as DecodedToken;
  } catch {
    return null;
  }
}
