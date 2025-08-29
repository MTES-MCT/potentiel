import { z } from 'zod';
import { NextApiRequest, NextApiResponse } from 'next';

import { Lauréat } from '@potentiel-domain/projet';
import {
  createPotentielApiRouter,
  DossierRaccordement,
  DossierRaccordementListResult,
} from '@potentiel-applications/api-documentation';

export const dynamic = 'force-dynamic';

const routeParamsSchema = z.object({
  page: z.coerce.number().int().optional(),
  avecDateMiseEnService: z.stringbool().optional(),
});

export const GET = (request: NextApiRequest, response: NextApiResponse) =>
  // apiAction(() =>
  // withUtilisateur(async (utilisateur) => {
  {
    const router = createPotentielApiRouter(
      {
        lister: async () => ({ message: '' }),
        modifierReference: async () => ({ message: '' }),
        transmettreDateMiseEnService: async () => ({ message: '' }),
      },
      {
        listerEnAttente: async () => ({ message: '' }),
        transmettreDateDAchevement: async () => ({ message: '' }),
      },
      {
        confirmer: async () => ({ message: '' }),
        listerEnAttenteConfirmation: async () => ({ message: '' }),
      },
      { get: async () => ({ message: '' }), getParReference: async () => ({ message: '' }) },
    );
    router.dispatch(request, response);
  };
// }),
// );

// const { searchParams } = new URL(request.url);
// const { avecDateMiseEnService, page } = routeParamsSchema.parse(
//   Object.fromEntries(searchParams.entries()),
// );
// const result = await mediator.send<Lauréat.Raccordement.ListerDossierRaccordementQuery>({
//   type: 'Lauréat.Raccordement.Query.ListerDossierRaccordementQuery',
//   data: {
//     identifiantGestionnaireRéseau: récupérerIdentifiantGestionnaireUtilisateur(utilisateur),
//     utilisateur: utilisateur.identifiantUtilisateur.email,
//     avecDateMiseEnService,
//     range: page
//       ? mapToRangeOptions({
//           currentPage: page,
//           itemsPerPage: 50,
//         })
//       : undefined,
//   },
// });
// return NextResponse.json(mapToApiResponse(result));
//   }),
// );

type MapToApiResponse = (
  dossiers: Lauréat.Raccordement.ListerDossierRaccordementReadModel,
) => DossierRaccordementListResult;

const mapToApiResponse: MapToApiResponse = ({ items, range, total }) => ({
  total,
  range,
  items: items.map((dossier) =>
    DossierRaccordement.toJsonObject({
      ...dossier,
      identifiantProjet: dossier.identifiantProjet.formatter(),
      periode: dossier.période,
      numeroCre: dossier.numéroCRE,
      statutDgec: dossier.statutDGEC,
      referenceDossier: dossier.référenceDossier.formatter(),
    }),
  ),
});
