import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { getContext } from '@potentiel-applications/request-context';

import { apiAction } from '@/utils/apiAction';
import { getDashboardRoute } from '@/utils/getDashboardRoute';

export const GET = async () =>
  apiAction(() => {
    const utilisateur = getContext()?.utilisateur;

    if (utilisateur) {
      redirect(getDashboardRoute(utilisateur.rôle).lien);
    }

    redirect(Routes.Auth.signIn());
  });

export const dynamic = 'force-dynamic';
