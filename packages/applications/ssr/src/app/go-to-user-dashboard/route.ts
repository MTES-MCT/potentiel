import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getContext } from '@potentiel-applications/request-context';

import { apiAction } from '@/utils/apiAction';

export const GET = async () =>
  apiAction(() => {
    const utilisateur = getContext()?.utilisateur;
    if (utilisateur) {
      const redirectTo = utilisateur.role.estÉgaleÀ(Role.grd)
        ? Routes.Raccordement.lister
        : Routes.Lauréat.lister();
      redirect(redirectTo);
    }
    redirect(Routes.Auth.signIn());
  });

export const dynamic = 'force-dynamic';
