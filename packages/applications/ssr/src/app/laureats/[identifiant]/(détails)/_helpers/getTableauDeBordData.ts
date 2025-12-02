import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Lauréat, IdentifiantProjet, Candidature, Éliminé } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { getCahierDesCharges } from '../../../../_helpers';
import { ChampsAvecAction } from '../../_helpers/types';
import { getLauréatInfos } from '../../_helpers/getLauréat';

import { getRaccordementData } from './getRaccordementData';
import { getÉtapesData } from './getÉtapesData';

export type GetTableauDeBordDataForProjectPage = {
  typologieInstallation?: ChampsAvecAction<Candidature.TypologieInstallation.RawType[]>;
  installateur?: ChampsAvecAction<string>;
  dispositifDeStockage?: ChampsAvecAction<Lauréat.Installation.DispositifDeStockage.RawType>;
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
};

export const getTableauDeBordData = async ({ identifiantProjet, rôle }: Props) => {
  // cahier des charges
  const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

  console.log(cahierDesCharges);

  // Lauréat
  const lauréat = await getLauréatInfos({ identifiantProjet: identifiantProjet.formatter() });

  // Abandon
  const abandon = await getAbandon(identifiantProjet);

  // Achèvement
  const achèvement = await getAchèvement(identifiantProjet);

  // Raccordement
  const raccordement = await getRaccordementData({
    role: rôle,
    identifiantProjet,
    estAbandonné: !!abandon?.statut.estAccordé(),
    aUnAbandonEnCours: !!abandon?.statut.estEnCours(),
  });

  console.log(raccordement);

  const recours = await getRecours(identifiantProjet);

  const étapes = getÉtapesData({
    dateNotification: lauréat.notifiéLe,
    dateAchèvementPrévisionnel: achèvement.dateAchèvementPrévisionnel.dateTime,
    dateAbandonAccordé: abandon && abandon.demande.accord?.accordéLe,
    dateRecoursAccordé: recours && recours.demande.accord?.accordéLe,
    dateMiseEnService:
      raccordement.value && raccordement.value !== 'Champs non renseigné'
        ? raccordement.value.dateMiseEnService
        : undefined,
    dateAchèvementRéel: achèvement.estAchevé ? achèvement.dateAchèvementRéel : undefined,
  });

  console.log(étapes);

  // Cahier des charges

  // garanties financières

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
};

const getAbandon = async (identifiantProjet: IdentifiantProjet.ValueType) => {
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
};

const getAchèvement = async (identifiantProjet: IdentifiantProjet.ValueType) => {
  const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
    type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  if (Option.isNone(achèvement)) {
    return notFound();
  }

  return achèvement;
};

export const getRecours = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<Éliminé.Recours.ConsulterRecoursReadModel | undefined> => {
  const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
    type: 'Éliminé.Recours.Query.ConsulterRecours',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  if (Option.isNone(recours)) {
    return undefined;
  }

  return recours;
};
