import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import { Routes } from '@potentiel-applications/routes';

import { apiAction } from '@/utils/apiAction';
import { getDashboardRoute } from '@/utils/getDashboardRoute';
import { getSessionUser } from '@/auth/getSessionUser';

export const GET = async (req: NextRequest) =>
  apiAction(async () => {
    const utilisateur = await getSessionUser(req);

    if (utilisateur) {
      redirect(getDashboardRoute(utilisateur.rôle).lien);
    }

    redirect(Routes.Auth.signIn());
  });

export const dynamic = 'force-dynamic';
