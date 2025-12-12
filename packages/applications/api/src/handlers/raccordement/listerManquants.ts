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
      appelOffre: dossier.identifiantProjet.appelOffre,
      periode: dossier.identifiantProjet.période,
      famille: dossier.identifiantProjet.famille,
      numeroCre: dossier.identifiantProjet.numéroCRE,
      siteDeProduction: {
        adresse1: dossier.localité.adresse1,
        adresse2: dossier.localité.adresse2,
        codePostal: dossier.localité.codePostal,
        commune: dossier.localité.commune,
        departement: dossier.localité.département,
        region: dossier.localité.région,
      },
      statut: dossier.statut.formatter(),
      referenceDossier: '',
      puissance: dossier.puissance,
      unitePuissance: dossier.unitéPuissance.formatter(),
      dateNotification: dossier.dateNotification.formatterDate(),
      emailContact: dossier.emailContact,
      nomCandidat: dossier.nomCandidat,
      societeMere: dossier.sociétéMère,
    })),
  };
};
