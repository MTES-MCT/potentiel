import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';

import { withUtilisateur } from '@/utils/withUtilisateur';

export const GET = async () =>
  withUtilisateur(async ({ role }) => {
    const redirectTo = role.estÉgaleÀ(Role.grd)
      ? Routes.Raccordement.lister
      : Routes.Projet.lister();
    redirect(redirectTo);
  });
