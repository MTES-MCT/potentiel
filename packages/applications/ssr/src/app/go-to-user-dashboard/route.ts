import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import { Routes } from '@potentiel-applications/routes';

import { getSessionUser } from '@/auth/getSessionUser';
import { apiAction } from '@/utils/apiAction';
import { getDashboardRoute } from '@/utils/getDashboardRoute';

export const GET = async ({ headers }: NextRequest) =>
  apiAction(async () => {
    const utilisateur = await getSessionUser({ headers });

    if (utilisateur) {
      redirect(getDashboardRoute(utilisateur.rôle).lien);
    }

    redirect(Routes.Auth.signIn());
  });

export const dynamic = 'force-dynamic';
