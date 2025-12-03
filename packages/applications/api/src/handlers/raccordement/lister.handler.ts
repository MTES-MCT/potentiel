import { mediator } from 'mediateur';
import { Temporal } from 'temporal-polyfill';

import { Lauréat } from '@potentiel-domain/projet';
import { HttpContext, Raccordement } from '@potentiel-applications/api-documentation';

import { getUtilisateur, mapToRangeOptions } from '#helpers';

import { ForbiddenError } from '../../errors.js';

export const listerHandler: Raccordement<HttpContext>['lister'] = async (ctx, options) => {
  const utilisateur = getUtilisateur();
  if (!utilisateur.estGrd()) {
    throw new ForbiddenError(
      'Cette opération ne peut être réalisée que par un gestionnaire de réseau.',
    );
  }
  const { page } = options ?? {};

  // FIXME: typespec ne gère pas bien le booléen opetionnel dans les query params
  const avecDateMiseEnService =
    new URLSearchParams(ctx.request.url!.split('?')[1]).get('avecDateMiseEnService') ?? undefined;

  const result = await mediator.send<Lauréat.Raccordement.ListerDossierRaccordementQuery>({
    type: 'Lauréat.Raccordement.Query.ListerDossierRaccordementQuery',
    data: {
      identifiantGestionnaireRéseau: utilisateur.identifiantGestionnaireRéseau,
      utilisateur: utilisateur.identifiantUtilisateur.email,
      avecDateMiseEnService:
        avecDateMiseEnService === 'true'
          ? true
          : avecDateMiseEnService === 'false'
            ? false
            : undefined,
      range: page
        ? mapToRangeOptions({
            currentPage: page,
            itemsPerPage: 50,
          })
        : undefined,
    },
  });

  return {
    ...result,
    items: result.items.map((dossier) => ({
      identifiantProjet: dossier.identifiantProjet.formatter(),

      appelOffre: dossier.appelOffre,
      periode: dossier.période,
      famille: dossier.famille,
      numeroCre: dossier.numéroCRE,

      nomProjet: dossier.nomProjet,
      commune: dossier.commune,
      codePostal: dossier.codePostal,
      siteProduction: dossier.siteProduction,

      nomCandidat: dossier.nomCandidat,
      puissance: dossier.puissance,
      sociétéMère: dossier.sociétéMère,
      emailContact: dossier.emailContact,
      dateNotification: Temporal.PlainDate.from(dossier.dateNotification.formatterDate()),
      referenceDossier: dossier.référenceDossier.formatter(),
      statutDgec: dossier.statutDGEC,
    })),
  };
};
