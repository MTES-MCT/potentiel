import { mediator } from 'mediateur';
import { cache } from 'react';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { ConsulterNombreDemandesÀInstruireQuery } from '@potentiel-domain/projet';

export type NombreDemandesÀInstruire = {
  domain: AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction;
  total: number;
  new: number;
};

export const getNombreDemandesÀInstruire = cache(
  async (utilisateur: string, rôle: 'dreal' | 'dgec'): Promise<Array<NombreDemandesÀInstruire>> => {
    const demandes = await mediator.send<ConsulterNombreDemandesÀInstruireQuery>({
      type: 'Projet.Query.ConsulterNombreDemandesÀInstruire',
      data: {
        utilisateur,
        autoritéCompétente: rôle,
      },
    });

    return Object.entries(demandes).map(([domain, résultat]) => ({
      domain: domain as AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction,
      total: résultat.total,
      new: résultat.new,
    }));
  },
);
