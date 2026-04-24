import { notFound, redirect } from 'next/navigation';

import { ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { Routes } from '@potentiel-applications/routes';

import { apiAction } from '@/utils/apiAction';

/** Redirection de la page projet Legacy */
export const GET = async (_: Request, ctx: RouteContext<'/legacy/[guid]'>) => {
  const params = await ctx.params;

  return apiAction(async () => {
    const identifiantProjet = await ProjetAdapter.getIdentifiantProjetFromLegacyId(params.guid);

    if (!identifiantProjet) {
      notFound();
    }
    return redirect(Routes.Projet.details(identifiantProjet));
  });
};
