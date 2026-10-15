import { mediator } from 'mediateur';
import { cache } from 'react';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import type { ListerDemandesEnInstructionQuery } from '@potentiel-domain/projet';

export type DemandesEnInstruction = {
  domain: AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction;
  total: number;
  new: number;
};

export const getNombreDemandesEnInstruction = cache(
  async (utilisateur: string, rôle: 'dreal' | 'dgec'): Promise<Array<DemandesEnInstruction>> => {
    const ilYAUnMois = DateTime.now().retirerNombreDeMois(1);

    const demandes = await await mediator.send<ListerDemandesEnInstructionQuery>({
      type: 'Projet.Query.ListerDemandesEnInstruction',
      data: {
        utilisateur,
        autoritéCompétente: rôle,
      },
    });

    return Object.entries(demandes.items).map(([domain, résultat]) => ({
      domain: domain as AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction,
      total: résultat.length,
      new: résultat.filter((d) => d.date.estUltérieureÀ(ilYAUnMois)).length,
    }));
  },
);
