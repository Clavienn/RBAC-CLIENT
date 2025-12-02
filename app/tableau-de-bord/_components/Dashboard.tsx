import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Shield,
  Activity,
  Settings,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Dashboard User
          </h1>
          <p className="text-slate-600 mt-2 text-lg">
            Bienvenue sur votre tableau de bord RBAC
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Utilisateurs
              </CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">248</div>
              <p className="text-xs text-slate-500 mt-1">+12% ce mois</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Administrateurs
              </CardTitle>
              <Shield className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">12</div>
              <p className="text-xs text-slate-500 mt-1">Accès complet</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Activité
              </CardTitle>
              <Activity className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">1,284</div>
              <p className="text-xs text-slate-500 mt-1">Actions aujourd&apos;hui</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Système
              </CardTitle>
              <Settings className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">99.9%</div>
              <p className="text-xs text-slate-500 mt-1">Disponibilité</p>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Gestion RBAC complète
                </h2>
                <p className="text-blue-100 mb-4">
                  Contrôlez les accès et permissions de votre système en toute simplicité
                </p>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Gérer les utilisateurs
                </button>
              </div>
              <Shield className="h-32 w-32 text-blue-400 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                Utilisateurs
              </h3>
              <p className="text-sm text-slate-600">
                Gérer les comptes et profils
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                Permissions
              </h3>
              <p className="text-sm text-slate-600">
                Configurer les rôles
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Activity className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                Logs d&apos;activité
              </h3>
              <p className="text-sm text-slate-600">
                Suivre les actions système
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}