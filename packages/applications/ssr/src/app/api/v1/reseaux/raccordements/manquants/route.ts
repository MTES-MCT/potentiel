import { mediator } from 'mediateur';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { RangeOptions } from '@potentiel-domain/entity';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { apiAction } from '@/utils/apiAction';
import { mapToRangeOptions } from '@/utils/pagination';

export const dynamic = 'force-dynamic';

const routeParamsSchema = z.object({
  page: z.coerce.number().int().optional(),
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
      const { page } = routeParamsSchema.parse(Object.fromEntries(searchParams.entries()));

      const identifiantGestionnaireRéseau =
        récupérerIdentifiantGestionnaireUtilisateur(utilisateur);

      const result =
        await mediator.send<Lauréat.Raccordement.ListerDossierRaccordementManquantsQuery>({
          type: 'Lauréat.Raccordement.Query.ListerDossierRaccordementManquantsQuery',
          data: {
            identifiantGestionnaireRéseau,
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

const récupérerIdentifiantGestionnaireUtilisateur = (utilisateur: Utilisateur.ValueType) => {
  if (!utilisateur.role.estÉgaleÀ(Role.grd)) {
    return;
  }
  if (Option.isNone(utilisateur.identifiantGestionnaireRéseau)) {
    return '!!GESTIONNAIRE INCONNU!!';
  }

  return utilisateur.identifiantGestionnaireRéseau;
};

type MapToApiResponse = (
  dossiers: Lauréat.Raccordement.ListerDossierRaccordementManquantsReadModel,
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
    referenceDossier: '',
    puissance: dossier.puissance,
    dateNotification: dossier.dateNotification,
    emailContact: dossier.emailContact,
    nomCandidat: dossier.nomCandidat,
    siteProduction: dossier.siteProduction,
    sociétéMère: dossier.sociétéMère,
  })),
});
