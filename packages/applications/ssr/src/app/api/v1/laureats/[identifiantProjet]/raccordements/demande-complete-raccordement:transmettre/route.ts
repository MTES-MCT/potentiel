import { mediator } from 'mediateur';
import { NextRequest, NextResponse } from 'next/server';
import * as zod from 'zod';

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
  dateAccuseReception: zod.string().min(1),
});

export const POST = (request: NextRequest, routeParams: RouteParams) =>
  apiAction(async () =>
    withUtilisateur(async (utilisateur) => {
      const result = schema.safeParse({
        ...(await request.json()),
        ...routeParams.params,
      });
      if (!result.success) {
        return NextResponse.json(
          {
            error: result.error.format(),
          },
          {
            status: 400,
          },
        );
      }
      const { dateAccuseReception, identifiantProjet, reference } = result.data;
      await mediator.send<Lauréat.Raccordement.TransmettreDemandeComplèteRaccordementUseCase>({
        type: 'Lauréat.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet,
          référenceDossierValue: reference,
          dateQualificationValue: new Date(dateAccuseReception).toISOString(),
          transmiseParValue: utilisateur.identifiantUtilisateur.formatter(),
        },
      });
      return new NextResponse(null, { status: 200 });
    }),
  );
