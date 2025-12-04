"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Settings,
  Menu,
  Search,
  User,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UserRepoAPI } from "@/infrastructures/repository/UserRepoAPI";
import { UserType } from "@/domains/models/User";

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  className,
  isCollapsed = false,
  onToggle,
}) => {
  const router = useRouter();
  const { user: authUser, isAuthenticated } = useAuth();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated || !authUser?._id) {
        setError("Non authentifié");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('📡 Fetching user from DB with ID:', authUser._id);
        const response = await UserRepoAPI.getById(authUser._id);
        console.log('✅ User data fetched:', response);
        setCurrentUser(response);
        setError(null);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération du user:", err);
        setError("Impossible de charger les informations utilisateur.");
        // Fallback sur les données du token
        setCurrentUser(authUser as any);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isAuthenticated, authUser?._id]);

  const menuItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/tableau-de-bord" },
    { icon: ArrowLeft, label: "Page d'accueil", href: "/" },
    { icon: User, label: "Mon profil", href: "/tableau-de-bord/profile" },
  ];

  const bottomMenuItems = [
    { icon: Settings, label: "Paramètres", href: "/tableau-de-bord/settings" },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col bg-background border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold">YourCrush</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="ml-auto"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-4 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-secondary rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-3">
          <div className="space-y-1 py-2">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                onClick={() => router.push(item.href)}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10",
                  isCollapsed ? "px-2" : "px-3"
                )}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Button>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-1 py-2">
            {bottomMenuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10",
                  isCollapsed ? "px-2" : "px-3"
                )}
                onClick={() => router.push(item.href)}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {!isCollapsed && (
        <div className="p-4 border-t flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              {loading ? (
                <span className="text-xs text-muted-foreground">…</span>
              ) : error ? (
                <span className="text-xs text-red-500">!</span>
              ) : (
                <span className="text-sm font-medium">
                  {currentUser?.name?.charAt(0).toUpperCase() || "?"}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {loading ? (
                <p className="text-sm text-muted-foreground truncate">
                  Chargement…
                </p>
              ) : error ? (
                <p className="text-sm text-red-500 truncate">{error}</p>
              ) : (
                <>
                  <p className="text-sm font-medium truncate">
                    {currentUser?.name || "Utilisateur"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentUser?.email || "—"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;