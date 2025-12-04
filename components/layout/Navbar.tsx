"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRepoAPI } from '@/infrastructures/repository/UserRepoAPI';
import { UserType } from '@/domains/models/User';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const router = useRouter();
  const { user: authUser, isAuthenticated, isLoading, logout } = useAuth();


  // Récupérer les informations utilisateur depuis la BD via getById
  useEffect(() => {

    console.log("AUTHJHHHHH", authUser);
    
    const fetchUserData = async () => {
      if (isAuthenticated && authUser?._id) {
        setIsLoadingUser(true);
        try {
          console.log('📡 Fetching user from DB with ID:', authUser._id);
          const userData = await UserRepoAPI.getById(authUser._id);
          console.log('✅ User data fetched:', userData);
          setCurrentUser(userData);
        } catch (error) {
          console.error('❌ Error fetching user data:', error);
          // Fallback sur les données du token en cas d'erreur
          setCurrentUser(authUser as any);
        } finally {
          setIsLoadingUser(false);
        }
      } else {
        setCurrentUser(null);
      }
    };

    fetchUserData();
  }, [isAuthenticated, authUser?._id]);

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleSignup = () => {
    router.push("/auth/register");
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    router.push("/");
  };

  const handleProfile = () => {
    router.push("/tableau-de-bord/profile");
  };

  const handleDashboard = () => {
    router.push("/tableau-de-bord");
  };

  // Afficher un skeleton pendant le chargement
  if (isLoading || (isAuthenticated && isLoadingUser)) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                YourCrush
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              YourCrush
            </Link>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">
              Accueil
            </Link>
            <Link href="#apropos" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">
              À propos
            </Link>
            <Link href="#contact" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">
              Contact
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={handleLogin}>
                  Se connecter
                </Button>
                <Button onClick={handleSignup}>
                  S&apos;inscrire
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                      <AvatarFallback>
                        {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfile}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDashboard}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-2 mb-4">
              <Link href="/" className="px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
                Accueil
              </Link>
              <Link href="#apropos" className="px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
                À propos
              </Link>
              <Link href="#contact" className="px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
                Contact
              </Link>
            </div>
            
            {/* Mobile Auth Buttons */}
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogin}>
                  Se connecter
                </Button>
                <Button className="w-full" onClick={handleSignup}>
                  S&apos;inscrire
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {currentUser && (
                  <div className="px-4 py-2 mb-2 border-b">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                )}
                <Button variant="ghost" className="w-full justify-start" onClick={handleProfile}>
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={handleDashboard}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}