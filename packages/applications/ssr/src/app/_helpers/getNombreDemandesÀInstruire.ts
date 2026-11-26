import { mediator } from 'mediateur';
import { cache } from 'react';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { ConsulterNombreDemandesÀInstruireQuery } from '@potentiel-domain/projet';
import type { UserFiltersType } from '@potentiel-domain/utilisateur';

export type NombreDemandesÀInstruire = {
  domain: AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction;
  total: number;
  new: number;
};

export const getNombreDemandesÀInstruire = cache(
  async (
    utilisateur: string,
    rôle: 'dreal' | 'dgec',
    filtres?: UserFiltersType,
  ): Promise<Array<NombreDemandesÀInstruire>> => {
    const demandes = await mediator.send<ConsulterNombreDemandesÀInstruireQuery>({
      type: 'Projet.Query.ConsulterNombreDemandesÀInstruire',
      data: {
        utilisateur,
        autoritéCompétente: rôle,
        filtres,
      },
    });

    return demandes;
  },
);
