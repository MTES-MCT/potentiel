import { mediator } from 'mediateur';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

import { Option } from '@potentiel-libraries/monads';
import { Raccordement } from '@potentiel-domain/reseau';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { apiAction } from '@/utils/apiAction';
import { mapToRangeOptions } from '@/utils/pagination';

export const dynamic = 'force-dynamic';

const routeParamsSchema = z.object({
  page: z.coerce.number().int().optional(),
  avecDateMiseEnService: z
    .string()
    .optional()
    .refine((value) => value === 'true' || value === 'false' || value === undefined, {
      message: "Le paramètre avecDateMiseEnService doit être 'true' ou 'false'",
    })
    .transform((value) => (value === 'true' ? true : value === 'false' ? false : undefined)),
});

export const GET = (request: NextRequest) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const { searchParams } = new URL(request.url);
      const { avecDateMiseEnService, page } = routeParamsSchema.parse(
        Object.fromEntries(searchParams.entries()),
      );
      const result = await mediator.send<Raccordement.ListerDossierRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ListerDossierRaccordementQuery',
        data: {
          identifiantGestionnaireRéseau: récupérerIdentifiantGestionnaireUtilisateur(utilisateur),
          avecDateMiseEnService,
          range: page
            ? mapToRangeOptions({
                currentPage: page,
              })
            : undefined,
        },
      });
      return NextResponse.json(result);
    }),
  );

const récupérerIdentifiantGestionnaireUtilisateur = (utilisateur: Utilisateur.ValueType) => {
  if (!utilisateur.role.estÉgaleÀ(Role.grd)) {
    return;
  }
  if (Option.isNone(utilisateur.groupe)) {
    return 'inconnu';
  }
  if (utilisateur.groupe.type !== 'GestionnairesRéseau') {
    return 'inconnu';
  }
  return utilisateur.groupe.nom;
};
