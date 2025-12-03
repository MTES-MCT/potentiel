import { mediator } from 'mediateur';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

import { Lauréat } from '@potentiel-domain/projet';
import { RangeOptions } from '@potentiel-domain/entity';

import { apiAction } from '@/utils/apiAction';
import { mapToRangeOptions } from '@/utils/pagination';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const dynamic = 'force-dynamic';

const routeParamsSchema = z.object({
  page: z.coerce.number().int().optional(),
  appelOffre: z.string().optional(),
  periode: z.string().optional(),
});

type AchèvementEnAttenteApiResponse = {
  identifiantProjet: string;
  identifiantGestionnaireReseau: string;
  referenceDossierRaccordement: string;
  dateDCR?: string;
  appelOffre: string;
  periode: string;
  codePostal: string;
  prix: number;
  coefficientKChoisi: boolean;
};

type ApiResponse = {
  items: AchèvementEnAttenteApiResponse[];
  range: RangeOptions;
  total: number;
};

export const GET = (request: NextRequest) =>
  apiAction(async () =>
    withUtilisateur(async () => {
      const { searchParams } = new URL(request.url);
      const { page, appelOffre, periode } = routeParamsSchema.parse(
        Object.fromEntries(searchParams.entries()),
      );

      const result = await mediator.send<Lauréat.Achèvement.ListerAchèvementEnAttenteQuery>({
        type: 'Lauréat.Achèvement.Query.ListerAchèvementEnAttente',
        data: {
          appelOffre,
          periode,
          range: page
            ? mapToRangeOptions({
                currentPage: page,
                itemsPerPage: 50,
              })
            : undefined,
        },
      });

      return NextResponse.json(mapToApiResponse(result));
    }),
  );

type MapToApiResponse = (
  dossiers: Lauréat.Achèvement.ListerAchèvementEnAttenteReadModel,
) => ApiResponse;

const mapToApiResponse: MapToApiResponse = ({ items, range, total }) => ({
  total,
  range,
  items: items.map(
    ({
      identifiantProjet,
      identifiantGestionnaireReseau,
      appelOffre,
      periode,
      codePostal,
      referenceDossierRaccordement,
      dateDCR,
      prix,
      coefficientKChoisi,
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      identifiantGestionnaireReseau: identifiantGestionnaireReseau.formatter(),
      appelOffre,
      periode,
      referenceDossierRaccordement,
      dateDCR: dateDCR?.formatterDate(),
      codePostal,
      prix,
      coefficientKChoisi,
    }),
  ),
});
