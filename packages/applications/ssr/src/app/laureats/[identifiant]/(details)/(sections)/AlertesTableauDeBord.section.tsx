import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getAchèvement, getOptionalAbandon } from '../../_helpers';
import { type Alerte, AlertesTableauDeBord } from './AlertesTableauDeBord';

type AlertesTableauDeBordSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const AlertesTableauDeBordSection = ({
  identifiantProjet: identifiantProjetValue,
}: AlertesTableauDeBordSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const abandon = await getOptionalAbandon(identifiantProjet.formatter());
    const achèvement = await getAchèvement(identifiantProjet.formatter());

    const abandonAlertes = mapToAbandonAlert({ identifiantProjet, rôle, abandon });
    const achèvementAlertes = mapToAchèvementAlert(achèvement.estAchevé, rôle);

    return <AlertesTableauDeBord abandon={abandonAlertes} achèvement={achèvementAlertes} />;
  });

type MapToAbandonAlertProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
  abandon: Lauréat.Abandon.ConsulterAbandonReadModel | undefined;
};

const mapToAbandonAlert = ({
  identifiantProjet,
  rôle,
  abandon,
}: MapToAbandonAlertProps): Alerte | undefined => {
  if (abandon?.statut.estAccordé()) {
    return {
      label: 'Ce projet a été abandonné.',
    };
  }

  if (!abandon?.statut.estEnCours()) {
    return undefined;
  }

  if (rôle.estPorteur()) {
    return {
      label: `
        Vous ne pouvez pas faire de demande ou de déclaration sur Potentiel car vous avez une demande d'abandon en cours pour ce projet.
        ${abandon.statut.estConfirmationDemandée() ? " Votre demande est en attente d'une confirmation de votre part." : ''}
        ${!abandon.statut.estConfirmé() ? " Si celle-ci n'est plus d'actualité, merci de l'annuler." : ''}
      `,
      url: Routes.Abandon.détail(identifiantProjet.formatter(), abandon.demandéLe.formatter()),
    };
  }

  if (rôle.estDGEC() || rôle.estDreal() || rôle.estAdmin()) {
    return {
      label: "Une demande d'abandon est en cours pour ce projet.",
      url: Routes.Abandon.détail(identifiantProjet.formatter(), abandon.demandéLe.formatter()),
    };
  }
};

const mapToAchèvementAlert = (estAchevé: boolean, rôle: Role.ValueType): Alerte | undefined => {
  if (!(estAchevé && rôle.estPorteur())) {
    return undefined;
  }

  return {
    label:
      "Ce projet est achevé car vous avez transmis l'attestation de conformité au Cocontractant. Vous ne pouvez donc plus faire de demande ou de déclaration de modification sur Potentiel. Il vous est toujours possible de mettre à jour les parties Garanties financières et Raccordement au réseau de votre projet.",
  };
};
