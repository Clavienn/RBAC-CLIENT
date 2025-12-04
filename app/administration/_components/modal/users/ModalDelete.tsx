"use client";

import React, { useState } from "react";
import { UserRepoAPI } from "@/infrastructures/repository/UserRepoAPI";
import { UserType } from "@/domains/models/User";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

interface ModalDeleteUserProps {
  open: boolean;
  onClose: () => void;
  user: UserType;
  onSuccess: () => void;
}

export function ModalDeleteUser({
  open,
  onClose,
  user,
  onSuccess,
}: ModalDeleteUserProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);

    if (!user._id) {
      setError("ID utilisateur manquant");
      return;
    }

    try {
      setLoading(true);
      await UserRepoAPI.delete(user._id);
      onSuccess();
      onClose();
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            setError(
            error.response?.data?.message ||
                "Impossible de créer l'utilisateur"
            );
        } else if (error instanceof Error) {
            setError(error.message);
        } else {
            setError("Impossible de créer l'utilisateur");
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle>Supprimer l&apos;utilisateur</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-4">
            Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{" "}
            <span className="font-semibold text-foreground">{user.name}</span> (
            {user.email}) ?
            <br />
            <br />
            Cette action est <span className="font-semibold text-red-600">
              irréversible
            </span>{" "}
            et toutes les données associées seront définitivement supprimées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Supprimer définitivement
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}