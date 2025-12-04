import { useState, useEffect, useCallback, useRef } from "react";
import { getUser, getToken, saveUser, clearUser, SafeUserData, AUTH_EVENT } from "@/lib/auth";
import { decodeToken } from "@/hooks/useDecodeToken";

function getNowInSeconds() {
  return Math.floor(Date.now() / 1000);
}

export function useAuth() {
  const [user, setUser] = useState<SafeUserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isCheckingRef = useRef(false);

  // -------------------------
  // Vérifie l'état d'auth
  // -------------------------
  const checkAuth = useCallback(() => {
    // Éviter les appels simultanés
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    console.log('🔍 Checking authentication...');
    
    const token = getToken();
    const userData = getUser();
    console.log('📦 Token exists:', !!token);
    console.log('👤 User data:', userData);

    if (!token || !userData) {
      console.log('❌ No token or user data');
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      isCheckingRef.current = false;
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      console.log('❌ Token decode failed');
      clearUser();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      isCheckingRef.current = false;
      return;
    }

    const now = getNowInSeconds();
    console.log('⏰ Token exp:', decoded.exp, 'Now:', now, 'Valid:', decoded.exp > now);

    if (decoded.exp < now) {
      console.log('❌ Token expired');
      clearUser();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      isCheckingRef.current = false;
      return;
    }

    // 🔥 CORRECTION: Extraire l'ID du token si _id est vide
    let userId = userData._id;
    if (!userId || userId === "") {
      console.log('⚠️ No _id in userData, extracting from token...');
      userId = decoded.id;
      console.log('✅ ID extracted from token:', userId);
    }

    // Créer un objet user avec le bon _id
    const userWithId: SafeUserData = {
      ...userData,
      _id: userId,
    };

    console.log('✅ Authentication valid with user:', userWithId);
    setUser(userWithId);
    setIsAuthenticated(true);
    setIsLoading(false);
    isCheckingRef.current = false;
  }, []);

  
  useEffect(() => {
    checkAuth();
  }, []); 

  
  useEffect(() => {
    const handleAuthChange = () => {
      console.log('🔄 Auth change event detected, rechecking...');
      checkAuth();
    };

    // Écouter l'événement personnalisé
    window.addEventListener(AUTH_EVENT, handleAuthChange);
    
    // Écouter les changements de localStorage (synchronisation entre onglets)
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_EVENT, handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [checkAuth]);

  // -------------------------
  // Login
  // -------------------------
  const login = useCallback((userData: SafeUserData, token: string) => {
    console.log('🔐 Login called with:', userData);
    saveUser(userData, token);
    setUser(userData);
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  // -------------------------
  // Logout
  // -------------------------
  const logout = useCallback(() => {
    console.log('🚪 Logout called');
    clearUser();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };
}