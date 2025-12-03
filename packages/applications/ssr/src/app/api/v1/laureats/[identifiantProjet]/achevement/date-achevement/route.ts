import { mediator } from 'mediateur';
import { NextRequest, NextResponse } from 'next/server';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

type RouteParams = {
  params: {
    identifiantProjet: string;
  };
};

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateAchevement: zod.iso.date(),
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
      const { identifiantProjet, dateAchevement } = result.data;

      await mediator.send<Lauréat.Achèvement.TransmettreDateAchèvementUseCase>({
        type: 'Lauréat.Achèvement.UseCase.TransmettreDateAchèvement',
        data: {
          identifiantProjetValue: identifiantProjet,
          dateAchèvementValue: DateTime.convertirEnValueType(new Date(dateAchevement).toISOString())
            .définirHeureÀMidi()
            .formatter(),
          transmiseLeValue: new Date().toISOString(),
          transmiseParValue: utilisateur.identifiantUtilisateur.formatter(),
        },
      });

      return new NextResponse(null, { status: 200 });
    }),
  );
