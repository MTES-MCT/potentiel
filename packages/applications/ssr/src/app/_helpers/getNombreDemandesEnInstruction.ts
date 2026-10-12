// import { mediator } from 'mediateur';
// import { cache } from 'react';

import { mediator } from 'mediateur';
import { cache } from 'react';

import { DateTime } from '@potentiel-domain/common';
import type { ListerDemandesEnInstructionQuery } from '@potentiel-domain/projet';

type GetDemandesProps = {
  utilisateur: string;
  rôle: 'dreal' | 'dgec';
};

export const getNombreDemandesEnInstruction = cache(
  async ({ utilisateur, rôle }: GetDemandesProps) => {
    const ilYAUnMois = DateTime.now().retirerNombreDeMois(1);

    const demandes = await await mediator.send<ListerDemandesEnInstructionQuery>({
      type: 'Projet.Query.ListerDemandesEnInstruction',
      data: {
        utilisateur,
        autoritéCompétente: rôle,
      },
    });

    return Object.entries(demandes.items).map(([domain, résultat]) => ({
      domain,
      total: résultat.length,
      new: résultat.filter((d) => d.date.estUltérieureÀ(ilYAUnMois)).length,
    }));
  },
);
