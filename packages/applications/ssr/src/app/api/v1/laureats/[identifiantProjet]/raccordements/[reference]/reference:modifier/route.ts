import { mediator } from 'mediateur';
import { NextRequest, NextResponse } from 'next/server';
import * as zod from 'zod';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

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
  nouvelleReference: zod.string().min(1),
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
        await mediator.send<Lauréat.Raccordement.RaccordementUseCase>({
          type: 'Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet,
            référenceDossierRaccordementActuelleValue: reference,
            nouvelleRéférenceDossierRaccordementValue: nouvelleReference,
            rôleValue: utilisateur.role.nom,
            modifiéeLeValue: DateTime.now().formatter(),
            modifiéeParValue: utilisateur.identifiantUtilisateur.formatter(),
          },
        });

        return new NextResponse(null, { status: 200 });
      }

      return NextResponse.json(
        {
          error: result.error.format(),
        },
        {
          status: 400,
        },
      );
    });
  });
