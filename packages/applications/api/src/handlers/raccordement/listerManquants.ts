import { mediator } from 'mediateur';
import { Temporal } from 'temporal-polyfill';

import { Lauréat } from '@potentiel-domain/projet';
import { HttpContext, Raccordement } from '@potentiel-applications/api-documentation';

import { getUtilisateur, mapToRangeOptions } from '#helpers';

export const listerManquantsHandlers: Raccordement<HttpContext>['listerManquants'] = async (
  _,
  options,
) => {
  const utilisateur = getUtilisateur();
  const { page } = options ?? {};

  const result = await mediator.send<Lauréat.Raccordement.ListerDossierRaccordementManquantsQuery>({
    type: 'Lauréat.Raccordement.Query.ListerDossierRaccordementManquantsQuery',
    data: {
      identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
      range: mapToRangeOptions(page),
    },
  });

  return {
    total: result.total,
    range: result.range,
    items: result.items.map((dossier) => ({
      identifiantProjet: dossier.identifiantProjet.formatter(),
      nomProjet: dossier.nomProjet,
      appelOffre: dossier.appelOffre,
      periode: dossier.période,
      famille: dossier.famille,
      numeroCre: dossier.numéroCRE,
      commune: dossier.commune,
      codePostal: dossier.codePostal,
      statutDgec: dossier.statutDGEC,
      referenceDossier: '',
      puissance: dossier.puissance,
      dateNotification: Temporal.PlainDate.from(dossier.dateNotification.formatterDate()),
      emailContact: dossier.emailContact,
      nomCandidat: dossier.nomCandidat,
      siteProduction: dossier.siteProduction,
      sociétéMère: dossier.sociétéMère,
    })),
  };
};
