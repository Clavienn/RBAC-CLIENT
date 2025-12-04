"use client"
import { useState } from "react";
import { UserRepoAPI } from "@/infrastructures/repository/UserRepoAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { debugAuth } from "@/lib/auth";

export default function Login() {
  const navigate = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("🚀 Starting login...");
      
      // Appel API
      const response = await UserRepoAPI.login({ email, password });
      
      console.log("📥 Login API Response:", response);
      console.log("👤 User data:", response.user);
      console.log("🔑 Token:", response.token);
      
      // Vérifier que les données sont bien sauvegardées
      setTimeout(() => {
        const authState = debugAuth();
        console.log("🔍 Auth state after login:", authState);
        
        if (authState.token && authState.user) {
          console.log("✅ Login successful, redirecting...");
          navigate.push("/tableau-de-bord");
        } else {
          console.error("❌ Auth state is empty after login!");
          setError("Erreur lors de la sauvegarde des données de connexion");
        }
      }, 200);
      
    } catch (err: any) {
      console.error("❌ Login error:", err);
      console.error("❌ Error details:", err?.response?.data);
      setError(
        err?.response?.data?.message || "Échec de la connexion. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Connexion
          </CardTitle>
          <CardDescription className="text-center">
            Entrez vos identifiants pour accéder à votre compte
          </CardDescription>
        </CardHeader>
        <div>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </CardContent>
        </div>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-slate-600 text-center">
            Pas encore de compte ?{" "}
            <button
              onClick={() => navigate.push("/auth/register")}
              className="text-blue-600 hover:underline font-medium"
              disabled={isLoading}
            >
              Créer un compte
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}