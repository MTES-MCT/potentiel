// cahier des charges
// abandon en cours
// abandon tout court
// garanties fianncière
// raccordement
// la frise

import { mediator } from 'mediateur';

import { Lauréat, IdentifiantProjet, Candidature } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import {
  getTypologieInstallation,
  getDispositifDeStockage,
} from '@potentiel-infrastructure/ds-api-client/src/_helpers';
import { getCahierDesCharges } from '../../../../_helpers';
import { checkLauréatSansAbandonOuAchèvement } from '../../_helpers/checkLauréatSansAbandonOuAchèvement';
import { ChampsAvecAction } from '../../_helpers/types';

export type GetInstallationForProjectPage = {
  typologieInstallation?: ChampsAvecAction<Candidature.TypologieInstallation.RawType[]>;
  installateur?: ChampsAvecAction<string>;
  dispositifDeStockage?: ChampsAvecAction<Lauréat.Installation.DispositifDeStockage.RawType>;
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
};

export const getTableauDeBordData = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetInstallationForProjectPage> => {
  // utiliser ça, avec un objet, à voir si il faut toucher à cette fonction
  const estUnLauréatSansAbandonOuAchèvement =
    await checkLauréatSansAbandonOuAchèvement(identifiantProjet);

  // cahier des charges
  const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

  // Abandon
  const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterAbandon',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  if (Option.isNone(abandon)) {
    return undefined;
  }

  const { statut } = abandon;

  if (statut.estEnCours() || statut.estRejeté() || statut.estAccordé()) {
    return abandon;
  }

  // Achèvement
  const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
    type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  Option.isSome(achèvement) && achèvement.dateAchèvementPrévisionnel && achèvement.estAchevé && achèvement.dateAchèvementRéel

  // Raccordement
  const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
    type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
    },
  });

  if (Option.isNone(raccordement)) {
    throw new Error('Raccordement non trouvé');
  



  return data;
};

// Cahier des charges


// Raccordement
// Alerte moins violente, dans sa section

// Alerte Achèvement (la retrouver ?)
// est achevé => demandes pas possible
// transmission docs sinon 

// Abandon alerte
// A une demande d'abandon en cours
// Est abandonnée

// Frise Besoin
// Date notification
// Date abandon accordée
// Date demande recours accordée
// Date achèvement prévisionnel
// Dossiers raccordement
// Achèvement réel
const étapes: EtapesProjetProps['étapes'] = [
  {
    type: 'designation',
    date: project.notifiedOn,
  },
];

if (abandon?.demande.accord) {
  étapes.push({
    type: 'abandon',
    date: DateTime.bind(abandon.demande.accord?.accordéLe).date.getTime(),
  });
} else {
  if (demandeRecours?.demande.accord) {
    étapes.push({
      type: 'recours',
      date: DateTime.bind(demandeRecours.demande.accord?.accordéLe).date.getTime(),
    });
  }

  étapes.push({
    type: 'achèvement-prévisionel',
    date: dateAchèvementPrévisionnel,
  });

  const dernierDossierRaccordement = Option.match(raccordement.raccordement)
    .some(({ dossiers }) => (dossiers.length > 0 ? dossiers[dossiers.length - 1] : undefined))
    .none(() => undefined);

  if (dernierDossierRaccordement?.miseEnService?.dateMiseEnService) {
    étapes.push({
      type: 'mise-en-service',
      date: DateTime.bind(
        dernierDossierRaccordement.miseEnService.dateMiseEnService,
      ).date.getTime(),
    });
  }

  if (achèvementRéel) {
    étapes.push({
      type: 'achèvement-réel',
      date: achèvementRéel.date,
    });
  }
}


