import { mediator } from 'mediateur';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

import { Lauréat } from '@potentiel-domain/projet';
import { RangeOptions } from '@potentiel-domain/entity';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { apiAction } from '@/utils/apiAction';
import { mapToRangeOptions } from '@/utils/pagination';

export const dynamic = 'force-dynamic';

const routeParamsSchema = z.object({
  page: z.coerce.number().int().optional(),
  avecDateMiseEnService: z.stringbool().optional(),
});

type DossierRaccordementApiResponse = {
  nomProjet: string;
  identifiantProjet: string;
  appelOffre: string;
  periode: string;
  famille: string;
  numeroCRE: string;
  commune: string;
  codePostal: string;
  referenceDossier: string;
  statutDGEC: string;
  puissance: string;
  nomCandidat: string;
  sociétéMère: string;
  emailContact: string;
  siteProduction: string;
  dateNotification: string;
};

type ApiResponse = {
  items: DossierRaccordementApiResponse[];
  range: RangeOptions;
  total: number;
};

export const GET = (request: NextRequest) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const { searchParams } = new URL(request.url);
      const { avecDateMiseEnService, page } = routeParamsSchema.parse(
        Object.fromEntries(searchParams.entries()),
      );
      const result = await mediator.send<Lauréat.Raccordement.ListerDossierRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ListerDossierRaccordementQuery',
        data: {
          utilisateur: utilisateur.identifiantUtilisateur.email,
          avecDateMiseEnService,
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
  dossiers: Lauréat.Raccordement.ListerDossierRaccordementReadModel,
) => ApiResponse;

const mapToApiResponse: MapToApiResponse = ({ items, range, total }) => ({
  total,
  range,
  items: items.map((dossier) => ({
    identifiantProjet: dossier.identifiantProjet.formatter(),
    nomProjet: dossier.nomProjet,
    appelOffre: dossier.appelOffre,
    periode: dossier.période,
    famille: dossier.famille,
    numeroCRE: dossier.numéroCRE,
    commune: dossier.commune,
    codePostal: dossier.codePostal,
    statutDGEC: dossier.statutDGEC,
    referenceDossier: dossier.référenceDossier.formatter(),
    puissance: dossier.puissance,
    dateNotification: dossier.dateNotification,
    emailContact: dossier.emailContact,
    nomCandidat: dossier.nomCandidat,
    siteProduction: dossier.siteProduction,
    sociétéMère: dossier.sociétéMère,
  })),
});
