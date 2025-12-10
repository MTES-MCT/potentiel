import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';
import { Raccordement } from '@potentiel-applications/api-documentation';

import { getUtilisateur, mapToRangeOptions } from '#helpers';

export const listerManquantsHandlers: Raccordement['listerManquants'] = async (_, options) => {
  const utilisateur = getUtilisateur();
  const { after } = options ?? {};

  const result = await mediator.send<Lauréat.Raccordement.ListerDossierRaccordementManquantsQuery>({
    type: 'Lauréat.Raccordement.Query.ListerDossierRaccordementManquantsQuery',
    data: {
      identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
      range: mapToRangeOptions(after),
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
      dateNotification: dossier.dateNotification.formatterDate(),
      emailContact: dossier.emailContact,
      nomCandidat: dossier.nomCandidat,
      siteProduction: dossier.siteProduction,
      societeMere: dossier.sociétéMère,
    })),
  };
};
