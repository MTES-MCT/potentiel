import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';

import { getOptionalAuthenticatedUser } from '@/utils/getAuthenticatedUser.handler';

export const GET = async () => {
  const utilisateur = await getOptionalAuthenticatedUser();
  if (utilisateur) {
    const redirectTo = utilisateur.role.estÉgaleÀ(Role.grd)
      ? Routes.Raccordement.lister
      : Routes.Projet.lister();
    redirect(redirectTo);
  }
  redirect(Routes.Auth.signIn());
};
