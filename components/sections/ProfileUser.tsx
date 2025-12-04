"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDecodeToken } from '@/hooks/useDecodeToken';
import { UserRepoAPI } from '@/infrastructures/repository/UserRepoAPI';
import { UserType } from '@/domains/models/User';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Mail, Shield, Calendar, Save, X, Edit2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileUser() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const { decodedToken } = useDecodeToken();
  
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // États du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // Rediriger si non authentifié
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Charger les données du profil en utilisant l'ID du token
  useEffect(() => {
    const loadUserProfile = async () => {
      // 🔥 Utiliser l'ID du token décodé
      const userId = decodedToken?.id || authUser?._id;
      
      console.log("🔍 Loading profile...");
      console.log("👤 Auth user:", authUser);
      console.log("🎫 Decoded token:", decodedToken);
      console.log("🆔 User ID to use:", userId);
      
      if (!userId || userId === "") {
        console.error("❌ No valid user ID!");
        setError("ID utilisateur invalide. Veuillez vous reconnecter.");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError('');
        
        const userData = await UserRepoAPI.getById(userId);
        console.log("✅ Profile loaded:", userData);
        
        setUserProfile(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
        });
      } catch (err: unknown) {
        if (err instanceof Error) 
        {
        console.error('❌ Error loading profile:', err);
        setError('Erreur lors du chargement du profil');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && (decodedToken?.id || authUser?._id)) {
      loadUserProfile();
    }
  }, [decodedToken?.id, authUser?._id, isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    const userId = decodedToken?.id || userProfile?._id;
    
    if (!userId) {
      setError("ID utilisateur introuvable");
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      const updatedUser = await UserRepoAPI.update(userId, {
        name: formData.name,
        email: formData.email,
      });

      setUserProfile(updatedUser);
      setIsEditing(false);
      setSuccess('Profil mis à jour avec succès !');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
        if (err instanceof Error) 
        {
            console.error("❌ Erreur:", err);
        }
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
      });
    }
    setIsEditing(false);
    setError('');
  };

  // Afficher le loader pendant le chargement
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-slate-600 dark:text-slate-400">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // Si pas d'utilisateur
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Impossible de charger le profil utilisateur"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Mon Profil</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Gérez vos informations personnelles
          </p>
        </div>

        {/* Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500 text-green-700 dark:text-green-400">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Carte Avatar et Infos de base */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="https://github.com/shadcn.png" alt={userProfile.name} />
                  <AvatarFallback className="text-3xl">
                    {userProfile.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2 mt-2">
                <Shield className="h-4 w-4" />
                {userProfile.role}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="h-4 w-4" />
                <span className="truncate">{userProfile.email}</span>
              </div>
              {userProfile.createdAt && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Membre depuis {new Date(userProfile.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Carte Informations détaillées */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Modifiez vos informations de profil
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nom complet
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    placeholder="Votre nom"
                  />
                ) : (
                  <p className="text-slate-900 dark:text-slate-100 font-medium">
                    {userProfile.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Adresse email
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    placeholder="votre@email.com"
                  />
                ) : (
                  <p className="text-slate-900 dark:text-slate-100 font-medium">
                    {userProfile.email}
                  </p>
                )}
              </div>

              {/* Rôle (non modifiable) */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Rôle
                </Label>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {userProfile.role}
                  </span>
                  <span className="text-sm text-slate-500">
                    (Non modifiable)
                  </span>
                </div>
              </div>

              {/* ID Utilisateur */}
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">ID Utilisateur</Label>
                <p className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded">
                  {userProfile._id || decodedToken?.id}
                </p>
              </div>

              {/* Boutons d'action */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    disabled={isSaving}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}