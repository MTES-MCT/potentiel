import { mediator } from 'mediateur';
import { NextRequest, NextResponse } from 'next/server';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';
import { InvalidOperationError } from '@potentiel-domain/core';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

type RouteParams = {
  params: {
    identifiantProjet: string;
    reference: string;
  };
};

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  reference: zod.string().min(1),
  nouvelleReference: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export const POST = (request: NextRequest, routeParams: RouteParams) =>
  apiAction(async () => {
    return withUtilisateur(async (utilisateur) => {
      const result = schema.safeParse({
        ...(await request.json()),
        ...routeParams.params,
      });

      if (result.success) {
        const { nouvelleReference, identifiantProjet, reference } = result.data;
        await mediator.send<Raccordement.RaccordementUseCase>({
          type: 'Réseau.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet,
            référenceDossierRaccordementActuelleValue: reference,
            nouvelleRéférenceDossierRaccordementValue: nouvelleReference,
            rôleValue: utilisateur.role.nom,
          },
        });

        return new NextResponse(null, { status: 200 });
      }

      // TODO manage validation error for API.
      throw new InvalidOperationError(result.error.message);
    });
  });
