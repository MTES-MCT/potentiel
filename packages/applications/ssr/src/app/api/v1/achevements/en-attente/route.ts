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
  appelOffreId: z.string().optional(),
  periodeId: z.string().optional(),
});

type AchèvementEnAttenteApiResponse = {
  referenceDossierRaccordement: string;
  identifiantProjet: string;
  appelOffre: string;
  dateDCR: string;
  codePostalInstallation: string;
  periode: string;
  identifiantGestionnaireRéseau: string;
  prix: number;
  souhaitIndexationCoefficientK: string;
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
      const { page, appelOffreId, periodeId } = routeParamsSchema.parse(
        Object.fromEntries(searchParams.entries()),
      );

      const result = await mediator.send<Lauréat.Achèvement.ListerAchèvementEnAttenteQuery>({
        type: 'Lauréat.Achèvement.Query.ListerAchèvementEnAttente',
        data: {
          appelOffreId,
          periodeId,
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
  items: items.map((item) => ({
    appelOffre: item.appelOffre,
    codePostalInstallation: item.codePostalInstallation,
    dateDCR: item.dateDCR?.formatterDate() ?? '',
    identifiantGestionnaireRéseau: item.identifiantGestionnaireRéseau.formatter(),
    identifiantProjet: item.identifiantProjet.formatter(),
    periode: item.période,
    prix: item.prix,
    referenceDossierRaccordement: item.referenceDossierRaccordement,
    souhaitIndexationCoefficientK: item.souhaitIndexationCoefficientK ? 'oui' : '',
  })),
});
