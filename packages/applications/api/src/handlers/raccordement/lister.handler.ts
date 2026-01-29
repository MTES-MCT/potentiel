import { mediator } from 'mediateur';

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
  const { after, avecDateMiseEnService } = options ?? {};

  const result = await mediator.send<Lauréat.Raccordement.ListerDossierRaccordementQuery>({
    type: 'Lauréat.Raccordement.Query.ListerDossierRaccordementQuery',
    data: {
      identifiantGestionnaireRéseau: utilisateur.identifiantGestionnaireRéseau,
      utilisateur: utilisateur.identifiantUtilisateur.email,
      avecDateMiseEnService,
      range: mapToRangeOptions(after),
    },
  });

  return {
    ...result,
    items: result.items.map((dossier) => ({
      identifiantProjet: dossier.identifiantProjet.formatter(),

      appelOffre: dossier.identifiantProjet.appelOffre,
      periode: dossier.identifiantProjet.période,
      famille: dossier.identifiantProjet.famille,
      numeroCre: dossier.identifiantProjet.numéroCRE,

      nomProjet: dossier.nomProjet,

      nomCandidat: dossier.nomCandidat,
      puissance: dossier.puissance,
      unitePuissance: dossier.unitéPuissance.formatter(),
      societeMere: dossier.sociétéMère,
      emailContact: dossier.emailContact,
      dateNotification: dossier.dateNotification.formatterDate(),
      referenceDossier: dossier.référenceDossier.formatter(),
      statut: dossier.statutProjet.formatter(),
      siteDeProduction: {
        adresse1: dossier.localité.adresse1,
        adresse2: dossier.localité.adresse2,
        codePostal: dossier.localité.codePostal,
        commune: dossier.localité.commune,
        departement: dossier.localité.département,
        region: dossier.localité.région,
      },
    })),
  };
};
