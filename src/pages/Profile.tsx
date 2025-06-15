
import React from "react";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Profile() {
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Editar Perfil</h2>
        <ProfileEditForm />
      </div>
    </ProtectedRoute>
  );
}
