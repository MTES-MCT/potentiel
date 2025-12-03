import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Lauréat, IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { getLauréatInfos } from '../../_helpers/getLauréat';

import { getRaccordementData } from './getRaccordementData';
import { getÉtapesData } from './getÉtapesData';
import { getCahierDesChargesData } from './getCahierDesChargesData';
import { getAbandonAlert } from './getAbandonAlert';

// type

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
};

// garanties financières

// Alerte Achèvement (la retrouver ?)
// est achevé => demandes pas possible
// transmission docs sinon

// Abandon alerte
// A une demande d'abandon en cours
// Est abandonnée

export const getTableauDeBordData = async ({ identifiantProjet, rôle }: Props) => {
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

  const recours = await getRecours(identifiantProjet);

  const cahierDesChargesData = await getCahierDesChargesData({ identifiantProjet, rôle });

  const étapes = getÉtapesData({
    dateNotification: lauréat.notifiéLe.formatter(),
    dateAchèvementPrévisionnel: achèvement.dateAchèvementPrévisionnel.dateTime.formatter(),
    dateAbandonAccordé: abandon && abandon.demande.accord?.accordéLe.formatter(),
    dateRecoursAccordé: recours && recours.demande.accord?.accordéLe.formatter(),
    dateMiseEnService:
      raccordement.value && raccordement.value !== 'Champs non renseigné'
        ? raccordement.value.dateMiseEnService?.formatter()
        : undefined,
    dateAchèvementRéel: achèvement.estAchevé
      ? achèvement.dateAchèvementRéel.formatter()
      : undefined,
  });

  const abandonAlert = getAbandonAlert(
    !!abandon?.statut.estEnCours(),
    rôle,
    identifiantProjet.formatter(),
  );

  return {
    étapes,
    cahierDesChargesData,
    doitAfficherAttestationDésignation: !!lauréat.attestationDésignation,
    raccordement,
    abandonAlert,
  };
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
